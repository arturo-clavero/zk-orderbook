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

function normalizeAmount(token: string, amount: string | number | bigint): string{
  let decimals: number;
  let formated: string;

  switch(token) {
    case "USDT":
      decimals = 6;
      formated = ethers.formatUnits(amount.toString(), decimals);
      return parseFloat(formated).toFixed(2);
    case "PYUSD":
      decimals = 18;
      formated = ethers.formatUnits(amount.toString(), decimals);
      return parseFloat(formated).toString(2);
    case "ETH":
      decimals = 18;
      formated = ethers.formatUnits(amount.toString(), decimals);
      return formated;

    default:
      decimals = 18;
      formated = ethers.formatUnits(amount.toString(), decimals);
      return formated;
  }
}

Deposit.Deposit.handler(async ({ event, context }) => {
  const entity: Deposit_Deposit = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    user: event.params.user,
    token: event.params.token,
    amount: event.params.amount,
    txHash: event.transaction.hash,
  };

  const normilizedAmonut = normalizeAmount(entity.token, entity.amount);
  context.Deposit_Deposit.set(entity);
  try {
    const response = await axios.post('http://localhost:4000/deposit', 
      {
        traderId: entity.user,
        token: entity.token,
        amount: normilizedAmonut,
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
