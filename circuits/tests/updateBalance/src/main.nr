use dep::indexed_merkle;
use std::hash::poseidon2;

fn main(
    ogLeafIdx: u32,
    ogLeafKey: u64,
    ogLeafNextIdx: u32,
    ogLeafNextKey: u64,
    ogLeafValue: Field,
    newLeafIdx: u32,
    newLeafKey: u64,
    newLeafValue: Field,
    rootBefore: pub Field,
    rootAfter: pub Field,
    siblingsBefore: [Field; indexed_merkle::MAX_DEPTH],
    siblingsAfterOg: [Field; indexed_merkle::MAX_DEPTH],
    siblingsAfterNew: [Field; indexed_merkle::MAX_DEPTH],
    oldAmount: u32,
    delta: u32,
    userSecret: Field,
) {
    //verify prev

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
    assertBalanceLeaf(oldAmount, userSecret, ogLeafValue);
    assertBalanceLeaf(oldAmount + delta, userSecret, newLeafValue);

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
