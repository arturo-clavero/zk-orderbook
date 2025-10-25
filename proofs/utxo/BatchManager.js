import { tree } from "../tree/balance-tree.js";
import { maxSubtreeSize } from "../tree/merkle-tree.js";
import { pool } from "./UtxoPool.js";

function newEmptyBatch(id){
    return {
        id: id,
        status: "open",
        deposits: [],
        withdrawals: [],
        trades: [],
        joins: [],
        outputsN: 0
        // typeCounts: { deposit: 0, withdraw: 0, trade: 0, join: 0 },
    }
}

class BatchManager {
    constructor(config = {}) {
        // batchId -> { status, deposits, withdrawals, trades, outputsN }
        this.batches = new Map();
        this.currentBatch = 0;
        this.maxOutputs = maxSubtreeSize;
        // this.maxPerType = config.maxPerType || { 
        //     deposit: 2, 
        //     withdraw: 2, 
        //     trade: 6, 
        //     join: 8
        // };
    }

    addAction(type, data, lastId = -1) {
        const nextId = lastId == -1 ? this.currentBatch : lastId + 1;
        const active = this._latestBatch(nextId, data.outputs);
        if (Array.isArray(data.inputs) && data.inputs.length > 0)
        {
            for(const u of data.inputs) pool.addPendingInput(u, active.id);
        }
        if (Array.isArray(data.outputs) && data.outputs.length > 0)
        {
            active.outputsN += data.outputs.length;
            for(const u of data.outputs) pool.addPendingOutput(u, active.id);
        }
        if (type === "deposit") {
            active.deposits.push(data);
        } else if (type === "withdraw") {
            active.withdrawals.push(data);
        } else if (type === "trade") {
            active.trades.push(data);
        } else if (type == "join"){
            active.joins.push(data);
        }
        // active.typeCounts[type]++;
        return active.id;
    }

    proofNextBatch(){
        const id = this.currentBatch;
        this.currentBatch += 1;  
        this._ensureBatch();      
        const batch = this.batches.get(id);
        batch.status = "pending";
        return {
            id,
            deposits: batch.deposits,
            withdrawals: batch.withdrawals,
            trades: batch.trades,
            joins: batch.joins,
        }
    }
    async finalizeBatch(batchId) {
        const batch = this.batches.get(batchId);
        if (!batch) return;

        pool.finalizeBatch(batchId);
        await tree.verifyShadowTree(batchId);

        batch.status = "finalized";
        this.batches.delete(batchId);
    }

    //HELPERS
    printBatch(batchId = this.currentBatch) {
        const b = this.batches.get(batchId);
        if (!b) return console.log("No batch found:", batchId);
        console.log(`Batch [${batchId}]`, JSON.stringify(b, null, 2));
    }
    _ensureBatch(batchId = this.currentBatch) {
        if (!this.batches.has(batchId)) {
            this.batches.set(batchId, newEmptyBatch(batchId));
        }
        return this.batches.get(batchId);
    }
    _latestBatch(id = this.currentBatch){
        const batch = this._ensureBatch(id);
        if (batch.outputsN >= this.maxOutputs) {
            return this._latestBatch(id + 1);
        }
        return batch;
    }
    isFull(id = this.currentBatch){
        const batch = this._ensureBatch(id);
        return batch.outputsN == this.maxOutputs;
    }
    //GETTERS
    getBatch(batchId = this.currentBatch) {
        return this._ensureBatch(batchId);
    }
    getOpenBatch() {
        return [...this.batches.entries()].find(([_, b]) => b.status === "open");
    }
    
}

export const batch = new BatchManager(); 
