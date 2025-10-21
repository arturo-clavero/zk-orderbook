function newEmptyBatch(id){
    return {
        id: id,
        status: "open",
        deposits: [],
        withdrawals: [],
        trades: [],
        joins: [],
        typeCounts: { deposit: 0, withdraw: 0, trade: 0, join: 0 },
    }
}

class BatchManager {
    constructor(pool, config = {}) {
        this.pool = pool; // Reference to UtxoPool instance
        // batchId -> { status, deposits, withdrawals, trades, typeCounts }
        this.batches = new Map();
        this.currentBatch = 0;
        this.maxPerType = config.maxPerType || { 
            deposit: 2, 
            withdraw: 2, 
            trade: 6, 
            join: 8
        };
    }

    //type = "deposit" || "withdraw" || "trade" || "join"
    addAction(type, data) {
        const active = this._latestBatch(type);
        if (data.inputs.length > 0) pool.addPendingInputs(data.inputs, active.id);
        if (data.outputs.length > 0) pool.addPendingOutputs(data.outputs, active.id);

        if (type === "deposit") {
            active.deposits.push(data);
        } else if (type === "withdraw") {
            active.withdrawals.push(data);
        } else if (type === "trade") {
            active.trades.push(data);
        } else if (type == "join"){
            active.join.push(data);
        }
        active.typeCounts[type]++;
        return active.id;
    }
    verifyNextBatch(){
        const id = this.currentBatch;
        this.currentBatch += 1;
        const batch = this.batches.get(id);
        this._markBatchPending(batch);
        return {
            deposits: batch.deposits,
            withdrawals: batch.withdrawals,
            trades: batch.trades,
        }
    }
    finalizeBatch(batchId, success = true) {
        const batch = this.batches.get(batchId);
        if (!batch) return;

        this.pool.finalizeBatch(batchId, success);
        batch.status = success ? "finalized" : "failed";
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
            this.batches.set(batchId, newEmptyBatch(id));
        }
        return this.batches.get(batchId);
    }
    _markBatchPending(batch) {
        batch.status = "pending";
    }
    _latestBatch(id = this.currentBatch){
        const batch = this._ensureBatch(id);
        if (batch.typeCounts[type] >= this.maxPerType[type]) {
            return this._latestBatch(id++);
        }
        return batch;
    }
    // _startNewBatch() {
    //     this.currentBatch++;
    //     this._ensureBatch(this.currentBatch);
    // }

    //GETTERS
    getBatch(batchId = this.currentBatch) {
        return this.batches.get(batchId);
    }
    getOpenBatch() {
        return [...this.batches.entries()].find(([_, b]) => b.status === "open");
    }
    
}

export { BatchManager };

// //USSAGE

// const manager = new BatchManager(pool, { maxPerType: { deposit: 2, withdraw: 2, trade: 1 } });

// // Add two deposits
// manager.addAction("deposit", user, token, utxo1);
// manager.addAction("deposit", user, token, utxo2);

// // Automatically starts new batch if over limit
// manager.addAction("deposit", user, token, new UTXO({ note: 3n, user, token, amount: 8, salt: "0xghi" }));

// manager.printBatch(0);
// manager.printBatch(1);

// // Finalize first batch
// manager.finalizeBatch(0, true);
// console.log(pool.getAll(user, token));
