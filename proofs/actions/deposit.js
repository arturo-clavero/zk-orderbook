import { 
    getUserSecret,
    getBalanceKey,
    getBalanceValue,
    getPendingBalance, 
    insertBalanceProofInputs, 
    updateBalanceProofInputs, 
    balanceKeyExists,
    updatePendingBalance,
    setPendingBalance
} from "../tree/balanceTree.js";

let pendingDeposits = [];
let pendingFirstDeposits = [];

export async function queueDeposit(user, amount, token, log){
    if (!checkDeposit(amount, token, user, log))
        throw new Error("invalid deposit");
    const newDeposit = {
        amount: amount,
        token: token,
        user: user,
        key: '',
        // key: await getBalanceKey(user),
        value: '',
        oldAmount: 0,
        inputs: {},
    }
    if (balanceKeyExists(user))
    {
        // const accruedAmount = getPendingBalance(user) + amount;
        // newDeposit.value = await getBalanceValue(user, accruedAmount);
        // newDeposit.inputs = updateBalanceProofInputs(newDeposit.key, newDeposit.value);
        // newDeposit.oldAmount = getPendingBalance(user),
        pendingDeposits.push(newDeposit);
    }
    else
    {
        
        // newDeposit.value = await getBalanceValue(user, amount);
        // newDeposit.oldAmount = getPendingBalance(user),
        // newDeposit.inputs = insertBalanceProofInputs(newDeposit.key, newDeposit.value);
        pendingFirstDeposits.push(newDeposit);
                        console.log("pending balance of user: ", user, " ->", getPendingBalance(user));
        setPendingBalance(user, 0);
                        console.log("pending balance of user: ", user, " ->", getPendingBalance(user));

    }
    // updatePendingBalance(user, amount);
}
       

function checkDeposit(amount, token, user, log){
    return true;
}

export async function verifyDeposits(max_actions){
    // console.log("VERIFY DEPOSITS: ");
    console.log("pending deposits: ", pendingDeposits);

    let oldRoot = '-1', newRoot = '-1';
    const len = pendingDeposits.length
    const totalDeposits = len > max_actions ? max_actions : len;    
    
    let deposits = new Array(max_actions).fill({ 
            leafIdx: '0',
            leafKey: '0',
            leafNextIdx: '0',
            leafNextKey: '0',
            ogLeafValue: '0',
            newLeafValue: '0',
            rootAfter: '0',
            siblings: new Array(32).fill('0'),
            oldAmount: 0,
            delta: 0,
            userSecret: '0',
    });
    for(let i = 0; i < totalDeposits; i ++){
        const p = pendingDeposits[i];
        // const inputs = p.inputs;
        // console.log("pre inputs: ", p.inputs);
                p.key = await getBalanceKey(p.user, p.amount);
                p.value = await getBalanceValue(p.user, p.amount);
                p.oldAmount = getPendingBalance(p.user);
                console.log("pending balance of user: ", p.user, " ->", getPendingBalance(p.user));
        const inputs = updateBalanceProofInputs(p.key, p.value);
                updatePendingBalance(p.user, p.amount);
                                console.log("pending balance of user: ", p.user, " ->", getPendingBalance(p.user));

        // console.log("post inputs: ", inputs);
        const newDepositInputs = {
            leafIdx: inputs.leafIdx,
            leafKey: inputs.leafKey,
            leafNextIdx: inputs.leafNextIdx,
            leafNextKey: inputs.leafNextKey,
            ogLeafValue: inputs.ogLeafValue,
            newLeafValue: inputs.newLeafValue,
            rootAfter: inputs.rootAfter,
            siblings: inputs.siblings,
            oldAmount: p.oldAmount,
            delta: p.amount,
            userSecret: getUserSecret(p.user).toString(),
        }
        if (i == 0) oldRoot = inputs.rootBefore;
        newRoot = inputs.rootAfter;
        deposits[i] = newDepositInputs;

    }
    pendingDeposits = pendingDeposits.slice(totalDeposits);
    return {
        oldRoot,
        newRoot,
        deposits,
        totalDeposits,
    }
}

export async function verifyFirstDeposits(max_actions){
    console.log("first pending deposits: ", pendingFirstDeposits);
    let oldRoot = '-1', newRoot = '-1';
    const len = pendingFirstDeposits.length
    const totalFirstDeposits = len > max_actions ? max_actions : len;

    let firstDeposits = new Array(max_actions).fill({ 
            ogLeafIdx: '0',
            ogLeafKey: '0',
            ogLeafNextIdx: '0',
            ogLeafNextKey: '0',
            ogLeafValue: '0',
            newLeafIdx: '0',
            newLeafKey: '0',
            newLeafNextIdx: '0',
            newLeafNextKey: '0',
            newLeafValue: '0',
            rootAfter: '0',
            siblingsBefore: new Array(32).fill('0'),
            siblingsAfterOg: new Array(32).fill('0'),
            siblingsAfterNew: new Array(32).fill('0'),
            oldAmount: 0,
            delta: 0,
            userSecret: '0',
    });
    for(let i = 0; i < totalFirstDeposits; i ++){
        const p = pendingFirstDeposits[i];
            p.key = await getBalanceKey(p.user);
            p.value = await getBalanceValue(p.user, p.amount);
            p.oldAmount = getPendingBalance(p.user);
        // console.log("pre inputs: ", p.inputs);
        // const inputs = p.inputs;
        const inputs = insertBalanceProofInputs(p.key, p.value);
                        console.log("pending balance of user: ", p.user, " ->", getPendingBalance(p.user));
                        updatePendingBalance(p.user, p.amount);

                        console.log("pending balance of user: ", p.user, " ->", getPendingBalance(p.user));
console.log("old root: ", inputs.rootBefore);
        // console.log("post inputs: ", inputs);
        const newDepositInputs = {
            ogLeafIdx: inputs.ogLeafIdx,
            ogLeafKey: inputs.ogLeafKey,
            ogLeafNextIdx: inputs.ogLeafNextIdx,
            ogLeafNextKey: inputs.ogLeafNextIdx,
            ogLeafValue: inputs.ogLeafValue,
            newLeafIdx: inputs.newLeafIdx,
            newLeafKey: inputs.newLeafKey,
            newLeafValue: inputs.newLeafValue,
            rootAfter: inputs.rootAfter,
            siblingsBefore: inputs.siblingsBefore,
            siblingsAfterOg: inputs.siblingsAfterOg,
            siblingsAfterNew: inputs.siblingsAfterNew,
            oldAmount: p.oldAmount,
            delta: p.amount,
            userSecret: getUserSecret(p.user).toString(),
        }
        // updatePendingBalance(p.user, p.amount);
        if (i == 0) oldRoot = inputs.rootBefore;
        newRoot = inputs.rootAfter;
        firstDeposits[i] = newDepositInputs;
    }
    pendingFirstDeposits = pendingFirstDeposits.slice(totalFirstDeposits);

    return {
        oldRoot,
        newRoot,
        firstDeposits,
        totalFirstDeposits,
    }
}