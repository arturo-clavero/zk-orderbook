import { hash, randomSalt } from "../tree/utils";

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

export async function createOutput(pool, user, token, amount) {
    const utxo = await UTXO(user, amount, token);
    pool.setPendingOutput(user, token, utxo);
}

export function sortExtraUtxos(utxos, max, sortFt){
   const totalUtxos = utxos.length;

    for (let i = 0; i < totalUtxos; ){
        const maxUtxo = [];
        const covered = 0;
        for (let j = 0; j < max; j++){
            let index = j + i;
            if (index >= totalUtxos)
                break;
            maxUtxo.push(utxos[index]);
            covered += utxos[index].amount;
        }
        sortFt(maxUtxo, covered);
        i += max;
    }
}