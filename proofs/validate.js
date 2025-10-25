import { proofDeposits } from "./actions/deposit.js";
import { proofTrades } from "./actions/trade.js";
import { proofWithdrawals } from "./actions/withdraw.js";
import { proofJoins } from "./actions/join.js";

import { callCircuit, verifyLatestProof } from "./circuit.js";
import { tree } from "./tree/balance-tree.js";
import { batch } from "./utxo/BatchManager.js";
import { callSmartContract } from "./contract.js";

export async function proofBatch(){
    const verifyInputs = batch.proofNextBatch();

    // console.log("\n\n\n\n\\nverify inputs!", verifyInputs,"\n\n\n\n\n");
    const subtreeProof = await insertNewOutputs(verifyInputs);

    await proofDeposits(verifyInputs.deposits);
    const {w_nulls, w_data} = await proofWithdrawals(verifyInputs.withdrawals);
    const t_nulls = await proofTrades(verifyInputs.trades);
    const j_nulls = await proofJoins(verifyInputs.joins);

    const {proof, publicInputs} = await callCircuit(subtreeProof, "batch");
    // //only for testing!
    //         const success = await verifyLatestProof(proof, publicInputs);
    //         console.log("validate.js: test-verified: ", success);
    //end testing
    const nullifiers = [
        ...t_nulls,
        ...w_nulls,
        ...j_nulls,
    ];

    await callSmartContract(proof, publicInputs, nullifiers, w_data);

    //call this after event with id
    batch.finalizeBatch(verifyInputs.id);
    return verifyInputs.id;
}

async function insertNewOutputs(verifyInputs) {
    const outputs = ['deposits', 'withdrawals', 'trades', 'joins']
    .flatMap(type => verifyInputs[type] || [])
    .flatMap(item => (item.outputs || []).map(o => o.note));

    if (outputs.length == 0)
        return null;
    return await tree.insertInShadow(outputs, verifyInputs.id);
}
