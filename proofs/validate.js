import { proofDeposits } from "./actions/deposit.js";
import { proofWithdrawals } from "./actions/withdraw.js";

import { callCircuit, verifyLatestProof } from "./circuit.js";
import { tree } from "./tree/balance-tree.js";
import { batch } from "./utxo/BatchManager.js";

export async function proofBatch(){
    const verifyInputs = batch.proofNextBatch();

    const subtreeProof = await insertNewOutputs(verifyInputs);

    await proofDeposits(verifyInputs.deposits);
    const w_nulls = await proofWithdrawals(verifyInputs.withdrawals);
    // const t_nulls = await proofTrades(verifyInputs.trades);
    // const j_nulls = await proofJoins(verifyInputs.joins);
    // const proof = await proofBatch(d_input, w_input, t_input, j_input);

    // const {proof, public_inputs} = await callCircuit(subtreeProof.inputs, "batch");
    // //only for testing!
    //         const success = await verifyLatestProof(proof, public_inputs);
    //         console.log("validate.js: test-verified: ", success);
    //end testing
    //call_smart_contract(public_inputs, nullifiers, withdrawals);

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
