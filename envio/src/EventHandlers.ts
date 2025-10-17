/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import {
  Deposit,
  Deposit_Deposit,
} from "generated";

Deposit.Deposit.handler(async ({ event, context }) => {
  const entity: Deposit_Deposit = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    user: event.params.user,
    token: event.params.token,
    amount: event.params.amount,
  };

  context.Deposit_Deposit.set(entity);
});
