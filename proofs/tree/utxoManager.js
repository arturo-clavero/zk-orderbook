class UTXO {
    constructor({ note, user, token, amount, salt, spent = false, pending = false }) {
        this.note = note;
        this.user = user;
        this.token = token;
        this.amount = amount;
        this.salt = salt;
        this.spent = spent;
        this.pending = pending;
    }
}

class UtxoPool {
    constructor() {
        this.pool = new Map();         // user -> token ->[UTXO]
        this.balances = new Map();     // user -> token -> { available, pending }
        
        this.pendingUtxos = {}; // batch id -> pending outputs
        this.batch = 0;
    }

    addPendingOutput(user, token, utxo) {
        if (!(this.batch in this.pendingUtxos)) {
            this.pendingUtxos[this.batch] = { inputs: [], outputs: [] };
        }

        utxo.pending = true;
        this.pendingUtxos[this.batch].outputs.push(utxo);
        const balance = this._ensureBalance(user, token);
        balance.pending += utxo.amount;
    }

    addPendingInput(user, token, note) {

        if (!(this.batch in this.pendingUtxos)) {
            this.pendingUtxos[this.batch] = { inputs: [], outputs: [] };
        }
        const utxos = this._ensureUserToken(user, token);
        const utxo = utxos.find(u => u.note === note);
        if (utxo && !utxo.spent) utxo.pending = true;
        else {
            console.log("error with note?");
            return;
        }
        this.pendingUtxos[this.batch].inputs.push(utxo);
        const balance = this._ensureBalance(user, token);
        balance.pending -= utxo.amount;
    }

    closeBatch(){
        const batchId = this.batch;
        this.batch += 1;
        return batchId;
    }

    finalizeBatch(batchId, success = true) {
        const batch = this.pendingUtxos[batchId];
        if (!batch) return;

        const outUtxos = batch.outputs || [];
        const inUtxos = batch.inputs || [];

        if (success) {

            for (const o of outUtxos) {

                o.pending = false;
                this.addUtxo(o);
                const balance = this._ensureBalance(o.user, o.token);
                balance.pending -= o.amount;
                balance.available += o.amount;
            }
            for (const i of inUtxos) {
                i.spent = true;
                i.pending = false;
                this.removeUtxo(i);
                const balance = this._ensureBalance(o.user, o.token);
                balance.pending += o.amount;
                balance.available += o.amount;
            }
        } else {
            for (const o of outUtxos) {
                o.pending = false;
                const balance = this._ensureBalance(o.user, o.token);
                balance.pending -= o.amount;
            }

            for (const i of inUtxos) {
                i.pending = false;
                const balance = this._ensureBalance(i.user, i.token);
                balance.pending += i.amount;
            }
        }
        delete this.pendingUtxos[batchId];
    }
    addUtxo(u){
        const utxos = this._ensureUserToken(u.user, u.token);
        utxos.push(u);
    }
    removeUtxo(u) {
        const utxos = this._ensureUserToken(u.user, u.token);
        const i = utxos.findIndex(utxo => utxo.note === u.note);
        if (i !== -1) utxos.splice(i, 1);
    }

    selectForAmount(user, token, target) {
        const available = this.getAvailable(user, token)
            .slice()
            .sort((a, b) => b.amount - a.amount);
        const selected = [];
        let total = 0;
        for (const u of available) {
            if (total >= target) break;
            selected.push(u);
            total += u.amount;
        }
        return total >= target ? selected : null;
    }

    getPending(batch = this.batch){
        return this.pendingUtxos[batch];
    }

    getPendingInputs(batch = this.batch){
        return this.pendingUtxos[batch].inputs;
    }

    getPendingOutputs(batch = this.batch){
        return this.pendingUtxos[batch].outputs;
    }
    
    // Returns all UTXOs for a user-token pair.
    getAll(user, token) {
        return this._ensureUserToken(user, token);
    }

    // Returns only UTXOs that are available (not spent or pending).
    getAvailable(user, token) {
        return this.getAll(user, token).filter(u => !u.spent && !u.pending);
    }

    // Returns the available and pending balances for a user-token pair.
    getBalance(user, token) {
        return this._ensureBalance(user, token);
    }

    // Ensures data structure for a given user-token pair exists in the pool.
    _ensureUserToken(user, token) {
        if (!this.pool.has(user)) this.pool.set(user, new Map());
        const userTokens = this.pool.get(user);
        if (!userTokens.has(token)) userTokens.set(token, []);
        return userTokens.get(token);
    }

    // Ensures balance tracking object exists for a given user-token pair.
    _ensureBalance(user, token) {
        if (!this.balances.has(user)) this.balances.set(user, new Map());
        const userTokens = this.balances.get(user);
        if (!userTokens.has(token)) userTokens.set(token, { available: 0, pending: 0 });
        return userTokens.get(token);
    }
}

export { UtxoPool, UTXO };
