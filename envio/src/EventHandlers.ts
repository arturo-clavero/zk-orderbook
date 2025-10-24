/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import {
  Deposit,
  Deposit_Deposit,
} from "generated";

import axios from 'axios';
import Redis from "ioredis";
import  { ethers } from "ethers";

const redis = new Redis({
  host: process.env.REDIS_HOST || 'redis',
  port: Number(process.env.REDIS_PORT || '6379'),
  
})

//corrupted "amount" value
function normalizer(token: string, amount: string | number | bigint): string {
  const decimals = token.toUpperCase() === "ETH" ? 18 : 6;
  return ethers.formatUnits(amount.toString(), decimals);
}

Deposit.Deposit.handler(async ({ event, context }) => {
  const user = event.params.user;
  const token =  event.params.token.toUpperCase();
  const amount =  event.params.amount;
  const txHash = event.transaction.hash;

  const humanAmount = normalizer(token, amount);
      //redis stuff store deposit record
  const redisKey = `deposit:${txHash}`;

  await redis.hset(redisKey, {
    user,
    token,
    rawAmount: amount.toString(),
    humanAmount: humanAmount,
    txHash: txHash,
    timestamp: Date.now.toString(),
  });

  //update user balance
  const balanceKey = `balance:${user}`
  const prev = await redis.hget(balanceKey, token);
  const updated = (parseFloat(prev || "0") + parseFloat(humanAmount)).toString();
  await redis.hset(balanceKey, token, updated);

  //Publish evnts
  await redis.publish(
    "deposits",
    JSON.stringify({
      user, token, rawAmount: amount.toString(), txHash })
  );
  //index for envio
  context.Deposit_Deposit.set({
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    user,
    token,
    amount,
    txHash,
  });
});

////axios save to postgres
  // context.Deposit_Deposit.set(entity);
  // try {
  //   const response = await axios.post('http://localhost:4000/deposit', 
  //     {
  //       traderId: entity.user,
  //       token: entity.token,
  //       rawAmount: entity.amount.toString(),
  //       txHash: entity.txHash,
  //     }
  //   );
  //   console.error("DEBUG", entity);
  // }catch(err){
  //   if ( err instanceof Error){
  //     console.log(err.message);
  //   } else {
  //     console.log('Unexpected error', err);
  //   }
  // }

