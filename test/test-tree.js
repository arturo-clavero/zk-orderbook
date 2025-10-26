import { callCircuit, verifyLatestProof } from "../proofs/circuit.js";
import { tree } from "../proofs/tree/balance-tree.js";
import { MerkleTree } from "../proofs/tree/merkle-tree.js";
import { hash } from "../proofs/tree/tree-utils.js";

function printArray(array){
    let string = "";
    for(let i = 0; i < array.length; i++){
        if (i + 1 < array.length)
            string += `${array[i]}, `;
        else
            string+= array[i];
    }
    return string;
}

const DEPTH = 3;

async function testTree(){
    const proof_ = await tree.insertInShadow([1n], 0);
    // console.log("proof, ", proof_);
    const p = await callCircuit(proof_, "batch", false);
    console.log("public inputs", p.publicInputs);
    const success = await verifyLatestProof(p.proof, p.publicInputs);
    console.log("success: ", success);

        const proof_1 = await tree.insertInShadow([1n], 0);

    const p1 = await callCircuit(proof_1, "batch", false);
    console.log("public inputs", p1.publicInputs);
    const success1 = await verifyLatestProof(p1.proof, p1.publicInputs);
    console.log("success: ", success1);

    // const root = await tree.getRoot();
    // console.log("root: ", root.toString(10));
    // await tree.insertMultipleItems([
    //     await hash(["A"]),
    //     await hash(["B"]),
    //     await hash(["C"]),
    // ]);
    // await tree.verifyAll();
    // console.log("SHADOW!");
    // const shadow = tree.clone();
    // await shadow.verifyAll();
    // const newItem = await hash(["D"]);
    // console.log("new item: ", newItem);
    // await shadow.insertItem(newItem);
    // console.log('shadow 2nd:');
    // await shadow.verifyAll();
    // console.log("tree...");
    // await tree.verifyAll();

}

await testTree();
