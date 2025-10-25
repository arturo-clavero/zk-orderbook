// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {IVerifier} from "./Verifier.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Permit.sol";

contract DarkPool is ReentrancyGuard {
    error DarkPool__InvalidWithdrawProof();
    error DarkPool__NullifierAlreadySpent(bytes32 nullifier);
    error DarkPool__TransferFailed();
    error DarkPool__InvalidAmount();

    event Deposit(address indexed user, address indexed token, uint256 amount);
    event BatchVerified(uint256 indexed id, bool success);
    //event WithdrawExecuted(address indexed user, address indexed token, uint256 amount);

    mapping(bytes32 => bool) private s_nullifiers;
    IVerifier private immutable i_verifier;

    constructor(IVerifier _verifier) {
        i_verifier = _verifier;
    }

    struct Withdrawal {
        address user;
        address token; // address(0) = ETH
        uint256 amount;
    }

    function depositETH() external payable nonReentrant {
        if (msg.value == 0) revert DarkPool__InvalidAmount();
        emit Deposit(msg.sender, address(0), msg.value);
    }

    function depositToken(address token, uint256 amount) external nonReentrant {
        if (amount == 0) revert DarkPool__InvalidAmount();
        bool ok = IERC20(token).transferFrom(msg.sender, address(this), amount);
        if (!ok) revert DarkPool__TransferFailed();
        emit Deposit(msg.sender, token, amount);
    }

    function depositTokenWithPermit(
        address token,
        uint256 amount,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external nonReentrant {
        if (amount == 0) revert DarkPool__InvalidAmount();
        IERC20Permit(token).permit(msg.sender, address(this), amount, deadline, v, r, s);
        bool ok = IERC20(token).transferFrom(msg.sender, address(this), amount);
        if (!ok) revert DarkPool__TransferFailed();
        emit Deposit(msg.sender, token, amount);
    }

    
    function verifyAndWithdraw(
        uint256 id,
        bytes32[] calldata _nullifiers,
        bytes calldata _proof,
        bytes32[] calldata _publicInputs,
        Withdrawal[] calldata withdrawals
    ) external payable nonReentrant {
        // Prevent double-spending
        for (uint256 i = 0; i < _nullifiers.length; i++) {
            if (s_nullifiers[_nullifiers[i]]) {
                emit BatchVerified(id, false);
                revert DarkPool__NullifierAlreadySpent(_nullifiers[i]);
            }
            s_nullifiers[_nullifiers[i]] = true;
        }
    
        // Verify proof
        if (_publicInputs.length > 0 ) {
            bool success = i_verifier.verify(_proof, _publicInputs);
            if (!success) {
                emit BatchVerified(id, false);
                revert DarkPool__InvalidWithdrawProof();
            }
        }
        emit BatchVerified(id, true);

        // Execute withdrawals
        for (uint256 i = 0; i < withdrawals.length; i++) {
            _executeWithdraw(
                withdrawals[i].user,
                withdrawals[i].token,
                withdrawals[i].amount
            );
        }
    }

    function _executeWithdraw(address user, address token, uint256 amount) internal {
        if (amount == 0) return;

        if (token == address(0)) {
            (bool sent, ) = payable(user).call{value: amount}("");
            if (!sent) revert DarkPool__TransferFailed();
        } else {
            bool ok = IERC20(token).transfer(user, amount);
            if (!ok) revert DarkPool__TransferFailed();
        }
        // emit WithdrawExecuted(user, token, amount);
    }

    receive() external payable {}
}
