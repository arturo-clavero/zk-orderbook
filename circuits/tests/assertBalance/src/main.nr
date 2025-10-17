use dep::indexed_merkle;
use std::hash::poseidon2;

fn main(
    leafIdx: u32,
    leafKey: u64,
    leafNextIdx: u32,
    leafNextKey: u64,
    leafValue: Field,
    root: pub Field,
    siblings: [Field; indexed_merkle::MAX_DEPTH],
    amount: u32,
    userSecret: Field,
) {
    indexed_merkle::verifyProof(
        leafIdx,
        leafKey,
        leafNextIdx,
        leafNextKey,
        leafValue,
        root,
        siblings
    );
    assertBalance(amount, userSecret, leafValue);
}

fn assertBalance(
    amount: u32,
    userSecret: Field,
    leafValue: Field,
){
    let amount_f: Field = amount.into();
    let hash: Field = poseidon2::Poseidon2::hash([userSecret, amount_f], 2);
    
    assert(hash == leafValue);
}
