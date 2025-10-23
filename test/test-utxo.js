import { queueDeposit } from "../proofs/actions/deposit.js";
import { queueWithdraw } from "../proofs/actions/withdraw.js";
import { batch } from "../proofs/utxo/BatchManager.js";
import { pool } from "../proofs/utxo/UtxoPool.js";
import { proofBatch } from "../proofs/validate.js";

const user = "userA";
const token = "ETH";

//-1 : no logs
// 0 : only state
// 1 : only batch
// 2 : batch and state 
let LOGS = -1;

const d = 10;
async function test() {
    await testSingleDeposit(false, 1);
    await testSingleDeposit(false, 2);
    console.log("proof batch....");
    await proofBatch();
    
}


async function testSingleDeposit(logs=true, x=1){
    if (logs) log_state("original state");
    await queueDeposit(user, token, x);
    if (logs) log_state("after deposit"); 
}

async function testSingleWithdraw(logs=true, x = 1){
    if (logs) log_state("original state");
    await queueWithdraw(user, token, x);
    if (logs) log_state("after withdraw"); 

}

function testEndBatch(logs=true){
    log_batch("before verify batch");
    const id = verifyBatch();
    log_batch("after finalize batch", id);
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
    console.log("Pending:", pool.getAllPending());
    const all =  pool.getAll(user, token);
    const amounts = [];
    for (const a of all) amounts.push(a.amount);
    console.log("Utxos:", amounts);
    console.log("Balance : ", pool.getBalance(user, token));
    console.log("\n");
}

await test();

async function testWithdrawal() {
    for (let i =0; i < d; i++)
        await testSingleDeposit(false, 1);
    
    for (let i = 0; i < d/2; i++)
        testEndBatch();
    LOGS = 0;
    log_batch("<initial state>");

    console.log("single withdraw");
    await testSingleWithdraw(false, 10);

    log_state();

    testEndBatch();
    testEndBatch();
    testEndBatch();

    console.log("\nend.");
}
