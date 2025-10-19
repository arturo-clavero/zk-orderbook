global MAX_ACTIONS:u32 = 3;

struct FirstDeposit {
    ogLeafIdx: u32,
    ogLeafKey: u64,
    ogLeafNextIdx: u32,
    ogLeafNextKey: u64,
    ogLeafValue: Field,
    newLeafIdx: u32,
    newLeafKey: u64,
    newLeafValue: Field,
    rootAfter: Field,
    siblingsBefore: [Field; indexed_merkle::MAX_DEPTH],
    siblingsAfterOg: [Field; indexed_merkle::MAX_DEPTH],
    siblingsAfterNew: [Field; indexed_merkle::MAX_DEPTH],
    oldAmount: u32,
    delta: u32,
    userSecret: Field,
    // userAddress: Field,
}

fn batchFirstDeposit(
    oldRoot: Field,
    firstDeposits: [FirstDeposit; MAX_ACTIONS],
    totalFirstDeposits: u32,
)->Field
{
    let mut rootNow:Field = oldRoot;
    for i in 0..MAX_ACTIONS{
        if (i < totalFirstDeposits) {
            let fd = firstDeposits[i];
            balance::insertBalance(
                fd.ogLeafIdx,
                fd.ogLeafKey,
                fd.ogLeafNextIdx,
                fd.ogLeafNextKey,
                fd.ogLeafValue,
                fd.newLeafIdx,
                fd.newLeafKey,
                fd.newLeafValue,
                rootNow,
                fd.rootAfter,
                fd.siblingsBefore,
                fd.siblingsAfterOg,
                fd.siblingsAfterNew,
                fd.oldAmount,
                fd.delta,
                fd.userSecret,
            );
            rootNow = fd.rootAfter;
        }
    }
    rootNow
}

struct Deposit {
    leafIdx: u32,
    leafKey: u64,
    leafNextIdx: u32,
    leafNextKey: u64,
    ogLeafValue: Field,
    newLeafValue: Field,
    rootAfter: Field,
    siblings: [Field; indexed_merkle::MAX_DEPTH],
    oldAmount: u32,
    delta: u32,
    userSecret: Field,
    // userAddress: Field, 
}

fn batchDeposit(
    oldRoot: Field,
    deposits: [Deposit; MAX_ACTIONS],
    totalDeposits: u32,
)->Field
{
    let mut rootNow:Field = oldRoot;
    for i in 0..MAX_ACTIONS{
        if (i < totalDeposits) {
            let d = deposits[i];
            balance::updateBalance(
                d.leafIdx,
                d.leafKey,
                d.leafNextIdx,
                d.leafNextKey,
                d.ogLeafValue,
                d.newLeafValue,
                rootNow,
                d.rootAfter,
                d.siblings,
                false,
                d.oldAmount,
                d.delta,
                d.userSecret,
            );
            rootNow = d.rootAfter;
        }
    }
    rootNow
}


struct Withdrawal {
    leafIdx: u32,
    leafKey: u64,
    leafNextIdx: u32,
    leafNextKey: u64,
    ogLeafValue: Field,
    newLeafValue: Field,
    rootAfter: Field,
    siblings: [Field; indexed_merkle::MAX_DEPTH],
    oldAmount: u32,
    userSecret: Field,
}

struct WithdrawalDetail {
    delta: u32,
    // userAddress: Field,
}

fn batchWithdrawal(
    oldRoot: Field,
    withdraw: [Withdrawal; MAX_ACTIONS],
    withdrawDetails : [WithdrawalDetail; MAX_ACTIONS],
    totalWithdrawals: u32,
)->Field
{
    let mut rootNow:Field = oldRoot;
    for i in 0..MAX_ACTIONS{
        if (i < totalWithdrawals) {
            let w = withdraw[i];
            let wd = withdrawDetails[i];
            assert(wd.delta < w.oldAmount + 1);
            balance::updateBalance(
                w.leafIdx,
                w.leafKey,
                w.leafNextIdx,
                w.leafNextKey,
                w.ogLeafValue,
                w.newLeafValue,
                rootNow,
                w.rootAfter,
                w.siblings,
                true,
                w.oldAmount,
                wd.delta,
                w.userSecret,
            );
            rootNow = w.rootAfter;
        }
    }
    rootNow
}