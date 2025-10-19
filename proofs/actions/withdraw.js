import { 
    getUserSecret,
    getBalanceKey,
    getBalanceValue,
    getPendingBalance, 
    updateBalanceProofInputs, 
    updatePendingBalance,
} from "../tree/balanceTree.js";

let pendingWithdrawals = [];

export async function queueWithdrawal(user, amount, token, signature){
    if (!checkWithdrawal(amount, token, user, signature))
        throw new Error("invalid deposit");
    const newWithdrawal = {
        amount: amount,
        token: token,
        user: user,
        key: '',
        value: '',
        oldAmount: 0,
        inputs: {},
    }
    pendingWithdrawals.push(newWithdrawal);
}

function checkWithdrawal(amount, token, user, signature){
    if (amount > getPendingBalance(user))
        return false;
    //check signature;
    return true;
}

export async function verifyWithdrawals(max_actions){
    let oldRoot = '-1', newRoot = '-1';
    const len = pendingWithdrawals.length;
    const totalWithdrawals = len > max_actions ? max_actions : len;    
    
    let withdrawals = new Array(max_actions).fill({
            leafIdx: '0',
            leafKey: '0',
            leafNextIdx: '0',
            leafNextKey: '0',
            ogLeafValue: '0',
            newLeafValue: '0',
            rootAfter: '0',
            siblings: new Array(32).fill('0'),
            oldAmount: 0,
            userSecret: '0',
    });
    let withdrawalDetails = new Array(max_actions).fill({
        delta: 0,
    })
    for(let i = 0; i < totalWithdrawals; i ++){
        const p = pendingWithdrawals[i];
        p.key = await getBalanceKey(p.user, p.amount);
        p.value = await getBalanceValue(p.user, p.amount);
        p.oldAmount = getPendingBalance(p.user);
        const inputs = updateBalanceProofInputs(p.key, p.value);

        const newWithdrawalInputs = {
            leafIdx: inputs.leafIdx,
            leafKey: inputs.leafKey,
            leafNextIdx: inputs.leafNextIdx,
            leafNextKey: inputs.leafNextKey,
            ogLeafValue: inputs.ogLeafValue,
            newLeafValue: inputs.newLeafValue,
            rootAfter: inputs.rootAfter,
            siblings: inputs.siblings,
            oldAmount: p.oldAmount,
            userSecret: getUserSecret(p.user).toString(),
        }
        const newWithdrawalDetails = {
            delta: p.amount,
        }
        if (i == 0) oldRoot = inputs.rootBefore;
        newRoot = inputs.rootAfter;
        withdrawals[i] = newWithdrawalInputs;
        withdrawalDetails[i] = newWithdrawalDetails;
        updatePendingBalance(p.user, p.amount);
    }
    pendingWithdrawals = pendingWithdrawals.slice(totalWithdrawals);
    return {
        oldRoot,
        newRoot,
        withdrawals,
        withdrawalDetails,
        totalWithdrawals,
    }
}
