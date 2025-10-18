/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import {
  Deposit,
  Deposit_Deposit,
} from "generated";
import axios from 'axios';
import { error } from "console";

Deposit.Deposit.handler(async ({ event, context }) => {
  const entity: Deposit_Deposit = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    user: event.params.user,
    token: event.params.token,
    amount: event.params.amount,
    txHash: event.transaction.hash,
  };

  context.Deposit_Deposit.set(entity);
  try {
    const response = await axios.post('http://localhost:4000/deposit', 
      {
        traderId: entity.user,
        token: entity.token,
        amount: entity.amount.toString(),
        txHash: entity.txHash,
      }
    );
    console.log("snd to backend", response.data);
  }catch(err){
    if ( err instanceof Error){
      console.log(err.message);
    } else {
      console.log('Unexpected error', err);
    }
  }
});
