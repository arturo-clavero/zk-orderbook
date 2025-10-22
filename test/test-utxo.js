import { queueDeposit } from "../proofs/actions/deposit.js";
import { queueWithdraw } from "../proofs/actions/withdraw.js";
import { batch } from "../proofs/utxo/BatchManager.js";
import { pool } from "../proofs/utxo/UtxoPool.js";

const user = "userA";
const token = "ETH";

//-1: no logs
//0 : only state
//1 : only batch
//2 : batch and state 
let LOGS = 0;

async function test() {
    await testSingleDeposit(false);
    testEndBatch();
    console.log("\nend.");
    // LOGS = 0;
     await testSingleWithdraw();
    testEndBatch();
    console.log("\nend.");



}

async function testSingleDeposit(logs=true){
    if (logs) log_state("original state");
    await queueDeposit(user, token, 10);
    if (logs) log_state("after deposit"); 
}

async function testSingleWithdraw(logs=true){
    if (logs) log_state("original state");
    await queueWithdraw(user, token, 5);
    if (logs) log_state("after withdraw"); 

}

function testEndBatch(logs=true){
    log_batch("before verify batch");
    const verifyINputs = batch.verifyNextBatch();
    // console.log("verify : ", verifyINputs);
    log_batch("before finalize batch", verifyINputs.id);
    batch.finalizeBatch(verifyINputs.id);
    log_batch("after finalize batch", verifyINputs.id);
    log_state("final state ");
}

function log_batch(str="", id = batch.currentBatch){
    if (LOGS == 0 || LOGS == -1)
        return;
    console.log("\n\n<",str,">");
    console.log("batch [",id,"] :", batch.getBatch(id));
    console.log("current batch: ", batch.currentBatch);

}

function log_AllBatch(str=""){
    if (LOGS == 0 || LOGS == -1)
        return;
    console.log("\n\n<",str,">");
    console.log("batch: ", batch.getOpenBatch());
}
export function log_state(str=""){
    if (LOGS == 1 || LOGS == -1)
        return;
    console.log("\n\n<",str,">");
    console.log("Pending:", pool.getPending());
    console.log("Utxos:", pool.getAll(user, token));
    console.log("Balance : ", pool.getBalance(user, token));
    console.log("\n");

}
await test();
