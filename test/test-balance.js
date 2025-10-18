import { queueDeposit } from "../proofs/actions/deposit.js";
import { verifyBatch } from "../proofs/verify.js";

async function test() {

    await queueDeposit("a", 200, "eth", "log");
    await queueDeposit("a", 100, "eth", "log");
    await queueDeposit("ali", 150, "eth", "log");
    await queueDeposit("ali", 20, "eth", "log");
    await queueDeposit("a", 40, "eth", "log");
    await queueDeposit("alice", 200, "eth", "log");

    let success = await verifyBatch();
    console.log("verify: ", success);
    // await queueDeposit("alice", 200, "eth", "log");
    // await queueDeposit("alice", 100, "eth", "log");
    // await queueDeposit("brain", 20, "eth", "log");
    // await queueDeposit("alice", 150, "eth", "log");
    // await queueDeposit("brain", 40, "eth", "log");
    // success = await verifyBatch();
    // console.log("verify: ", success);
}

await test();