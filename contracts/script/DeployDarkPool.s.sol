// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {DarkPool} from "../src/DarkPool.sol";
import {HonkVerifier, IVerifier} from "../src/Verifier.sol";

contract DeployDarkPool is Script {
    function run() external {

        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        HonkVerifier verifier = new HonkVerifier();

        DarkPool pool = new DarkPool(IVerifier(address(verifier)));

        console.log("DarkPool deployed at:", address(pool));

        vm.stopBroadcast();
    }
}
