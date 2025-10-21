import { queueDeposit } from "../proofs/actions.js";
import { UtxoPool } from "../proofs/tree/utxoManager.js";

const pool = new UtxoPool();
const user = "userA";
const token = "ETH";


async function test() {
    await testSingleDeposit();
    testEndBatch();
}

async function testSingleDeposit(logs=true){
    if (logs) log_state("original state");
    await queueDeposit(pool, user, token, 5);
    await queueDeposit(pool, user, token, 2);
    await queueDeposit(pool, user, token, 3);

    if (logs) log_state("after deposit");  
}

function testEndBatch(logs=true){
    const id = pool.closeBatch();
    pool.finalizeBatch(id, true);
    if (logs) log_state("after finalize");
}

function log_state(str=""){
    console.log("\n\n<",str,">");
    console.log("Pending:", pool.getPending(user, token));
    console.log("Utxos:", pool.getAll(user, token));
    console.log("Balance : ", pool.getBalance(user, token));

}
await test();
