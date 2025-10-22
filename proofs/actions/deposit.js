import { log_state } from "../../test/test-utxo.js";
import { batch } from "../utxo/BatchManager.js";
import { createOutput } from "../utxo/utxo-utils.js";

function checkDeposit(){
    return true;
}

export async function queueDeposit(user, token, amount){
    if (!checkDeposit){
        return false;
    }
    //check first the log is true...
    //if not return false or send error to front end...
    const output = await createOutput(user, token, amount);
    const data = {
        outputs: [output],
        user,
        token,
        amount
    }
    log_state("created output");
    batch.addAction("deposit", data);
    return true;
}