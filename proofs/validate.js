import { proofDeposits } from "./actions/deposit.js";
import { proofTrades } from "./actions/trade.js";
import { proofWithdrawals } from "./actions/withdraw.js";
import { proofJoins } from "./actions/join.js";

import { callCircuit, verifyLatestProof } from "./circuit.js";
import { tree } from "./tree/balance-tree.js";
import { batch } from "./utxo/BatchManager.js";
import { callSmartContract } from "./contract.js";

import { ethers } from "ethers";

const isVerifying = false;

export async function proofBatch(){
    if (isVerifying == true)
        return;
    isVerifying = true;    
    const verifyInputs = batch.proofNextBatch();

    // console.log("\n\n\n\n\\nverify inputs!", verifyInputs,"\n\n\n\n\n");
    const subtreeProof = await insertNewOutputs(verifyInputs);

    console.log("subtree proof: ", subtreeProof.inputs);
    await proofDeposits(verifyInputs.deposits);
    const {w_nulls, w_data} = await proofWithdrawals(verifyInputs.withdrawals);
    const t_nulls = await proofTrades(verifyInputs.trades);
    const j_nulls = await proofJoins(verifyInputs.joins);

        // //only for testing! call true 
    const {proof, publicInputs} = await callCircuit(subtreeProof.inputs, "batch", true);
    //end testing
    const nullifiers = [
        ...t_nulls,
        ...w_nulls,
        ...j_nulls,
    ];
    console.log("raw proof length: ", typeof proof);
    const proofBytes = ethers.hexlify(proof);

    const success = await callSmartContract(verifyInputs.id, proofBytes, publicInputs, nullifiers, w_data);
    batch.finalizeBatch(verifyInputs.id, success);
    isVerifying = false;
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
