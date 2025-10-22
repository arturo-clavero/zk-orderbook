import { batch } from "../utxo/BatchManager.js";
import { createOutput } from "../utxo/utxo-utils.js";
import { _setInputs } from "./action-utils.js";

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