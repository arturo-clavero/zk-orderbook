// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {DarkPool} from "../src/DarkPool.sol";
import {HonkVerifier, IVerifier} from "../src/Verifier.sol";


contract DeployDarkPool is Script {
    function run() external {
        bytes32 emptyRoot = 0x2d78ed82f93b61ba718b17c2dfe5b52375b4d37cbbed6f1fc98b47614b0cf21b;
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        HonkVerifier verifier = new HonkVerifier();

        DarkPool pool = new DarkPool(IVerifier(address(verifier)), emptyRoot, true);

        console.log("DarkPool deployed at:", address(pool));

        vm.stopBroadcast();
    }
}
