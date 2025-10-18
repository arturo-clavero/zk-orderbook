fn main(
    leafIdx: u32,
    leafKey: u64,
    leafNextIdx: u32,
    leafNextKey: u64,
    ogLeafValue: Field,
    newLeafValue: Field,
    rootBefore: Field,
    rootAfter: Field,
    siblings: [Field; indexed_merkle::MAX_DEPTH], 
    oldAmount: u32,
    delta: u32,
    userSecret: Field   
){
    indexed_merkle::verifyUpdateProof(
        leafIdx,
        leafKey,
        leafNextIdx,
        leafNextKey,
        ogLeafValue,
        newLeafValue,
        rootBefore,
        rootAfter,
        siblings,
    );
    balance::assertBalanceLeaf(oldAmount, userSecret, ogLeafValue);
    balance::assertBalanceLeaf(oldAmount + delta, userSecret, newLeafValue);
}
