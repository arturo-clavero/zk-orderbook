import { createOutput, sortExtraUtxos } from "../utxo/utxo-utils.js";

async function queueDeposit(pool, user, token, amount){
    //check first the log is true...
    //if not return false or send error to front end...
    await createOutput(pool, user, token, change);
    return true;
}

async function queueWithdraw(pool, user, token, targetAmount) {
    if (pool.getUnlockedBalance(user, token) <  targetAmount) {
        console.error(`Not enough unlocked funds for ${user} to withdraw ${targetAmount} ${token}`);
        //send error to front end?
        return false;
    }
    const inputData = pool.selectForAmount(user, token, targetAmount);
    if (inputData.mode == "insufficient") {
        console.error(`Not enough funds for ${user} to withdraw ${targetAmount} ${token}`);
        //send error to front end?
        return false;
    }
    const inputs = inputData.utxos;
    const outputs = [];
    // if (inputData.mode != "greedy") 
    _setWithdrawInputs(inputs, inputData.covered);
    // else 
    //     sortExtraUtxos(inputData.utxos, 2, _setWithdrawInputs);
    const change = inputData.covered - targetAmount;
    if (change > 0) 
        outputs.push(await createOutput(pool, user, token, change));
    const circuitData = {
        inputs,
        outputs,
        user,
        token,
        amount,
    }
    addAction("withdraw", circuitData);
}

function _setWithdrawInputs(utxos, covered){
    for (const u of utxos) pool.setPendingInput(u.user, u.token, u.note);
    return true;
}


export {
    queueDeposit,
    queueWithdraw,
};

