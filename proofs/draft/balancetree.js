
async function writeBalanceProofInputs(userId, amount) {

    if (!(userId in userSecrets)) {
        userSecrets[userId] = bufferToBigInt(crypto.randomBytes(31));
    }
    const userSecret = userSecrets[userId];

    const accruedAmount = getBalance(userId) + amount;//should be the pending balance!
    const value = await poseidonToBN([userSecret, BigInt(accruedAmount)]);
    const key = (await poseidonToBN([userSecret], true));//add token!

    const insertionProof = balanceTree.insertItem(key, value);
    
    //only for testing...
    if (!(userId in balances)) balances[userId] = 0;
    balances[userId] += amount;
    //TEST END

    const inputs = membersToStrings(insertionProof);
    return inputs;
}


async function readBalanceProofInputs(userId) {
    if (!(userId in userSecrets)) {
        return undefined;
    }
    const userSecret = userSecrets[userId];

    const key = (await poseidonToBN([userSecret], true));//add token!
    const merkleProof = balanceTree.generateProof(key);

    const inputs = {
      leafIdx: merkleProof.leafIdx,
      leafKey: merkleProof.leaf.key.toString(10),
      leafNextIdx: merkleProof.leaf.nextIdx,
      leafNextKey: merkleProof.leaf.nextKey.toString(10),
      leafValue: merkleProof.leaf.value.toString(10),
      root: merkleProof.root.toString(10),
      siblings: expandArray(merkleProof.siblings.map(x => x.toString(10)), MAX_DEPTH, 0)
    };

    return inputs;
}

async function writeBalanceVerify(userId, amount){
    const inputs = await writeBalanceProofInputs(userId, amount);
    const success = await callCircuit(inputs, 'verifyInsertionProof');
    return success;
}

async function readBalanceVerify(userId){
    const inputs = await readBalanceProofInputs(userId);
    if (inputs == undefined)
        return false;
    const success = await callCircuit(inputs, 'verifyProof');
    return success;
}

async function assertBalanceVerify(userId, amount){
    const readInputs = await readBalanceProofInputs(userId);
    if (readInputs == undefined)
        return false;
    const userSecret = userSecrets[userId].toString();

    const inputs = {
        ...readInputs,
        amount,
        userSecret,
    }
    const success = await callCircuit(inputs, 'test/assertBalance');
    return success;
}