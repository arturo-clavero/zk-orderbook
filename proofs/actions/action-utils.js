import { pool } from "../utxo/UtxoPool.js";
import { queueJoin } from "./join.js";

export function _setInputs(utxos){
    for (const u of utxos) pool.setPendingInput(u.user, u.token, u.note);
    return true;
}

export async function _tooManyInputs(inputs, maxInputs){
    //we need to reduce thes einputs to max!
    let lastId = 0;
    let covered = 0;
    let joinMax = 3;
    const joinOutputs = [];
    for (let i  = 0; i < inputs.length; i++){
        let justCovered = 0;
        const joinInputs = [];
        for (let j = 0; j < joinMax; j++){
            if (j + i < inputs.length)
                break;
            justCovered += inputs[i+j].amount;
            joinInputs.push(inputs[i + j]);
        }
        const join = await queueJoin(joinInputs, justCovered);
        covered += justCovered;
        lastId = join.id;
        joinOutputs.push(join.output);
    }
    if (joinOutputs.length > maxInputs){
        return _tooManyInputs(joinOutputs, maxInputs);
    }
    return {
        lastId,
        joinOutputs,
        covered,
    }
}
