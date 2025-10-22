import { hash, randomSalt } from "../tree/utils.js";
import { pool } from "./UtxoPool.js";

export async function UTXO(user, amount, token){
    const salt = randomSalt();
    const note = await hash([amount, token, salt]);
    const utxo = {
        note, 
        user,
        token,
        amount,
        pending : false,
        spent: false,
        isReserved: false,
    }
    return utxo;
}

export async function createOutput(user, token, amount) {
    const utxo = await UTXO(user, amount, token);
    pool.setPendingOutput(user, token, utxo);
    return utxo;
}
