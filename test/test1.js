import { queueDeposit } from "../proofs/actions/deposit.js";
import { testInsert, testUpdate } from "../proofs/tree/balanceTree.js";
import { verifyBatch } from "../proofs/verify.js";

async function test() {

   //->problem?
    let success;
    success = await testInsert("ali", 20);
    console.log("verify 1: ", success);
    success = await testUpdate("ali", 180);
    console.log("verify 2: ", success);
    //  success = await testInsert("a", 40);
    // console.log("verify 2: ", success);
    //  success = await testInsert("alice", 200);
    // console.log("verify 3: ", success);
    // await queueDeposit("alice", 200, "eth", "log");
    // await queueDeposit("alice", 100, "eth", "log");
    // await queueDeposit("brain", 20, "eth", "log");
    // await queueDeposit("alice", 150, "eth", "log");
    // await queueDeposit("brain", 40, "eth", "log");
    // success = await verifyBatch();
    // console.log("verify: ", success);
}

await test();