import { randomSalt, hash } from "./tree/utils.js";
import { UTXO } from "./tree/utxoManager.js";


async function queueDeposit(pool, user, token, amount, salt = randomSalt()) {
    const note = await hash([amount, token, salt]);
    const utxo = new UTXO({
        note,
        user,
        token,
        amount,
        salt,
    });

    pool.addPendingOutput(user, token, utxo);
    console.log(`Deposit pending: ${amount} ${token} for ${user}`);
    return utxo;
}

// function finalizeDeposits(pool, user, token) {
//     pool.finalizeBatch(user, token);
//     console.log(`Finalized deposits for ${user} (${token})`);
// }


function withdraw(pool, user, token, targetAmount, outputSalt = randomSalt()) {
    const inputs = pool.selectForAmount(user, token, targetAmount);
    if (!inputs) {
        //invalid withdtawal.... if set pedning balacne is less than amounf
        console.error(`Not enough funds for ${user} to withdraw ${targetAmount} ${token}`);
        return { inputs: [], outputs: [] };
    }

    const total = inputs.reduce((s, u) => s + u.amount, 0);
    const change = total - targetAmount;

    for (const i of inputs) pool.addPendingInput(user, token, i.note);

    const outputs = [];

    if (change > 0) {
        const note = hash([change, token, outputSalt]);
        const changeUtxo = new UTXO({
            note,
            owner: user,
            token,
            amount: change,
            salt: outputSalt,
            pending: true,
            spent: false,
        });
        pool.addPendingOutput(user, token, changeUtxo);
        outputs.push(changeUtxo);
    }

    console.log(`Withdrawal pending: ${targetAmount} ${token} by ${user}`);
    return { inputs, outputs };
}


/*
    Aggregates small UTXOs belonging to the same user and token into a single larger one.
    Useful for reducing fragmentation and keeping the UTXO set small.
*/
function aggregateSmallUtxos(pool, user, token, threshold = 10) {
    const small = pool.getAvailable(user, token).filter((u) => u.amount < threshold);
    if (small.length < 2) return [];

    const total = small.reduce((sum, u) => sum + u.amount, 0);
    const salt = randomSalt();
    const note = hash([total, token, salt]);

    for (const s of small) pool.markPending(user, token, s.note);

    const newUtxo = new UTXO({
        note,
        owner: user,
        token,
        amount: total,
        salt,
        pending: true,
        spent: false,
    });

    pool.addUtxo(user, token, newUtxo);
    console.log(`Aggregated ${small.length} small UTXOs into one (${total} ${token})`);
    return [newUtxo];
}



export {
    queueDeposit,
    withdraw,
    aggregateSmallUtxos,
};


/*
    Executes all end-of-batch maintenance tasks:
    - Finalizes all pending UTXOs
    - Aggregates small UTXOs
    - Updates balances
*/
// function endOfBatch(pool, users, tokens) {
//     for (const user of users) {
//         for (const token of tokens) {
//             pool.finalizeBatch(user, token);
//             aggregateSmallUtxos(pool, user, token);
//         }
//     }
//     console.log("Batch finalized and balances updated");
// }