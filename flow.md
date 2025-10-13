DEPOSIT 
Front end : user submits deposit and calls backedn to get proof, user sends deposit + proof
------
Backend Generate Proof :
Valid balance update: insertNewItemMerkle (from noir library) 
*kyc

Backend stores {type: deposit, id:wuwu, user:3, token: WTBC, amount 3, new_merkle_root: XHXHXHX}
-----
Contract verifies proof, checks old leaf nullifier, updates root, emits event
---
Backend listents to event updates root and balance 
event {type: deposit, id: wuwu}
backend ->update balance of user 3, token WBTC += 3;
backend -> update merkle root to XHXHXHXHX


PLACE ORDER
Front end : user signs order intent 

Backend : generates proof
Order amounts are valid
Balance is sufficient
User signed 

(Backend verifies proof?)-> optional

Backend updates root and sends order (include proof) for matching 


SETTLE ORDER
Backend matches orders 

Backend generates proof
Order new amounts are valid 
New balances are valid 
Orders are valid


Backend stores order settlement data with an ID
store (type: settlement, id: 456, users [1, 2, 3], new balances[[ETH, 1], [WBTC, 2], [ETH, 2]], merkleroot: "abcd"}


Contraxt checks proof, chrck nullifiers of settled orders, updates merkle roots, emits event settlement successful and new root
New balances, uncheck locked balances for settled orders
 event (type settlement id 456)


Backend updates root, updates balances, updates orders to settled

//if this doesnt go to on chain to update locked funds the user can withdraw while rheir order is processing! 


WITHDRAW
Front end : user gets proof from backend and user calls to withdraw with proof

Backend Generate Proof :
Valid balance update: insertNewItemMerkle (from noir library) 
New amount is smaller or equal to previous amount
Signature is by user

*store {id: blabla, type: withdrawal, user: 1, amount: 2, token: eth} 

Contract verifies proof, checks old leaf nullifier, updates root, transfers and emits event 
*event {id: blabala, type: withdrawal}

Backend listents to event -> takes ID -> updates correspondant root and balance


BALANCES
per user, per token, per type:
user1 
        - ETH 
                  *available 1    -> can use to buy/sell/ withdraw
                  *locked 2         -> inside open order (can not use)
        -WBTC 
                  *available 0  
                   *locked 0