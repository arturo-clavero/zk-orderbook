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
    isFirst: bool,
        //balance update:
    oldAmount: u32,
    delta: u32,
    userSecret: Field,
        //deposit delta:
    //tx: Field,
)
{
    //proof delta?...
        //proof tx ...
    if (isFirst){
            balance::insertBalance(
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
    else{
        balance::updateBalance(
            ogLeafIdx,
            ogLeafKey,
             ogLeafNextIdx,
             ogLeafNextKey,
            ogLeafValue,
            newLeafValue,
            rootBefore,
            rootAfter,
            siblingsBefore,
            oldAmount,
            delta,
            userSecret,
        );
    }
    
}