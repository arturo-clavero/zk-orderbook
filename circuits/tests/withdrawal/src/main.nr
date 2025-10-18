use dep::balance;
use dep::indexed_merkle;

fn main(
    //insert leaf:
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
    //balance update:
    oldAmount: u32,
    delta: pub u32,
    userSecret: Field,
    //withdrawal delta:
        // signature: Field,
        // userAddress: pub Field,
)
{
    //proof delta?...
        //delta >= oldAmount;
        //proof signature valid
        //userAddress = sig.user ?
    
    balance::updateBalance(
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
        siblingsAfterNew,
        oldAmount,
        delta,
        userSecret,
    );
    
}