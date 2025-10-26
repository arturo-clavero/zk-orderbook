import { batch } from "./BatchManager.js";

const pendingMirrors = true;

class UtxoPool {
    constructor() {
        this.pool = new Map();         // user -> token ->[UTXO]
        this.balances = new Map();     // user -> token -> { available, pending, locked }
        this.pendingUtxos = {};        // batch id -> pending outputs
    }
    
    setPendingOutput(utxo) {
        // console.log("set pending output");
        utxo.pending = true;
        // const balance = this._ensureBalance(user, token);
        // balance.pending += utxo.amount;
    }
    addPendingOutput(utxo, id){
        // console.log("add pending output to ", id);
        if (!(id in this.pendingUtxos)) {
            this.pendingUtxos[id] = { inputs: [], outputs: [] };
        }
        this.pendingUtxos[id].outputs.push(utxo);
    }
    lockBalance(user, token, amount){
        const balance = this._ensureBalance(user, token);
        balance.locked += amount;
        balance.available -= amount;
    }
    unlockBalance(user, token, amount){
        const balance = this._ensureBalance(user, token);
        balance.locked -= amount;
        balance.available += amount;
    }
    setPendingInput(user, token, note) {
        // console.log("set pending input");
        const utxos = this._ensureUserToken(user, token);
        const utxo = utxos.find(u => u.note === note);
        if (utxo && !utxo.spent) utxo.pending = true;
        else if (utxo && utxo.spent){
            console.log("error with note?");
            return;
        }
        // const amount = utxo ? utxo.amount : _amount;
        // const balance = this._ensureBalance(user, token);
        // balance.pending -= amount;
    }
    setPendingBalance(user, token, amount){
        const balance = this._ensureBalance(user, token);
        balance.pending += amount;
    }
    addPendingInput(utxo, id){
        // console.log("add pending input to ", id);
        if (!(id in this.pendingUtxos)) {
            this.pendingUtxos[id] = { inputs: [], outputs: [] };
        }
        this.pendingUtxos[id].inputs.push(utxo);
    }

    closeBatch(){
        const batchId = this.batch;
        this.batch += 1;
        return batchId;
    }

    finalizeBatch(batchId) {
        const pending = this.pendingUtxos[batchId];
        // console.log("finalize batch pool> ", pending);
        // console.log("id: ", batchId);
        if (!pending) return;

        // console.log("<finalize batch> pending: ", pending.outputs);
        const outUtxos = pending.outputs || [];
        for (const o of outUtxos) {
            if (!o.isReserved)
                o.pending = false;
            this._addUtxo(o);
            const balance = this._ensureBalance(o.user, o.token);
            // balance.pending -= o.amount;
            balance.available += o.amount;
        }
        const inUtxos = pending.inputs || [];
        for (const i of inUtxos) {
            i.spent = true;
            i.pending = false;
            this._removeUtxo(i);
            const balance = this._ensureBalance(i.user, i.token);
            // balance.pending += i.amount;
            balance.available -= i.amount;
        }

        delete this.pendingUtxos[batchId];
    }

    selectForAmount(user, token, target) {
        const available = this.getAvailable(user, token)
            .slice()
            .sort((a, b) => a.amount - b.amount);

        if (available.length === 0)
            return { utxos: [], covered: 0, mode: "insufficient" };

        
        const exact1 = available.find(u => u.amount === target);
        if (exact1)
            return { utxos: [exact1], covered: target, remaining: 0, mode: "exact-1" };

        for (let i = 0; i < available.length; i++) {
            for (let j = i + 1; j < available.length; j++) {
                const sum = available[i].amount + available[j].amount;
                if (sum === target)
                    return { utxos: [available[i], available[j]], covered: sum, mode: "exact-2" };
            }
        }

        let best2 = null;
        let minExcess = Infinity;
        for (let i = 0; i < available.length; i++) {
            for (let j = i + 1; j < available.length; j++) {
                const sum = available[i].amount + available[j].amount;
                if (sum >= target && sum - target < minExcess) {
                    best2 = [available[i], available[j]];
                    minExcess = sum - target;
                }
            }
        }
        if (best2)
            return { utxos: best2, covered: best2[0].amount + best2[1].amount, remaining: 0, mode: "best-2" };

        const greedy = [];
        let total = 0;
        for (let i = available.length - 1; i >= 0; i--) {
            if (total >= target) break;
            greedy.push(available[i]);
            total += available[i].amount;
        }
        if (total >= target)
            return { utxos: greedy, covered: total, mode: "greedy" };

        return { utxos: available, covered: total, mode: "insufficient" };
    }

    //GETTERS
    getAllPending(){
        let id = batch.currentBatch;
        const pending = [];
        while (1){
            if (!batch.batches.has(id)) {
                break;
            }
            pending.push(this.getPending(id));
            id++;
        }
        return pending;
    }
    getPending(id = batch.currentBatch){
        return this.pendingUtxos[id];
    }
    getPendingInputs(batch = this.batch){
        return this.pendingUtxos[batch].inputs;
    }
    getPendingOutputs(batch = this.batch){
        return this.pendingUtxos[batch].outputs;
    }
    getAll(user, token) {
        return this._ensureUserToken(user, token);
    }
    getAvailable(user, token) {
        return this.getAll(user, token).filter(u => !u.spent && !u.pending);
    }
    getBalance(user, token) {
        return this._ensureBalance(user, token);
    }
    getUnlockedBalance(user, token){
        return this._ensureBalance(user, token).available;
    }
    getPendingBalance(user, token){
        return this._ensureBalance(user, token).pending;
    }
    getLockedBalance(user, token){
        return this._ensureBalance(user, token).locked;
    }
    //HELPERS
    _addUtxo(u){
        const utxos = this._ensureUserToken(u.user, u.token);
        utxos.push(u);
    }
    _removeUtxo(u) {
        const utxos = this._ensureUserToken(u.user, u.token);
        const i = utxos.findIndex(utxo => utxo.note === u.note);
        if (i !== -1) utxos.splice(i, 1);
    }
    _ensureUserToken(user, token) {
        if (!this.pool.has(user)) this.pool.set(user, new Map());
        const userTokens = this.pool.get(user);
        if (!userTokens.has(token)) userTokens.set(token, []);
        return userTokens.get(token);
    }
    _ensureBalance(user, token) {
        if (!this.balances.has(user)) this.balances.set(user, new Map());
        const userTokens = this.balances.get(user);
        if (!userTokens.has(token)) userTokens.set(token, { available: 0, pending: 0, locked: 0});
        return userTokens.get(token);
    }
}

export const pool = new UtxoPool();