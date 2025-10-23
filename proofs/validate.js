import { proofDeposits } from "./actions/deposit.js";
import { tree } from "./tree/balance-tree.js";
import { batch } from "./utxo/BatchManager.js";

export async function proofBatch(){
    const verifyInputs = batch.proofNextBatch();

    const newRoot = await insertNewOutputs(verifyInputs);

    const d_input = proofDeposits(verifyInputs.id, verifyInputs.deposits);
    // const w_input = proofWithdrawals(verifyInputs.withdrawals);
    // const t_input = proofTrades(verifyInputs.trades);
    // const j_input = proofJoins(verifyInputs.joins);
    // const proof = proofBatch(d_input, w_input, t_input, j_input);

    //call this after event with id
    batch.finalizeBatch(verifyInputs.id);
    return verifyInputs.id;
}

async function insertNewOutputs(verifyInputs) {
    const outputs = ['deposits', 'withdrawals', 'trades', 'joins']
    .flatMap(type => verifyInputs[type] || [])
    .flatMap(item => (item.outputs || []).map(o => o.note));

    return await tree.insertInShadow(outputs, verifyInputs.id);
}
