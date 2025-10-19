use dep::indexed_merkle;
use std::hash::poseidon2;

fn insertBalance(
    ogLeafIdx: u32,
    ogLeafKey: u64,
    ogLeafNextIdx: u32,
    ogLeafNextKey: u64,
    ogLeafValue: Field,
    newLeafIdx: u32,
    newLeafKey: u64,
    newLeafValue: Field,
    rootBefore: Field,
    rootAfter: Field,
    siblingsBefore: [Field; indexed_merkle::MAX_DEPTH],
    siblingsAfterOg: [Field; indexed_merkle::MAX_DEPTH],
    siblingsAfterNew: [Field; indexed_merkle::MAX_DEPTH],
    oldAmount: u32,
    delta: u32,
    userSecret: Field,
) {

        indexed_merkle::verifyInsertionProof(
        ogLeafIdx,
        ogLeafKey,
        ogLeafNextIdx,
        ogLeafNextKey,
        ogLeafValue,
        newLeafIdx,
        newLeafKey,
        newLeafValue,
        rootBefore,
        rootAfter,
        siblingsBefore,
        siblingsAfterOg,
        siblingsAfterNew
    );
    assert(oldAmount == 0);
    assertBalanceLeaf(oldAmount + delta, userSecret, newLeafValue);
}

fn updateBalance(
    leafIdx: u32,
    leafKey: u64,
    leafNextIdx: u32,
    leafNextKey: u64,
    ogLeafValue: Field,
    newLeafValue: Field,
    rootBefore: Field,
    rootAfter: Field,
    siblings: [Field; indexed_merkle::MAX_DEPTH], 
    isWithdrawal: bool,
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
    assertBalanceLeaf(oldAmount, userSecret, ogLeafValue);
    if (isWithdrawal){
        assertBalanceLeaf(oldAmount - delta, userSecret, newLeafValue);
    }
    else{
        assertBalanceLeaf(oldAmount + delta, userSecret, newLeafValue);
    }
}

fn assertBalanceLeaf(
    amount: u32,
    userSecret: Field,
    leafValue: Field,
){
    let amount_f: Field = amount.into();
    let hash: Field = poseidon2::Poseidon2::hash([userSecret, amount_f], 2);
    assert(hash == leafValue);
}
