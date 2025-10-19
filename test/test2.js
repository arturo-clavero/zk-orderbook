import { testInsert, testUpdate } from "../proofs/tree/balanceTree.js";
import { callCircuit } from "../proofs/verify.js";

async function test() {

    const inputs = [];

    console.log("\nFIRST PROOF...\n");
    inputs.push(await testInsert("a", 10, false));
    console.log("\nSECOND PROOF...\n");
    inputs.push(await testInsert("b", 20, false));
    console.log("\nTHIRD PROOF...\n");

    inputs.push(await testInsert("c", 30, false));

    const recursive = [];
    const publicInputs = [];
    for (let i = 0; i < inputs.length; i++){
        recursive.push(inputs[i].recursive);
        publicInputs.push(inputs[i].publicInputs);
    }

    const success = await callCircuit({recursive, publicInputs}, 'recursive');
    console.log("final veridetic: ", success);
}

await test();