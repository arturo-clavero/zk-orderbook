### 1. Queue Actions

**When to use:**

* Deposits: after Envio listens to the `Deposit` event
* Withdrawals: after the frontend sends a withdrawal signature
* Trade: for each order settlement (2 full/partial orders matched)

**What it does:**

* Checks signatures and sufficient balances
* Updates pending / locked balances
* Updates pending input and output UTXOs
* Queues the action for the next available batch

**How to use:**

```js
await queueDeposit(user, token, amount);
// @ ./proofs/actions/deposit.js

await queueWithdrawal(user, token, amount);
// @ ./proofs/actions/withdraw.js

await queueSettlement(userX, amountX, tokenX, userY, amountY, tokenY);
// @ ./proofs/actions/trade.js
```

---

### 2. Proof Batch

**When to use:**

* Chronically (every fixed interval) or immediately after finalizing a batch if the next batch is full
* Can only be called when it is "unlocked"
* It will "lock" once called and "unlock" once the batch has been finalized (see section 3)

**What it does:**

* Generates zk proofs for each action
* Builds a batch proof of new UTXOs
* Collects nullifiers of spent UTXOs
* Collects withdrawal data of proved withdrawals
* Calls the smart contract

  ```
  verifyAndWithdraw(id, nullifiers, proof, publicInputs, withdrawals)
  ```

**How to use:**

```js
await proofBatch();
// @ ./proofs/validate.js
```

---

### 3. Finalize Batch
## ! REMOVED WE JUST WAIT IN PROOF BATCH NO NEED FOR ENVIO
**When to use:**

* After Envio listens to the `BatchVerified(id, success)` event

**What it does:**

* Updates available balances
* Marks input UTXOs as spent
* Inserts output UTXOs
* Unlocks batch prover

**How to use:**

```js
await finalizeBatch(id);
// @ ./proofs/validate.js
```

---

### 4. Read Balances

```js
import { pool } from "./proofs/utxo/UtxoPool.js";

const { available, pending } = pool.getBalance(user, token);
```

`token` must be a digit.
See mapping `const TOKEN_IDS` in `./proofs/actions/action-utils.js`.
