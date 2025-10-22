import { batch } from "../utxo/BatchManager.js";
import { createOutput } from "../utxo/utxo-utils.js";
import { pool } from "../utxo/UtxoPool.js";
import { _setInputs, _tooManyInputs } from "./action-utils.js";

export async function queueWithdraw(user, token, targetAmount) {
    if (pool.getUnlockedBalance(user, token) <  targetAmount) {
        console.error(`Not enough unlocked funds for ${user} to withdraw ${targetAmount} ${token}`);
        //send error to front end?
        return false;
    }
    let inputData = pool.selectForAmount(user, token, targetAmount);
    if (inputData.mode == "insufficient") {
        console.error(`Not enough funds for ${user} to withdraw ${targetAmount} ${token}`);
        //send error to front end?
        return false;
    }
    // console.log("\n select form : ", inputData);
    const outputs = [];
    let lastId = -1;
    if (inputData.utxos.length > 2) 
    {
        inputData = await _tooManyInputs(inputData.utxos, 2);
        lastId = inputData.lastId;
    }
    // console.log("inputdata.utxos: ", inputData.utxos);
    _setInputs(inputData.utxos);
    const change = inputData.covered - targetAmount;
    if (change > 0) 
        outputs.push(await createOutput(user, token, change));
    const circuitData = {
        inputs: inputData.utxos,
        outputs,
        user,
        token,
        targetAmount,
    }
    batch.addAction("withdraw", circuitData, lastId);
}


