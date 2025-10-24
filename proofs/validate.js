import { proofDeposits } from "./actions/deposit.js";
import { proofTrades } from "./actions/trade.js";
import { proofWithdrawals } from "./actions/withdraw.js";
import { proofJoins } from "./actions/join.js";

import { callCircuit, verifyLatestProof } from "./circuit.js";
import { tree } from "./tree/balance-tree.js";
import { batch } from "./utxo/BatchManager.js";

export async function proofBatch(){
    const verifyInputs = batch.proofNextBatch();

    // console.log("\n\n\n\n\\nverify inputs!", verifyInputs,"\n\n\n\n\n");
    const subtreeProof = await insertNewOutputs(verifyInputs);

    await proofDeposits(verifyInputs.deposits);
    const {w_nulls, w_data} = await proofWithdrawals(verifyInputs.withdrawals);
    // console.log('w_nulls: ', w_nulls);
    // console.log('w_data: ', w_data);
    const t_nulls = await proofTrades(verifyInputs.trades);
    // console.log("t_nulls: ", t_nulls);
    const j_nulls = await proofJoins(verifyInputs.joins);
    console.log("j_nulls: ", j_nulls);
    // const proof = await proofBatch(d_input, w_input, t_input, j_input);

    // const {proof, public_inputs} = await callCircuit(subtreeProof.inputs, "batch");
    // //only for testing!
    //         const success = await verifyLatestProof(proof, public_inputs);
    //         console.log("validate.js: test-verified: ", success);
    //end testing
    //const nullifiers = {
        //..t_nulls,
        //..w_nulls,
        //..j_nulls,
    //}
    //call_smart_contract(public_inputs, nullifiers, withdrawals);

    //call this after event with id
    batch.finalizeBatch(verifyInputs.id);
    return verifyInputs.id;
}

async function insertNewOutputs(verifyInputs) {
    const outputs = ['deposits', 'withdrawals', 'trades', 'joins']
    .flatMap(type => verifyInputs[type] || [])
    .flatMap(item => (item.outputs || []).map(o => o.note));

    console.log(outputs);
    return await tree.insertInShadow(outputs, verifyInputs.id);
}
