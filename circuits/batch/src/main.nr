fn main(
    oldRoot: pub Field,
    newRoot: pub Field,
    firstDeposits: [actions::FirstDeposit; actions::MAX_ACTIONS],
    totalFirstDeposits: u32,
    deposits: [actions::Deposit; actions::MAX_ACTIONS],
    totalDeposits: u32,
    withdrawals: [actions::Withdrawal; actions::MAX_ACTIONS],
    withdrawalDetails: [actions::WithdrawalDetail; actions::MAX_ACTIONS],
    totalWithdrawals: u32,
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

    rootNow = actions::batchWithdrawal(
        rootNow,
        withdrawals,
        withdrawalDetails,
        totalWithdrawals
    );
    
    assert(rootNow == newRoot);
}
