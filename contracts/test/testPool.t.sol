// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {Test, console} from "forge-std/Test.sol";
import {DarkPool} from "../src/DarkPool.sol"; // Adjust path to your contract
import {IVerifier} from "../src/Verifier.sol";
import {MockVerifier} from "./MockVerifier.sol";
import {MockERC20, MockERC20Permit} from "./MockTokens.sol";

contract CounterTest is Test {
    DarkPool public pool;
    DarkPool public nonTestPool;

    MockERC20 token1;
    MockERC20 token2;
    MockERC20Permit tokenPermit1;
    MockERC20Permit tokenPermit2;
    address owner = vm.addr(1);
    address alice = vm.addr(2);
    address bob = vm.addr(3);
    uint256 constant AMT = 1e18;
    uint256 constant AMT_ETH = 10 ether;
    bytes32 constant EMPTYROOT = 0x2d78ed82f93b61ba718b17c2dfe5b52375b4d37cbbed6f1fc98b47614b0cf21b;



    function setUp() public {
        vm.startPrank(owner);

        //deploy mocks
        token1 = new MockERC20();
        token2 = new MockERC20();
        tokenPermit1 = new MockERC20Permit();
        tokenPermit2 = new MockERC20Permit();
        MockVerifier verifier = new MockVerifier();

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
        pool = new DarkPool(IVerifier(address(verifier)), EMPTYROOT, true);
        nonTestPool = new DarkPool(IVerifier(address(verifier)), EMPTYROOT, false);

        vm.stopPrank();
    }

    // -----------------------------
    // depositETH
    // -----------------------------

    function testFuzz_depositETH_succeeds(uint256 value) public {
        vm.assume(value > 0 && value < AMT);
        uint256 before = address(pool).balance;
        vm.prank(address(this));
        (bool ok, ) = address(pool).call{value: value}(abi.encodeWithSignature("depositETH()"));
        require(ok, "call failed");
        assertEq(address(pool).balance, before + value);
    }

    function test_depositETH_reverts_on_zero() public {
        vm.prank(address(this));
        vm.expectRevert();
        (bool ok, ) = address(pool).call(abi.encodeWithSignature("depositETH()"));
        assertTrue(!ok || address(pool).balance == 0);
    }

    // -----------------------------
    // depositToken
    // -----------------------------
    function test_depositToken_succeeds() public {
        vm.startPrank(alice);
        token1.approve(address(this), AMT);
        token1.approve(address(pool), AMT);
        pool.depositToken(address(token1), AMT);
        vm.stopPrank();

        assertEq(token1.balanceOf(address(pool)), AMT);
    }

    function test_depositToken_reverts_on_zero() public {
        vm.prank(alice);
        vm.expectRevert();
        pool.depositToken(address(token1), 0);
    }

    // -----------------------------
    // depositTokenWithPermit
    // -----------------------------
    function test_depositTokenWithPermit_succeeds() public {
        vm.startPrank(alice);
        assertGt(tokenPermit1.balanceOf(alice), 0);
        pool.depositTokenWithPermit(address(tokenPermit1), AMT, block.timestamp + 1 hours, 0, bytes32(0), bytes32(0));

        assertEq(tokenPermit1.balanceOf(address(pool)), AMT);
    }

    // -----------------------------
    // verifyAndWithdraw
    // -----------------------------
    // function test_verifyAndWithdraw_reverts_invalid_root() public {
    //     bytes32[] storage nulls;
    //     nulls.push(keccak256("null1"));
        
    //     bytes memory proof = hex"00";

    //     bytes32[] storage publicInputs;
    //     publicInputs.push(keccak256("newroot"));
    //     publicInputs.push(keccak256("wrongroot"));

    //     DarkPool.Withdrawal[] memory w;

    //     vm.expectRevert(DarkPool.DarkPool__InvaildCurrentRoot.selector);
    //     pool.verifyAndWithdraw(1, nulls, proof, publicInputs, w);
    // }

    // function test_verifyAndWithdraw_executes_eth_withdraw() public {
    //     // fund pool with ETH (so it can pay out)
    //     uint256 depositAmount = 1 ether;
    //     vm.deal(address(this), depositAmount);
    //     vm.prank(address(this));
    //     (bool ok, ) = address(pool).call{value: depositAmount}(abi.encodeWithSignature("depositETH()"));
    //     require(ok, "deposit failed");

    //     // nullifier
    //     bytes32;
    //     nulls[0] = keccak256("n-eth");

    //     bytes memory proof = hex"00";

    //     bytes32;
    //     publicInputs[0] = keccak256("newroot");
    //     publicInputs[1] = emptyRoot; // must equal current root

    //     // prepare withdrawals: send 0.5 ETH to bob
    //     DarkPool.Withdrawal;
    //     w[0] = DarkPool.Withdrawal({user: bob, token: address(0), amount: 0.5 ether});

    //     uint256 bobBefore = bob.balance;
    //     // call verifyAndWithdraw (mock verifier returns true)
    //     pool.verifyAndWithdraw(1, nulls, proof, publicInputs, w);
    //     assertEq(bob.balance, bobBefore + 0.5 ether);
    //     // pool root should be updated to newroot
    //     assertEq(pool.root(), publicInputs[0]);
    // }

    // function test_verifyAndWithdraw_executes_token_withdraw() public {
    //     // mint tokens to pool so it can pay out
    //     token.mint(address(pool), 1e18);

    //     // nullifier
    //     bytes32;
    //     nulls[0] = keccak256("n-token");

    //     bytes memory proof = hex"00";

    //     bytes32;
    //     publicInputs[0] = keccak256("newroot2");
    //     publicInputs[1] = EMPTYROOT;

    //     // withdrawals: send 1e18 to bob
    //     DarkPool.Withdrawal;
    //     w[0] = DarkPool.Withdrawal({user: bob, token: address(token), amount: 1e18});

    //     uint256 bobBefore = token.balanceOf(bob);
    //     pool.verifyAndWithdraw(2, nulls, proof, publicInputs, w);
    //     assertEq(token.balanceOf(bob), bobBefore + 1e18);
    //     assertEq(pool.root(), publicInputs[0]);
    // }

    // function test_verifyAndWithdraw_double_spend_reverts() public {
    //     // setup: give pool some ETH to payout
    //     vm.deal(address(this), 1 ether);
    //     vm.prank(address(this));
    //     (bool ok, ) = address(pool).call{value: 1 ether}(abi.encodeWithSignature("depositETH()"));
    //     require(ok);

    //     bytes32;
    //     bytes32 n = keccak256("double");
    //     nulls[0] = n;

    //     bytes memory proof = hex"00";

    //     bytes32;
    //     publicInputs[0] = keccak256("newroot3");
    //     publicInputs[1] = emptyRoot;

    //     DarkPool.Withdrawal;

    //     // first call should succeed
    //     pool.verifyAndWithdraw(3, nulls, proof, publicInputs, w);

    //     // second call with same nullifier should revert
    //     vm.expectRevert(abi.encodeWithSelector(DarkPool.DarkPool__NullifierAlreadySpent.selector, n));
    //     pool.verifyAndWithdraw(4, nulls, proof, publicInputs, w);
    // }

    // function test_verify_and_withdraw_correct() public {
    //     bytes32 root0 = EMPTYROOT;
    //     bytes32 root1 = keccak256("root1");
    //     bytes32 root2 = keccak256("root2");
    //     bytes32 null1 = keccak256("null0");
    //     bytes32 null2 = keccak256("null1");
        
    //     bytes32;
    //     nulls[0] = null1;
    //     bytes memory proof = hex"00";
    //     bytes32;
    //     publicInputs[0] = root1;
    //     publicInputs[1] = root0;

    //     DarkPool.Withdrawal[] memory w;

    //     assertEq(pool.root(), root0);
    //     assertEq(pool.s_nullifiers(null1), false);
    //     pool.verifyAndWithdraw(1, nulls, proof, publicInputs, w);
    //     assertEq(pool.root(), root1);
    //     assertEq(pool.s_nullifiers(null1), true);
        
    //     assertEq(pool.s_nullifiers(null2), false);
    //     nulls[0] = null2;
    //     publicInputs[0] = root2;
    //     publicInputs[1] = root1;

    //     pool.verifyAndWithdraw(1, nulls, proof, publicInputs, w);
    //     assertEq(pool.root(), root2);
    //     assertEq(pool.s_nullifiers(null1), true);
    //     assertEq(pool.s_nullifiers(null2), true);
    // }

    // -----------------------------
    // testReset: current contract reverts when test_mode == true
    // (this documents current behaviour of the contract)
    // -----------------------------
 
    // function test_testReset_reverts_emptyRoot() public {
    //     bytes memory proof = hex"00";
    //     test_verify_and_withdraw_correct();
    //     bytes32 root1 = keccak256("root3");

    //     bytes32[] storage old_nulls;
    //     old_nulls.push(keccak256("null1"));
    //     bytes32[] storage new_nulls;
    //     old_nulls.push(keccak256("null2"));

    //     bytes32[] storage new_publicInputs;
    //     new_publicInputs.push(keccak256("root3"));
    //     new_publicInputs.push(keccak256("root2"));

    //     bytes32[] storage old_publicInputs;
    //     old_publicInputs.push(keccak256("root1"));
    //     old_publicInputs.push(EMPTYROOT);

    //     DarkPool.Withdrawal[] memory w;

    //     vm.expectRevert();//invalid root;
    //     pool.verifyAndWithdraw(2, new_nulls, proof, old_publicInputs, w);

    //     vm.expectRevert();//invalid nulls;
    //     pool.verifyAndWithdraw(2, old_nulls, proof, new_publicInputs, w);

    //     pool.testReset();
    //     pool.verifyAndWithdraw(2, old_nulls, proof, old_publicInputs, w);
    // }
    
    // function test_testReset_reverts_when_testModeTrue() public {
    //     vm.expectRevert(bytes("Only test mode"));
    //     nonTestPool.testReset();
    // }

}
