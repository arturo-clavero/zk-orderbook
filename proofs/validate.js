import { processDeposit, proofDeposits } from "./actions/deposit.js";
import { processTrade, proofTrades } from "./actions/trade.js";
import { processWithdraw, proofWithdrawals } from "./actions/withdraw.js";
import { proofJoins } from "./actions/join.js";

import { callCircuit, verifyLatestProof } from "./circuit.js";
import { tree } from "./tree/balance-tree.js";
import { batch } from "./utxo/BatchManager.js";
import { callSmartContract } from "./contract.js";

import { ethers } from "ethers";
import { pool } from "./utxo/UtxoPool.js";
import { membersToStrings } from "./tree/tree-utils.js";

// let isVerifying = false;

export async function proofBatch(){
    // if (isVerifying == true)
    //     return;
    // isVerifying = true;
    if (!batch.isFull())
        await fillBatches();

    const verifyInputs = batch.proofNextBatch();
    const subtreeProof = await insertNewOutputs(verifyInputs);

    console.log("subtree proof: ", subtreeProof.inputs);
    await proofDeposits(verifyInputs.deposits);
    const {w_nulls, w_data} = await proofWithdrawals(verifyInputs.withdrawals);
    const t_nulls = await proofTrades(verifyInputs.trades);
    const j_nulls = await proofJoins(verifyInputs.joins);
    
    const {proof, publicInputs} = await callCircuit(subtreeProof.inputs, "batch", true);
    const nullifiers = [
        ...t_nulls,
        ...w_nulls,
        ...j_nulls,
    ];
    const proofBytes = ethers.hexlify(proof);
    const nullifiersBytes32 = nullifiers.map(n => {
        const bn = BigInt(n);
        return "0x" + bn.toString(16).padStart(64, "0");
    });
    const success = await callSmartContract(verifyInputs.id, proofBytes, publicInputs, nullifiersBytes32, w_data);
    batch.finalizeBatch(verifyInputs.id, success);

    console.log("verify inputs: ", verifyInputs);
    for (const t of verifyInputs.trades) {
        console.log("t: ", t);
        pool.unlockBalance(t.userX, t.tokenX, t.amountX);
        pool.unlockBalance(t.userY, t.tokenY, t.amountY);
    }
    // isVerifying = false;
    return verifyInputs.id;
}

async function insertNewOutputs(verifyInputs) {
    const outputs = ['deposits', 'withdrawals', 'trades', 'joins']
    .flatMap(type => verifyInputs[type] || [])
    .flatMap(item => (item.outputs || []).map(o => o.note));

    if (outputs.length == 0)
        return {inputs: null};
    return await tree.insertInShadow(outputs, verifyInputs.id);
}

async function fillBatches(){
    const actions = batch.getActionQueue();
    for (a in actions){
        let success;
        if (a.type == "deposit")
            success = await processDeposit(a.user, a.token, a.amount);
        else if (a.type == "withdrawal")
            success = await processTrade(
                a.userX, 
                a.tokenX, 
                a.amountX, 
                a.userY, 
                a.tokenY,
                a.amountY 
            );
        else if (a.type == "trade")
            success = await processWithdraw(a.user, a.token, a.targetAmount);
        if (success)
            batch.unqueueAction(a);
    }
}