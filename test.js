import { writeBalanceProofInputs, writeBalanceVerify } from "./balanceTree.js";
import { callCircuit } from "./utils.js";

async function test() {

    console.log("verify balance +200 for alice");
    const success = await writeBalanceVerify('alice', 200);
    console.log('verified: ', success);
}

await test();
