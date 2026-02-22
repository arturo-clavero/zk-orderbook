// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract MockVerifier {

    bytes public INVALID_PROOF = hex"4040";

    function verify(bytes calldata _proof, bytes32[] calldata /*_publicInputs*/) external view returns (bool) {
        if (keccak256(_proof) == keccak256(INVALID_PROOF))
            return false;
        return true;
    }
}
