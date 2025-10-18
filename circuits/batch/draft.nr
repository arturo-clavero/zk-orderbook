
// struct Deposit {
//     leafIdx: u32,
//     leafKey: u64,
//     leafNextIdx: u32,
//     leafNextKey: u64,
//     ogLeafValue: Field,
//     newLeafValue: Field,
//     rootAfter: Field,
//     siblings: [Field; indexed_merkle::MAX_DEPTH],
//     oldAmount: u32,
//     delta: u32,
//     userSecret: Field,
//     // userAddress: Field, 
// }

// struct Withdraw {
//     leafIdx: u32,
//     leafKey: u64,
//     leafNextIdx: u32,
//     leafNextKey: u64,
//     ogLeafValue: Field,
//     newLeafValue: Field,
//     rootAfter: Field,
//     siblings: [Field; indexed_merkle::MAX_DEPTH],
//     oldAmount: u32,
//     userSecret: Field,
// }

// struct WithdrawDetails {
//     delta: u32,
//     // userAddress: u32,
// }


//     for i in 0..totalDeposits{
//         let d = deposits[i];
//         balance::updateBalance(
//             d.leafIdx,
//             d.leafKey,
//             d.leafNextIdx,
//             d.leafNextKey,
//             d.ogLeafValue,
//             d.newLeafValue,
//             rootNow,
//             d.rootAfter,
//             d.siblings,
//             d.oldAmount,
//             d.delta,
//             d.userSecret,
//         );
//         rootNow = d.rootAfter;
//     }

//     for i in 0..totalWithdrawals{
//         let w = withdraw[i];
//         let wd = withdrawDetails[i];
//         balance::updateBalance(
//             w.leafIdx,
//             w.leafKey,
//             w.leafNextIdx,
//             w.leafNextKey,
//             w.ogLeafValue,
//             w.newLeafValue,
//             rootNow,
//             w.rootAfter,
//             w.siblings,
//             w.oldAmount,
//             wd.delta,
//             w.userSecret,
//         );
//         rootNow = w.rootAfter;
//     }

//WITHDRAWALS: 

// fn main(
//     oldRoot: pub Field,
//     newRoot: pub Field,
//     deposits: [Deposit; MAX_ACTIONS],
//     firstDeposits: [DepositFirst; MAX_ACTIONS],
//     // withdraws: [Withdraw; MAX_ACTIONS],
//     // withdrawDetails: pub [WithdrawDetails; MAX_ACTIONS],
//     // settles: [Settle; MAX_ACTIONS],
//     // orders: [Order; MAX_ACTIONS],
// ){

// }

// struct WithdrawDetails {
//     delta: u32,
//     userAddress: Field,
// }

// struct Withdraw {
//     update: BalanceUpdate,
//     details: WithdrawDetails,
// }



// struct Settle {
//     order_ids: [Field; 2],
// }

// struct Order{
//     id: Field,
//     //...
// }


