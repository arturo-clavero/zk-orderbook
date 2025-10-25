import { callCircuit, verifyLatestProof } from "../circuit.js";
import { tree } from "../tree/balance-tree.js";
import { membersToStrings } from "../tree/tree-utils.js";
import { getUserSecret } from "../userSecret.js";
import { batch } from "../utxo/BatchManager.js";
import { createOutput } from "../utxo/utxo-utils.js";
import { pool } from "../utxo/UtxoPool.js";
import { _setInputs, _tooManyInputs, getOldOutxoInputs, getToken } from "./action-utils.js";

export async function queueWithdraw(user, tokenString, targetAmount) {
    const token = getToken(tokenString);
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
    let lastId = -1;
    if (inputData.utxos.length > 2) 
    {
        inputData = await _tooManyInputs(inputData.utxos, 2);
        lastId = inputData.lastId;
    }
    // console.log("inputdata.utxos: ", inputData.utxos);
    _setInputs(inputData.utxos);
    
    const outputs = [];
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


export async function proofWithdrawals(inputs){
    const withdrawData = [];
    const nullifiers = [];
    for (const i of inputs) 
    {
        const success = await proofSingleWithdrawal(
            i.inputs, //1 or 2
            i.outputs, //0 or 1
            i.targetAmount,
            getUserSecret(i.user),
        );
        if (success){
            nullifiers.push(...i.inputs.map(input => input.nullifier));
            withdrawData.push({
                user: i.user,
                amount: i.targetAmount,
                token: i.token
            });
        }
    }
    return {w_nulls: nullifiers, w_data: withdrawData};
}

const DEPTH = tree.mainTree.DEPTH;

export async function proofSingleWithdrawal(_inputs, _outputs, amount, userSecret){
    // return true;
    const {inputs, inputsPub, root} = await getOldOutxoInputs(_inputs, 2);
    
    // prepare outputs
    const output = membersToStrings(_outputs.length > 0 
        ?{
            salt: _outputs[0].salt,
            note: _outputs[0].note,
            amount: _outputs[0].amount,
        }:{
            salt: 0n,
            note: 0n,
            amount: 0
        }, DEPTH);
    const outputPub = membersToStrings(_outputs.length > 0 
        ?{token: _outputs[0].token}
        :{token: 0n}
        , DEPTH);

    const pi = {
        inputs,
        inputsPub,
        output,
        outputPub,
        oldRoot: root.toString(10),
        target: amount,
        userSecret: userSecret.toString(10),
    }

    const {proof, publicInputs} = await callCircuit(pi, "actions/withdrawal");
    const success = await verifyLatestProof(proof, publicInputs);
    console.log("withdraw.js: verified? ", success); 
    return(success);
}



