import { getBalanceKey, getBalanceValue } from "../tree/balanceTree";

const pendingDeposits = [];
const pendingFirstDeposits = [];
const pendingWithdrawals = [];
// const pendingNewOrders = [];
// const pendingSettlements = [];

export function verify(){
    const totalDeposits = pendingDeposits.length;
    const totalFirstDeposits = pendingFirstDeposits.length;

    let oldRoot;
    let newRoot;

    let firstDeposits = [];
    for(let i = 0; i < totalFirstDeposits; i ++){
        const p = pendingFirstDeposits[i];
        const inputs = insertBalanceProofInputs(p.key, p.value);
        const newDepositInputs = {
            leafIdx: inputs.leafIdx,
            leafKey: inputs.leafKey,
            leafNextIdx: inputs.leafNextIdx,
            ogLeafValue: inputs.ogLeafValue,
            newLeafValue: inputs.newLeafValue,
            rootBefore: inputs.rootBefore,
            rootAfter: inputs.rootAfter,
            siblings: inputs.siblings,
        }
        if (i == 0)
            oldRoot = inputs.rootBefore;
        newRoot = inputs.rootAfter;
        firstDeposits.push(newDepositInputs);
    }

    let deposits = [];
    for(let i = 0; i < totalDeposits; i ++){
        const p = pendingDeposits[i];
        const inputs = updateBalanceProofInputs(p.key, p.value);
        const newDepositInputs = {
            leafIdx: inputs.leafIdx,
            leafKey: inputs.leafKey,
            leafNextIdx: inputs.leafNextIdx,
            ogLeafValue: inputs.ogLeafValue,
            newLeafValue: inputs.newLeafValue,
            rootBefore: inputs.rootBefore,
            rootAfter: inputs.rootAfter,
            siblings: inputs.siblings,
        }
        // if (i == 0)
        //     oldRoot = inputs.rootBefore;
        newRoot = inputs.rootAfter;
        deposits.push(newDepositInputs);
    }

    for (let i = 0; i < totalPendingFirstDeposits; i++){

    }

    const circuitInputs = {
        oldRoot,
        newRoot,
        firstDeposits,
        totalFirstDeposits,
        deposits,
        totalDeposits,
    }
}
export async function queueDeposit(amount, token, user, log){
    if (!checkDeposit(amount, token, user, log))
        throw new Error("invalid deposit");
    const newDeposit = {
        amount: amount,
        token: token,
        user: user,
        key: await getBalanceKey(user),
        value: await getBalanceValue(),
    }
    if (isFirstKey(newDeposit.key)) 
        pendingFirstDeposits.push(newDeposit);
    else 
        pendingDeposits.push(newDeposit);
}

function checkDeposit(amount, token, user, log){
    return true;
}

// export function queueWithdrawal(amount, token, user, signature){
//     if (!checkWithdrawal(amount, token, user, signature))
//         throw new Error("invalid withdrawal");
//     const newWithdrawal = {
//         amount: amount,
//         token: token,
//         user: user,
//         key: getKey(),
//         value: getValue(),
//     }
//     pendingWithdrawals.push(newWithdrawal);
// }

// function checkWithdrawal(amount, token, user, signature){
//     return true;
// }

// export function queueSettlement(order1, order2, amount){
//     if (!checkSettlement(order1, order2, amount))
//         throw new Error("invalid settlement");
//     const orderFrom = {
//         key: getKey(order1),
//         value: getValue(order1),
//     }
//     const orderTo = {
//         key: getKey(order2),
//         value: getValue(order2),
//     }
//     if (isFirstKey(orderFrom.key))
//         pendingNewOrders.push(orderFrom);
//     if (isFirstKey(orderTo.key))
//         pendingNewOrders.push(orderTo);
//     const newSettlement = {
//         order1: orderFrom,
//         order2: orderTo,
//         amount: amount,
//     }
//     pendingSettlements.push(newSettlement);
// }

// function checkSettlement(order1, order2, amount){
//     return true;
// }
