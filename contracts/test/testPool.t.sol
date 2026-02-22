// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {Test, console} from "forge-std/Test.sol";
import {DarkPool} from "../src/DarkPool.sol"; // Adjust path to your contract
import {IVerifier} from "../src/Verifier.sol";
import {MockVerifier} from "./MockVerifier.sol";
import {MockERC20, MockERC20Permit} from "./MockTokens.sol";

contract DarkPoolTest is Test {
    DarkPool public pool;
    DarkPool public testPool;

    MockERC20 token1;
    MockERC20 token2;
    MockERC20Permit tokenPermit1;
    MockERC20Permit tokenPermit2;
    MockVerifier verifier;
    address owner = vm.addr(1);
    address alice = vm.addr(2);
    address bob = vm.addr(3);
    uint256 constant AMT = 1e18;
    uint256 constant AMT_ETH = 10 ether;
    bytes32 constant EMPTYROOT = 0x2d78ed82f93b61ba718b17c2dfe5b52375b4d37cbbed6f1fc98b47614b0cf21b;
    bytes32 constant PROOF = hex"00";
    uint256 constant MAX_ARRAY_LEN = 10;

    function setUp() public {
        vm.startPrank(owner);

        //deploy mocks
        token1 = new MockERC20();
        token2 = new MockERC20();
        tokenPermit1 = new MockERC20Permit();
        tokenPermit2 = new MockERC20Permit();
        verifier = new MockVerifier();

        //fund
        token1.mint(alice, AMT);
        token1.mint(address(this), AMT);
        token2.mint(bob, AMT);
        token2.mint(address(this), AMT);
        tokenPermit1.mint(alice, AMT);
        tokenPermit1.mint(address(this), AMT);
        tokenPermit2.mint(bob, AMT);
        tokenPermit2.mint(address(this), AMT);

        //give eth
        vm.deal(alice, AMT_ETH);
        vm.deal(bob, AMT_ETH);
        vm.deal(address(this), AMT_ETH);

        //deploy darkpool
        pool = new DarkPool(IVerifier(address(verifier)), EMPTYROOT, MAX_ARRAY_LEN, false);
        testPool = new DarkPool(IVerifier(address(verifier)), EMPTYROOT, MAX_ARRAY_LEN, true);

        vm.stopPrank();
    }

    // -----------------------------
    // depositETH
    // -----------------------------

    function testFuzz_depositETH_succeeds(uint256 value) public {
        vm.assume(value > 0 && value < AMT);
        uint256 before = address(pool).balance;
        vm.prank(address(this));
        (bool ok,) = address(pool).call{value: value}(abi.encodeWithSignature("depositETH()"));
        require(ok, "call failed");
        assertEq(address(pool).balance, before + value);
    }

    function test_depositETH_reverts_on_zero() public {
        vm.prank(address(this));
        vm.expectRevert(abi.encodeWithSelector(DarkPool.DarkPool__InvalidAmount.selector));
        (bool ok,) = address(pool).call(abi.encodeWithSignature("depositETH()"));
        assertTrue(!ok || address(pool).balance == 0);
    }

    // -----------------------------
    // depositToken
    // -----------------------------
    function testFuzz_depositToken_succeeds(uint256 value) public {
        vm.assume(value > 0 && value < AMT);
        vm.startPrank(alice);
        token1.approve(address(pool), value);
        pool.depositToken(address(token1), value);
        vm.stopPrank();
        assertEq(token1.balanceOf(address(pool)), value);
    }

    function test_depositToken_reverts_on_zero() public {
        vm.prank(alice);
        vm.expectRevert(abi.encodeWithSelector(DarkPool.DarkPool__InvalidAmount.selector));
        pool.depositToken(address(token1), 0);
    }


    // -----------------------------
    // depositTokenWithPermit
    // -----------------------------
    function testFuzz_depositTokenWithPermit_succeeds(uint256 value) public {
        vm.assume(value > 0 && value < AMT);
        vm.startPrank(alice);
        assertGt(tokenPermit1.balanceOf(alice), value);
        pool.depositTokenWithPermit(address(tokenPermit1), value, block.timestamp + 1 hours, 0, bytes32(0), bytes32(0));
        assertEq(tokenPermit1.balanceOf(address(pool)), value);
    }

    function test_depositToken_reverts_onZero() public {
        uint256 amount = 0;
        vm.prank(alice);
        vm.expectRevert(abi.encodeWithSelector(DarkPool.DarkPool__InvalidAmount.selector));
        pool.depositTokenWithPermit(address(tokenPermit1), amount, block.timestamp + 1 hours, 0, bytes32(0), bytes32(0));
    }

    // -----------------------------
    // verifyAndWithdraw
    // -----------------------------
    struct Inputs {
        uint256 id;
        bytes32[] nulls;
        bytes proof;
        bytes32[] publicInputs;
        DarkPool.Withdrawal[] w;
    }
    
    struct VerifyWithdraw {
        bytes32[] nulls;
        bytes proof;
        bytes32[] publicInputs;
        DarkPool.Withdrawal[] w;
        uint8[] tokenType;
    }

    function _get_verifyAndWithdraw_inputs(uint256 totalNulls, uint256 totalWithdrawals, uint256[] tokens) view internal returns (VerifyWithdraw memory) {
        VerifyWithdraw memory inputs;

        inputs.nulls = new bytes32[](totalNulls);
        for (uint256 i  = 0; i < totalNulls; i++){
            inputs.nulls[i] = keccak256(abi.encodePacked(block.timestamp + i));
        }

        inputs.proof = hex"00";

        inputs.publicInputs = new bytes32[](2);
        inputs.publicInputs[0] = keccak256(abi.encodePacked(block.timestamp));//generate a new root...
        inputs.publicInputs[1] = pool.root();

        inputs.w = new DarkPool.Withdrawal[](totalWithdrawals);
        inputs.tokenType = new uint8[](totalWithdrawals);
        for (uint256 i = 0; i < totalWithdrawals; i++) {
            w.user = //random user;
            
            if (tokens.length > i)
                inputs.tokens[i] = tokens[i];
            else
            {
                uint256 randN; //get random
                if (randN == 0)
                    inputs.tokens[i] = token1;
                else if (randN == 1)
                    inputs.tokens[i] = token2;
                else if (randN == 2)
                    inputs.tokens[i] = tokenPermit1;
                else if (randN == 3)
                    inputs.tokens[i] = tokenPermit2;
            }
            
            w.token = address(inputs.tokens[i]);
            w.amount = //random number ? 
        }
        return inputs;
    }

    function _check_Withdrawals(VerifyWithdraw inputs, mapping(address=>mapping(address=>uint256)) prevBalances) internal view {
        address[] memory users; //i want ana rray to push
        mapping (address=> (address=>uint256)) expectedBalance;

        for (uint256 i = 0; i < inputs.w.length; i++){
            address user = inputs.w[i].user;
            expectedBalance[user] += 
        }


    }
    function test_verifyAndWithdraw_reverts_invalid_array_length_nullifiers() public {
        uint256 total_nullifiers = MAX_ARRAY_LEN + 1;
        uint256 total_withdrawals = 0;
        VerifyWithdraw memory inputs = _get_verifyAndWithdraw_inputs(total_nullifiers, total_withdrawals);        
        vm.expectRevert(abi.encodeWithSelector(DarkPool.DarkPool__ArrayLengthTooLarge.selector));
        pool.verifyAndWithdraw(1, inputs.nulls, inputs.proof, inputs.publicInputs, inputs.w);
    }

    function test_verifyAndWithdraw_reverts_invalid_array_length_withdrawals() public {
        uint256 total_nullifiers = 1;
        uint256 total_withdrawals = MAX_ARRAY_LEN + 1;
        VerifyWithdraw memory inputs = _get_verifyAndWithdraw_inputs(total_nullifiers, total_withdrawals);        
        vm.expectRevert(abi.encodeWithSelector(DarkPool.DarkPool__ArrayLengthTooLarge.selector));
        pool.verifyAndWithdraw(1, inputs.nulls, inputs.proof, inputs.publicInputs, inputs.w);
    }

    function _checkNullifiersNotSpent(VerifyWithdraw memory inputs)internal view{
        for (uint256 i = 0; i < inputs.nulls.length; i++){
            assertEq(pool.s_nullifiers(inputs.nulls[i]), false);
        }
    }

    function _checkNullifiersSpent(VerifyWithdraw memory inputs) internal view{
        for (uint256 i = 0; i < inputs.nulls.length; i++){
            assertEq(pool.s_nullifiers(inputs.nulls[i]), true);
        }
    }

    function testFuzz_verifyAndWithdraw_updates_nullifiers(uint256 totalNulls) public {
        vm.assume(totalNulls <= MAX_ARRAY_LEN);
        uint256 totalWithdrawals = 0;
        VerifyWithdraw memory inputs = _get_verifyAndWithdraw_inputs(totalNulls, totalWithdrawals);
        _checkNullifiersNotSpent(inputs);
        pool.verifyAndWithdraw(1, inputs.nulls, inputs.proof, inputs.publicInputs, inputs.w);
        _checkNullifiersSpent(inputs);
    }

    function test_verifyAndWithdraw_reverts_doubleSpending() public {
        uint256 totalNulls = 2;
        uint256 totalWithdrawals = 0;
        VerifyWithdraw memory first_inputs = _get_verifyAndWithdraw_inputs(totalNulls, totalWithdrawals);
        pool.verifyAndWithdraw(1, first_inputs.nulls, first_inputs.proof, first_inputs.publicInputs, first_inputs.w);
        VerifyWithdraw memory second_inputs = _get_verifyAndWithdraw_inputs(totalNulls, totalWithdrawals);
        vm.expectRevert(abi.encodeWithSelector(DarkPool.DarkPool__NullifierAlreadySpent.selector, first_inputs.nulls[0]));
        pool.verifyAndWithdraw(2, first_inputs.nulls, second_inputs.proof, second_inputs.publicInputs, second_inputs.w);
    }

    function test_verifyAndWithdraw_reverts_invalid_root() public {
        uint256 total_nullifiers = 1;
        uint256 total_withdrawals = 0;
        VerifyWithdraw memory inputs = _get_verifyAndWithdraw_inputs(total_nullifiers, total_withdrawals);
        inputs.publicInputs[1] = keccak256("wrong old root!");
        vm.expectRevert(DarkPool.DarkPool__InvaildCurrentRoot.selector);
        pool.verifyAndWithdraw(1, inputs.nulls, inputs.proof, inputs.publicInputs, inputs.w);
    }

    function test_verifyAndWithdraw_reverts_invalid_proof() public {
        uint256 total_nullifiers = 1;
        uint256 total_withdrawals = 0;
        VerifyWithdraw memory inputs = _get_verifyAndWithdraw_inputs(total_nullifiers, total_withdrawals);
        inputs.proof = verifier.INVALID_PROOF();
        vm.expectRevert(DarkPool.DarkPool__InvalidProof.selector);
        pool.verifyAndWithdraw(1, inputs.nulls, inputs.proof, inputs.publicInputs, inputs.w);
    }

    function test_verifyAndWithdraw_verifiesProof() public {
        uint256 total_nullifiers = 1;
        uint256 total_withdrawals = 0;
        VerifyWithdraw memory inputs = _get_verifyAndWithdraw_inputs(total_nullifiers, total_withdrawals);
        assertEq(pool.root(), inputs.publicInputs[1]);
        pool.verifyAndWithdraw(1, inputs.nulls, inputs.proof, inputs.publicInputs, inputs.w);
        assertEq(pool.root(), inputs.publicInputs[0]);
    }

    function testFuzz_executeWithdrawals(uint256 totalWithdrawals) public{
        vm.assume(totalWithdrawals > 0 && totalWithdrawals <= MAX_ARRAY_LEN)
        uint256 totalNulls = 1;
        // uint256 totalWithdrawals = 1;
        VerifyWithdraw inputs = _get_verifyAndWithdraw_inputs(totalNulls, totalWithdrawals);
    }

    function test_reset_reverts_non_test_mode() public {
        vm.expectRevert(abi.encodeWithSelector(DarkPool.DarkPool__InvalidActionOnlyTestMode.selector));
        pool.testReset();
    }

    function test_reset_updates_root_and_nullifiers() public {
        uint256 totalNulls = 2;
        uint256 totalWithdrawals = 0;
        VerifyWithdraw memory first_inputs = _get_verifyAndWithdraw_inputs(totalNulls, totalWithdrawals);
        assertEq(testPool.root(), first_inputs.publicInputs[1]);
        testPool.verifyAndWithdraw(1, first_inputs.nulls, first_inputs.proof, first_inputs.publicInputs, first_inputs.w);
        assertEq(testPool.root(), first_inputs.publicInputs[0]);
        
        testPool.testReset();
        
        assertEq(testPool.root(), first_inputs.publicInputs[1]);
        VerifyWithdraw memory second_inputs = _get_verifyAndWithdraw_inputs(totalNulls, totalWithdrawals);
        assertEq(second_inputs.publicInputs[1], first_inputs.publicInputs[1]);
        testPool.verifyAndWithdraw(2, first_inputs.nulls, second_inputs.proof, second_inputs.publicInputs, second_inputs.w);
        assertEq(testPool.root(), second_inputs.publicInputs[0]);
    }
}
