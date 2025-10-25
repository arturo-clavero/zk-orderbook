import { proofDeposits, queueDeposit } from "../proofs/actions/deposit.js";
import { queueSettlement } from "../proofs/actions/trade.js";
import { queueWithdraw } from "../proofs/actions/withdraw.js";
import { batch } from "../proofs/utxo/BatchManager.js";
import { pool } from "../proofs/utxo/UtxoPool.js";
import { proofBatch } from "../proofs/validate.js";

const user = "userA";
const user2 = "userB";
const token = "ETH";
const token2 = "DAI";

//-1 : no logs
// 0 : only state
// 1 : only batch
// 2 : batch and state 
let LOGS = 0;

const d = 10;
async function test() {
    await testSingleDeposit(false);
    await proofBatch();
}

async function test_join(){
        let max = 5;

    for (let i = 0; i < max; i++)
        await testSingleDeposit(false, 1);
    for (let i =0 ; i < Math.ceil(max / 2); i++){
        await proofBatch();
    }

    log_batch("after deposits...");
    log_state("after deposits...");

    await testSingleWithdraw(true, 3);
 
     log_batch("after queue withdrawal...");
     log_state("after queue withdrawal...");
    await proofBatch();
    log_batch("mid proofs after join ...");
     log_state("mid proofs after join...");
    await proofBatch();

    console.log("end");
}
export function log_order_state(str=""){
    if (LOGS == 1 || LOGS == -1)
        return;
    console.log("\n\n<",str,">");
    console.log("Pending:", pool.getAllPending());
    const all =  pool.getAll(user, 1);
    const amounts = [];
    for (const a of all) amounts.push(a.amount);
    console.log("Utxos:", amounts);
    console.log("Balance Alice ETH: ", pool.getBalance(user, 1));
    console.log("Balance Alice DAI: ", pool.getBalance(user, 2));
    console.log("Balance Bob   DAI: ", pool.getBalance(user2, 2));
    console.log("Balance Bob   ETH: ", pool.getBalance(user2, 1));

    console.log("\n");
}
async function testOrderSettlement(logs=true, preDeposit=true){
    log_order_state("original");
    //userX   : gives amountX of tokenX, receives amountY of tokenY;
    //userY   : gives amountY of tokenY, receives amountX of tokenX;
    //Alice   : gives    2       ETH   , receives    5      DAI ;
    //Bob     : gives    5       DAI   , receives    2      ETH ;
    const userX = user;
    const userY = user2;
    const amountX = 2;
    const tokenX = "ETH";
    const amountY = 5;
    const tokenY = "DAI";

    if (preDeposit){
        await queueDeposit(userX, tokenX, amountX/2);
        await queueDeposit(userX, tokenX, amountX/2);
      
        await queueDeposit(userY, tokenY, 3);
        await queueDeposit(userY, tokenY, 3);
        await proofBatch();
        await proofBatch();
    }
        log_batch("settlement start: ");
        log_order_state("settlement start: ");

    await queueSettlement(userX, amountX, tokenX, userY, amountY, tokenY);
            log_order_state("settlement queued! ");
            log_batch("settlement queued: ");


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
    const all =  pool.getAll(user, 1);
    const amounts = [];
    for (const a of all) amounts.push(a.amount);
    console.log("Utxos:", amounts);
    console.log("Balance : ", pool.getBalance(user, 1));
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
