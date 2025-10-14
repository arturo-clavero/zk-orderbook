import { bufferToBigInt, callCircuit, membersToStrings, poseidonToU64 } from './utils.js';
import {IndexedMerkleTree} from './index.js';
import crypto from 'crypto';
import { Barretenberg, Fr } from "@aztec/bb.js";

// import {poseidon1, poseidon2, poseidon3} from 'poseidon-lite';

const balanceTree = new IndexedMerkleTree;
let userSecrets = {}; // store each user's secret

async function writeBalanceProofInputs(userId, amount) {
    if (!(userId in userSecrets)) {
        userSecrets[userId] = bufferToBigInt(crypto.randomBytes(32));
    }
    const userSecret = userSecrets[userId];
    const newBalanceSalt = bufferToBigInt(crypto.randomBytes(16));
    

    const value = await poseidonToU64([userSecret, amount, newBalanceSalt]);    
    const key = (await poseidonToU64([userSecret]));//add token!

    console.log("key; ", key);
    const insertionProof = balanceTree.insertItem(key, value);
    const inputs = membersToStrings(insertionProof);
console.log("insertion proof: ", insertionProof);
    console.log("inputs: ",inputs );
    return inputs;
}


async function writeBalanceVerify(userId, amount){
    const inputs = await writeBalanceProofInputs(userId, amount);
    const success = await callCircuit("insertion/",  inputs);
    return success;

}

export {
    writeBalanceProofInputs,
    writeBalanceVerify,
}
