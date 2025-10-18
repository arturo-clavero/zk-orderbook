import { 
    bufferToBigInt, 
    poseidonToBN, 
    MAX_DEPTH, 
    membersToStrings
} from './utils.js';
import {IndexedMerkleTree} from './merkle-tree.js';
import crypto from 'crypto';
import { Barretenberg, Fr } from "@aztec/bb.js";
import { callCircuit } from '../verify.js';


const balanceTree = new IndexedMerkleTree;
let userSecrets = {}; // store each user's secret

//balances & getBalance subtitute database, only for testing!
const balances = {};

function getBalance(userId){
    if (!(userId in balances)) return 0;
    return balances[userId];
}
function setBalance(userId, amount){
    balances[userId] = amount;
}
function updateBalance(userId, delta){
    if (!(userId in balances))
        balances[userId] = 0;
    balances[userId] += delta;
}

const pendingBalance = {}

function getPendingBalance(userId){
    if (!(userId in pendingBalance))
        pendingBalance[userId] = getBalance(userId);
    return pendingBalance[userId];
}
function setPendingBalance(userId, amount){
    pendingBalance[userId] = amount;
}

function updatePendingBalance(userId, delta){
    if (!(userId) in pendingBalance)
        pendingBalance[userId]=0;
    pendingBalance[userId] += delta;
}

 function getUserSecret(userId){
    if (!(userId in userSecrets))
        userSecrets[userId] = bufferToBigInt(crypto.randomBytes(31));
    return userSecrets[userId];
}

async function getBalanceKey(userId){
    const key = await poseidonToBN([getUserSecret(userId)], true);
    return key;
}

async function getBalanceValue(userId, amount){
    const accruedAmount = getPendingBalance(userId) + amount;//should be the pending balance!
    const value = await poseidonToBN([getUserSecret(userId), BigInt(accruedAmount)]);
    return value;
}

export function balanceKeyExists(userId){
    return ((userId) in pendingBalance);
}

function updateBalanceProofInputs(key, value){
    const input = balanceTree.updateItem(key, value);
    return membersToStrings(input);
}

function insertBalanceProofInputs(key, value){
    const input = balanceTree.insertItem(key, value);
    return membersToStrings(input);
}

async function testInsert(user, amount){
    const key = await getBalanceKey(user);
    const value = await getBalanceValue(user, amount);
    const input = insertBalanceProofInputs(key, value);
    const inputs = {
        ...input,
        oldAmount: 0, 
        delta: amount,
        userSecret: getUserSecret(user).toString(),
    }
    updatePendingBalance(user, amount);
    return await callCircuit(inputs, "single/firstDeposit");
}

async function testUpdate(user, amount){
    const key = await getBalanceKey(user);
    const value = await getBalanceValue(user, amount);
    const input = updateBalanceProofInputs(key, value);
    const inputs = {
        ...input,
        oldAmount: getPendingBalance(user), 
        delta: amount,
        userSecret: getUserSecret(user).toString(),
    }
    updatePendingBalance(user, amount);
    return await callCircuit(inputs, "single/deposit");
}
export {
    getUserSecret,
    getBalanceKey,
    getBalanceValue,
    updateBalanceProofInputs,
    insertBalanceProofInputs,
    getPendingBalance,
    updatePendingBalance,
    setPendingBalance,

    testInsert,
    testUpdate
}
