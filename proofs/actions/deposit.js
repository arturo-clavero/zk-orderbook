import { log_state } from "../../test/test-utxo.js";
import { callCircuit, verifyLatestProof } from "../circuit.js";
import { tree } from "../tree/balance-tree.js";
import { membersToStrings } from "../tree/tree-utils.js";
import { batch } from "../utxo/BatchManager.js";
import { createOutput } from "../utxo/utxo-utils.js";
import { getNewOutxoInputs, getToken } from "./action-utils.js";

export async function queueDeposit(user, tokenString, amount){
    const token = getToken(tokenString);
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

export async function proofDeposits(inputs){
    const proofs = [];
    for (const i of inputs) 
    {
        const success = await proofSingleDeposit(i.outputs[0], i.amount);
        if (success == false)
            throw new Error("verification failed...", i.outputs[0]);
        //gotta do something upon error....
    }
    console.log(" ", proofs);
    //batch proof... 

}

export async function proofSingleDeposit(output, amount){
    // return true;//TESTING DELETE
    const outputUtxo = getNewOutxoInputs(output);
    const pi = {
        outputUtxo,
        target: amount,
    }
    const {proof, publicInputs} = await callCircuit(pi, "actions/deposit");
    const success = await verifyLatestProof(proof, publicInputs);
    console.log("deposit.js: verified? ", success); 
    return(success);
}

