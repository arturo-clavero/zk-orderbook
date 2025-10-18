fn main(
    oldRoot: pub Field,
    newRoot: pub Field,
    firstDeposits: [actions::FirstDeposit; actions::MAX_ACTIONS],
    totalFirstDeposits: u32,
    deposits: [actions::Deposit; actions::MAX_ACTIONS],
    totalDeposits: u32,
    // withdraw: [actions::Withdraw; actions::MAX_ACTIONS],
    // withdrawDetails: [actions::WithdrawDetails; actions::MAX_ACTIONS],
    // totalWithdrawals: u32,
   
){
    let mut rootNow = oldRoot;

    rootNow = actions::batchFirstDeposit(
        rootNow, 
        firstDeposits, 
        totalFirstDeposits
    );

    rootNow = actions::batchDeposit(
        rootNow, 
        deposits, 
        totalDeposits
    );

    // rootNow = actions::addOrders(
    //     rootNow,
    //     newOrders,
    //     totalNewOrders
    // )

    // rootNow = actions::settleOrders(
    //     rootNow,
    //     settledOrder,
    //     totalSettledOrders,
    // )

    // rootNow = actions::batchWithdraw(
    //     rootNow,
    //     withdraw,
    //     withdrawDetails,
    //     totalWithdrawals
    // );
    
    assert(rootNow == newRoot);
}


