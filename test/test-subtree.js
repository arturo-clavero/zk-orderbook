import { callCircuit, verifyLatestProof } from "../proofs/circuit.js";
import { tree } from "../proofs/tree/balance-tree.js";
import { MerkleTree } from "../proofs/tree/merkle-tree.js";
import { hash, membersToStrings } from "../proofs/tree/tree-utils.js";

async function test(){
    // create main tree
    const mainTree = new MerkleTree(4); // 16 leaves
    // fill first 8 leaves
    console.log("first tree...");
    for (let i = 0; i < 8; i++) await mainTree.insertItem(await hash([i]));

    // create subtree of 4 new leaves
        console.log("sub tree...");

    const subtreeLeaves = [];
    for (let i = 10; i < 14; i++) subtreeLeaves.push(await hash([i]));

    // insert dynamically
    console.log("inserting...");
    const inputs = await mainTree.insertNewSubtree(subtreeLeaves);
    const {proof, publicInputs} = await callCircuit(inputs, "actions/batch");
    const success = await verifyLatestProof(proof, publicInputs);
    console.log("cirucit verified: ", success);
}

await test();