// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20Mock} from "@openzeppelin/contracts/mocks/token/ERC20Mock.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract MockERC20 is ERC20Mock {
    constructor() ERC20Mock() {}

    function _approve(address owner, address spender, uint256 amount, bool) internal virtual override {
        super._approve(owner, spender, amount, true);
    }
}

contract MockERC20Permit is MockERC20 {
    constructor()
        MockERC20()
    {}
    
    function permit(
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public virtual {
        _approve(owner, spender, value);
    }

}
