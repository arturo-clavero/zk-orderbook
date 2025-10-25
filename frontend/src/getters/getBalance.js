import convertToUSD from "../actions/priceFeed";

function getBalances(account) {
  //fetch from backend!
  //foramt data
  const balances = [];
  return balances;
}

export function getTotalBalance(account) {
  const balances = getBalances(account);
  let total = 0;
  for (let i = 0; i < balances.length; i++) {
    const tokenAddress = balances[i].token.address;
    const amount = balances[i].amount;
    total += convertToUSD(tokenAddress, amount);
  }
}

export function getTotalTokens(account) {
  const balances = getBalances(account);
  const tokens = [];
  for (let i = 0; i < balances.length; i++) {
    const tokenAddress = balances[i].token.address;
    tokens.append(tokenAddress);
  }
  return tokens;
}

export function getBalanceForToken(tokenAddress) {
  const balances = getBalances(account);
  for (let i = 0; i < balances.length; i++) {
    if (tokenAddress == balances[i].token.address) return balances[i].amount;
  }
  return 0;
}
