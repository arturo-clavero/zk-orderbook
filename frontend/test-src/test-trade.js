import { sendMessage } from "./test-websocket";

export default function  trade(walletAddress, chartPair, mainToken, quoteToken, side, tradeType, amount, price, slippage, ammFallback){
    console.log("trade by ", walletAddress);
    console.log(chartPair, ", ", mainToken, "-> ", quoteToken);
    console.log(side, tradeType);
    console.log(amount, " @", price);
    console.log("slipapge:", slippage, "amm: ", ammFallback);
     const order = {
        tradeType, // spot | market
        side, // buy | sell
        price: parseFloat(price), // price per 1 token
        amount: parseFloat(amount), // n of tokens
        chartPair, // remains ETH/PYUSD (if eth/pyusd or pyusd/eth)
        mainToken, //1s token, (if eth/pyusd -> eth, if pyusd/eth -> pyusd)
        quoteToken, //2nd token, (if eth/pyusd -> pyusd, if pyusd/eth -> eth)
        ...(tradeType === "market" && {
          //market trades
          slippage: parseFloat(slippage), // percent (0.05)-> 5 %; user is willing to have a max price = market price * 1.05% (1 + slippage); market price is calc with oracles in real time
          ammFallback, // true or false -> if true we will use a relayer and swap with uniswap if no matching orders on the dex book, market orders should be settled inmediately
        }),
        filled: 0, //how much money was filled for partials
        timestamp: Date.now(),
        user: walletAddress,
      };
    const msg = {
        type: "trade",
        order: order,
    }
    sendMessage(msg);
}
