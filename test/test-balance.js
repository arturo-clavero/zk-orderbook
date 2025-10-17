import { writeBalanceVerify, writeBalanceProofInputs, readBalanceVerify, assertBalanceVerify } from "../proofs/tree/balanceTree.js";
import {deposit} from "../proofs/actions.js"

async function test() {
    let success; 

    console.log("assert balance +200 for alice");
    success = await deposit('alice', 200,);
    console.log('asserted balance 1: ', success);
    success = await deposit('alice', 200);
    console.log('asserted balance 2: ', success);

}

await test();
