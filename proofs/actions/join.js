import { callCircuit, verifyLatestProof } from "../circuit.js";
import { getUserSecret } from "../userSecret.js";
import { batch } from "../utxo/BatchManager.js";
import { createOutput } from "../utxo/utxo-utils.js";
import { pool } from "../utxo/UtxoPool.js";
import { _setInputs, getNewOutxoInputs, getOldOutxoInputs } from "./action-utils.js";

export async function queueJoin(inputs, covered, isReserved = false, prevId = -1){
    _setInputs(inputs);
    const output = await createOutput(inputs[0].user, inputs[0].token, covered);
    output.isReserved = isReserved;
    const circuitData = {
        inputs,
        outputs: [output],
        user: inputs[0].user,
        token: inputs[0].token,
        covered
    }
    const id = batch.addAction("join", circuitData, prevId);
    return {
        id, 
        output
    }
}

export async function proofJoins(inputs){
    const nullifiers = [];
    for (const i of inputs) 
    {
        const success = await proofSingleJoin(
            i.inputs, //2-4
            i.outputs[0], //1
            getUserSecret(i.user),
        );
        if (success){
            nullifiers.push(...i.inputs.map(input => input.nullifier));
        }
    }
    return nullifiers;
}

async function proofSingleJoin(_inputs, _output, userSecret){
    const max = 3;
    // const inputs = [];
    // for (let i = 0; i < max; i++)
    const inputs = await getOldOutxoInputs(_inputs, 3);
    console.log('inputs: ', inputs);
    const output = getNewOutxoInputs(_output);
    const pi = {
        inputsA: inputs.inputs[0],
        inputsApub: inputs.inputsPub[0],
        inputsB: inputs.inputs[1],
        inputsBpub: inputs.inputsPub[1],
        inputsC: inputs.inputs[2],
        inputsCpub: inputs.inputsPub[2],
        output,
        userSecret: userSecret.toString(10),
        oldRoot: inputs.root.toString(10),
    }
    console.log("pi: ", pi);
    const {proof, publicInputs} = await callCircuit(pi, "actions/join");
    const success = await verifyLatestProof(proof, publicInputs);
    console.log("withdraw.js: verified? ", success); 
    return(success);
}