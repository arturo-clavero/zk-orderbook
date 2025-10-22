import { batch } from "../utxo/BatchManager.js";
import { createOutput } from "../utxo/utxo-utils.js";
import { _setInputs } from "./action-utils.js";

export async function queueJoin(inputs, covered){
    _setInputs(inputs);
    const output = await createOutput(inputs[0].user, inputs[0].token, covered);
    const circuitData = {
        inputs,
        ouputs: [output],
        user: inputs[0].user,
        token: inputs[0].token,
        covered
    }
    batch.addAction("join", circuitData);
}