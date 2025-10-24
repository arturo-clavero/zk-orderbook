import { tree } from "../tree/balance-tree.js";
import { membersToStrings } from "../tree/tree-utils.js";
import { pool } from "../utxo/UtxoPool.js";
import { queueJoin } from "./join.js";

export function _setInputs(utxos){
    for (const u of utxos) pool.setPendingInput(u.user, u.token, u.note, u.amount);
    return true;
}

export async function _tooManyInputs(inputs, maxInputs, prevId = -1){
// console.log("\n\n<too many inputs...>");
// console.log("inputs.length: ", inputs.length);
    let lastId = 0;
    let covered = 0;
    let joinMax = 3;
    const joinOutputs = [];
    for (let i  = 0; i < inputs.length; ){
        let justCovered = 0;
        const joinInputs = [];
        // console.log("next round [", i,"]");
        for (let j = 0; j < joinMax; j++){
            if (j + i >= inputs.length)
                break;
            justCovered += inputs[i+j].amount;
            joinInputs.push(inputs[i + j]);
            // console.log("pushing [", i + j, "]");
        }
        // console.log("join ", joinInputs, justCovered);
        const join = await queueJoin(joinInputs, justCovered, true, prevId);
        covered += justCovered;
        lastId = join.id;
        joinOutputs.push(join.output);
        i += joinMax;
    }
    if (joinOutputs.length > maxInputs){
        return _tooManyInputs(joinOutputs, maxInputs, lastId);
    }
    return {
        lastId,
        utxos: joinOutputs,
        covered,
    }
}

export function formatProofInputs(obj) {
    const out = {};
    for(let key of Object.keys(obj)) {
        if (typeof obj[key] === "boolean") {
            out[key] = obj[key];
        }
        else{
            out[key] = obj[key].toString(10);
        }
    }
    return out;
}

export function getOutxoInputs(output){
    const inputs = {
        note: output.note,
        salt: output.salt,
        amount: output.amount,
        token: output.token,
    };
    return membersToStrings(inputs, tree.mainTree.DEPTH);
}