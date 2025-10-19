import { queueDeposit } from "../proofs/actions/deposit.js";
import { queueWithdrawal } from "../proofs/actions/withdraw.js";
import { getPendingBalance } from "../proofs/tree/balanceTree.js";
import { verifyBatch } from "../proofs/verify.js";

async function test() {
    await queueDeposit("a", 20, "eth", "log");
    // await queueWithdrawal("ali", 10, "eth", "log");
    // await queueDeposit("a", 160, "eth", "log");
    // await queueDeposit("a", 40, "eth", "log");
    // await queueDeposit("alice", 200, "eth", "log");
    // await queueDeposit("ali", 180, "eth", "log");

    let success = await verifyBatch();
    console.log("verify 1: ", success);
    console.log("a: ", getPendingBalance("a"));

    // await queueWithdrawal("a", 10, "eth", "log");
    // success = await verifyBatch();
    // console.log("verify 2: ", success);
    // console.log("a: ", getPendingBalance("a"));

    // console.log("ali: ", getPendingBalance("ali"));
    // console.log("alice: ", getPendingBalance("alice"));

    // await queueDeposit("alice", 200, "eth", "log");
    // await queueDeposit("alice", 100, "eth", "log");
    // await queueDeposit("brain", 20, "eth", "log");
    // await queueDeposit("alice", 150, "eth", "log");
    // await queueDeposit("brain", 40, "eth", "log");
    // success = await verifyBatch();
    // console.log("verify: ", success);
}

await test();