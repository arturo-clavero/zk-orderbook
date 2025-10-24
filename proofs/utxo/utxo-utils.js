import { hash, randomSalt } from "../tree/tree-utils.js";
import { getUserSecret } from "../userSecret.js";
import { pool } from "./UtxoPool.js";




export async function UTXO(user, amount, token){
    const salt = randomSalt();
    const note = await hash([amount, token, salt]);
    const nullifier = await hash([getUserSecret(user), note])
    const utxo = {
        note, 
        user,
        token,
        amount,
        salt,
        nullifier,
        pending : false,
        spent: false,
        isReserved: false,
    }
    return utxo;
}

export async function createOutput(user, token, amount) {
    const utxo = await UTXO(user,amount, token);
    pool.setPendingOutput(user, token, utxo);
    return utxo;
}
