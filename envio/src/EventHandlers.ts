/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import {
  Deposit,
  Deposit_Deposit,
} from "generated";
import axios from 'axios';
import { error } from "console";
import { execPath } from "process";
import  { ethers } from "ethers";

//corrupted "amount" value
function normilizer(token: string, amount: string | number | bigint): string {
  let decimals: number;
  switch (token.toUpperCase()){
    case "ETH":
      decimals = 18;
      break;
    case "PYUSD":
    case "ETH":
    default:
      decimals = 6;
      break;
  }
  return ethers.formatUnits(amount.toString(), decimals);
}

Deposit.Deposit.handler(async ({ event, context }) => {
  const entity: Deposit_Deposit = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    user: event.params.user,
    token: event.params.token,
    amount: event.params.amount,
    txHash: event.transaction.hash,
  };

  const normilizedAmount = normilizer(entity.token, entity.amount);
  context.Deposit_Deposit.set(entity);
  try {
    const response = await axios.post('http://localhost:4000/deposit',
      {
        wallet: entity.user,
        token: entity.token,
        rawAmount: entity.amount.toString(),
        txHash: entity.txHash,
      }
    );
    console.error("DEBUG", entity);
  }catch(err){
    if ( err instanceof Error){
      console.log(err.message);
    } else {
      console.log('Unexpected error', err);
    }
  }
});