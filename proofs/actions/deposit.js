import { log_state } from "../../test/test-utxo.js";
import { callCircuit, verifyLatestProof } from "../circuit.js";
import { tree } from "../tree/balance-tree.js";
import { membersToStrings } from "../tree/tree-utils.js";
import { batch } from "../utxo/BatchManager.js";
import { createOutput } from "../utxo/utxo-utils.js";
import { formatProofInputs } from "./action-utils.js";

function checkDeposit(){
    return true;
}

export async function queueDeposit(user, token, amount){
    if (!checkDeposit){
        return false;
    }
    //check first the log is true...
    //if not return false or send error to front end...
    const output = await createOutput(user, token, amount);
    const data = {
        outputs: [output],
        user,
        token,
        amount
    }
    log_state("created output");
    batch.addAction("deposit", data);
    return true;
}

export async function proofDeposits(id, inputs){
    const proofs = [];
    for (const i of inputs) proofs.push(await proofSingleDeposit(id, i.outputs[0]));
    console.log("proofs: ", proofs);
    //batch proof... 

}

export async function proofSingleDeposit(id, output){
    const leaf = await tree.shadowProof(id, output.note);
    const outputUtxo = {
        salt: output.salt,
        token: output.token,
        amount: output.amount,
        siblings: leaf.siblings,
        path: leaf.path,
    };
    const outputUtxoPub = {
        note: output.note,
    };
    const pi = {
        newRoot: leaf.root.toString(10),
        outputUtxo: membersToStrings(outputUtxo, tree.mainTree.DEPTH),
        outputUtxoPub: membersToStrings(outputUtxoPub),
    }
    const {proof, publicInputs} = await callCircuit(pi, "actions/deposit");
    //ONLY TESTING
    const success = await verifyLatestProof(proof, publicInputs); 
    console.log("verified? ", success); 
    //END TEST
    return ({proof, publicInputs});
}
// export async function proofSingleDeposit(id, output){
//     console.log("deposit.js: outputs: ", output);
//     const outputFormated = formatProofInputs(output);
//     const leaf = await tree.shadowProof(id, output.note);
//     console.log("deposit.js: leaf:", leaf);
//     // exit(1);
//     const outputUtxo = {
//         salt: outputFormated.salt,
//         token: outputFormated.token,
//         amount: outputFormated.amount,
//         siblings: leaf.siblings,
//         path: leaf.path,
//     };
//         console.log("utxo: ", outputUtxo);
//     const outputUtxoPub = {
//         note: outputFormated.note,
//     };
//     const proofInputs = { root:leaf.root, outputUtxo, outputUtxoPub};
//     // const proofInputs = {outputUtxo, outputUtxoPub};
//     console.log("deposit.js: proofInputs: ", proofInputs);
//     const p = membersToStrings(proofInputs, tree.mainTree.DEPTH);
//     const {proof, publicInputs} = await callCircuit(proofInputs, "actions/deposit");
//     const success = await verifyLatestProof(proof, publicInputs); 
//     console.log("verified? ", success); 
//     return (outputFormated.amount);
// }

