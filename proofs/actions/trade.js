import { log_order_state } from "../../test/test-utxo.js";
import { callCircuit, verifyLatestProof } from "../circuit.js";
import { tree } from "../tree/balance-tree.js";
import { membersToStrings } from "../tree/tree-utils.js";
import { getUserSecret } from "../userSecret.js";
import { batch } from "../utxo/BatchManager.js";
import { createOutput } from "../utxo/utxo-utils.js";
import { pool } from "../utxo/UtxoPool.js";
import { _setInputs, getOldOutxoInputs, getToken } from "./action-utils.js";


export function checkOrder(order, signature){
    const token = getToken(order.mainToken);
     if (pool.getUnlockedBalance(order.user, token) < order.amount) {
        console.error(`Not enough unlocked funds for ${order.user} to trade ${order.amount} ${token}`);
        return false;
    }
    //LERA CHECK SIGNATURE
    pool.lockBalance(order.user, token, order.amount);

}

//Alice   : gives    2       ETH   , receives    5      DAI ;
//Bob     : gives    5       DAI   , receives    2      ETH ;

//userX   : gives amountX of tokenX, receives amountY of tokenY;
//userY   : gives amountY of tokenY, receives amountX of tokenX;
export async function queueSettlement(
    userX, 
    tokenXString, 
    amountX, 
    userY, 
    tokenYString,
    amountY, 
){
    const sides = [
        { name: 'X', user: userX, token: getToken(tokenXString), amount: amountX },
        { name: 'Y', user: userY, token: getToken(tokenYString), amount: amountY }
    ];

    for (let i = 0; i < sides.length; i++) {
        const side = sides[i];
        const opposite = sides[1 - i];
        // if (pool.getUnlockedBalance(side.user, side.token) < side.amount) {
        //     console.error(`Not enough unlocked funds for ${side.user} to trade ${side.amount} ${side.tokenStr}`);
        //     return false;
        // }
        side.inputData = pool.selectForAmount(side.user, side.token, side.amount);
        if (side.inputData.mode === "insufficient") {
            console.error(`Not enough funds for ${side.user} to withdraw ${side.amount} ${side.tokenStr}`);
            return false;
        }
        side.lastId = -1;
        if (side.inputData.utxos.length > 2) {
            side.inputData = await _tooManyInputs(side.inputData.utxos, 2);
            side.lastId = side.inputData.lastId;
        }
        _setInputs(side.inputData.utxos);

        side.outputs = [];
        side.outputs.push(await createOutput(side.user, opposite.token, opposite.amount));      
        const change = side.inputData.covered - side.amount;  
        if (change > 0) 
            side.outputs.push(await createOutput(side.user, side.token, change));
        // console.log("SIDE ", i);
        // console.log('out: ', side.outputs);
        // console.log('in: ', side.inputData.utxos);
    }
    // console.log("inputs and outputs done...");
    //pick largerst...
    const lastId = sides[0].lastId > sides[1].lastId ? sides[0].lastId : sides[1].lastId;
    const circuitData = {
        inputs: [...sides[0].inputData.utxos,...sides[1].inputData.utxos],
        inputsX: sides[0].inputData.utxos,
        inputsY: sides[1].inputData.utxos,
        outputs: [...sides[0].outputs, ...sides[1].outputs],
        outputsX: sides[0].outputs,
        outputsY: sides[1].outputs,
        userX,
        tokenX: sides[0].token,
        amountX,
        userY,
        tokenY: sides[1].token,
        amountY,
    }
    batch.addAction("trade", circuitData, lastId);
}

export async function proofTrades(inputs){
    const nullifiers = [];
    for (const i of inputs) 
    {
        // console.log("----i:", i);
        const success = await proofSingleTrade(
            i.inputsX, //1-2
            i.inputsY, //1-2
            i.outputsX, //1-2
            i.outputsY, //1-2
            getUserSecret(i.userX),
            getUserSecret(i.userY),
        );
        if (success){
            nullifiers.push(...i.inputs.map(input => input.nullifier));
        }
    }
    return nullifiers;
}


const DEPTH = tree.mainTree.DEPTH;

export async function proofSingleTrade(
    _inputsX,
    _inputsY, 
    _outputsX,
    _outputsY, 
    userSecretX,
    userSecretY
){
    const inX = await getOldOutxoInputs(_inputsX, 2);
    const inY = await getOldOutxoInputs(_inputsY, 2);

    const outputsX = getNewOutxoInputs(_outputsX, 2);
    const outputsY = getNewOutxoInputs(_outputsY, 2);

    const pi = {
        inputsX: inX.inputs,
        inputsY: inY.inputs,
        inputsPubX: inX.inputsPub,
        inputsPubY: inY.inputsPub,
        outputsX,
        outputsY,
        userSecretX: userSecretX.toString(10),
        userSecretY: userSecretY.toString(10),
        oldRoot: inX.root.toString(10),
    }
    // console.log("pi: ", pi);
    const {proof, publicInputs} = await callCircuit(pi, "actions/trade");
    const success = await verifyLatestProof(proof, publicInputs);
    console.log("withdraw.js: verified? ", success); 
    return(success);
}

function getNewOutxoInputs(_outputs, max){
    // console.log("received outputs: ", _outputs);
    const outputs = [];
    for (let i =0 ; i < max; i++){
        outputs.push(membersToStrings(i < _outputs.length 
            ?{
                salt: _outputs[i].salt,
                note: _outputs[i].note,
                amount: _outputs[i].amount,
                token: _outputs[i].token
            }: {
                salt: 0n,
                note: 0n,
                amount: 0,
                token: 0n
            }, DEPTH));
    }
    return outputs;
}