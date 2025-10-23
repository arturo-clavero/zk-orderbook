import { hash, randomSalt } from "../tree/tree-utils.js";
import { pool } from "./UtxoPool.js";

const TOKEN_IDS = {
  ETH: 1,
  DAI: 2,
  USDC: 3,
};


export async function UTXO(user, amount, tokenString){
    const token = TOKEN_IDS[tokenString];
    const salt = randomSalt();
    const note = await hash([amount, token, salt]);
    const utxo = {
        note, 
        user,
        token,
        amount,
        salt,
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
