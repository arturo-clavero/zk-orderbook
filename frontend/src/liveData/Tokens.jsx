import { useState, useEffect } from "react";
import { HermesClient } from "@pythnetwork/hermes-client";

const connection = new HermesClient("https://hermes.pyth.network", {});
// https://docs.pyth.network/price-feeds/price-feeds
export const tokenDefs = [
  {
    symbol: "WBTC",
    feed: "0xc9d8b075a5c69303365ae23633d4e085199bf5c520a3b90fed1322a0342ffc33",
    icon: "/btc3.png",
  },
  {
    symbol: "ETH",
    feed: "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace",
    icon: "/eth.png",
  },
  {
    symbol: "SOL",
    feed: "0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d",
    icon: "/sol.png",
  },
  {
    symbol: "PYUSD",
    feed: "0xc1da1b73d7f01e7ddd54b3766cf7fcd644395ad14f70aa706ec5384c59e76692",
    icon: "/pyusd.png",
  },
];

export const pairDefs = [
  ["PYUSD", "ETH"],

  ["ETH", "PYUSD"],
  ["WBTC", "ETH"],
  ["SOL", "ETH"],
];

function parseResults(event) {
  const parsedEvent = JSON.parse(event.data);
  const result = parsedEvent.parsed;
  const resultMap = new Map();

  for (let i = 0; i < result.length; i++) {
    const feed = `0x${result[i].id}`;
    const price = Number(result[i].price.price);
    const expo = result[i].price.expo;
    const realPrice = price * Math.pow(10, expo);
    resultMap.set(feed, realPrice);
  }
  return resultMap;
}

export function useTokens() {
  const [tokens, setTokens] = useState(() =>
    tokenDefs.reduce((acc, t) => {
      acc[t.symbol] = { ...t, price: 0 };
      return acc;
    }, {})
  );

  const [tokenPairs, setTokenPairs] = useState(() =>
    pairDefs.reduce((acc, [s1, s2]) => {
      acc[`${s1}/${s2}`] = { token1: tokens[s1], token2: tokens[s2], price: 0 };
      return acc;
    }, {})
  );

  useEffect(() => {
    let eventSource;

    async function start() {
      const priceIds = tokenDefs.map((t) => t.feed);
      eventSource = await connection.getPriceUpdatesStream(priceIds);

      eventSource.onmessage = (event) => {
        const resultMap = parseResults(event);

        const newTokens = { ...tokens };
        tokenDefs.forEach((t) => {
          if (resultMap.has(t.feed)) {
            newTokens[t.symbol] = {
              ...t,
              price: resultMap.get(t.feed),
            };
          }
        });

        const newPairs = {};
        pairDefs.forEach(([s1, s2]) => {
          const token1 = newTokens[s1];
          const token2 = newTokens[s2];
          const p1 = token1?.price || 0;
          const p2 = token2?.price || 0;

          newPairs[`${s1}/${s2}`] = {
            token1,
            token2,
            price: p2 !== 0 ? p1 / p2 : 0,
          };
        });

        setTokens(newTokens);
        setTokenPairs(newPairs);
      };

      eventSource.onerror = (error) => {
        console.error("Error receiving updates:", error);
        eventSource.close();
      };
    }

    start();

    return () => {
      if (eventSource) eventSource.close();
    };
  }, []);

  return { tokens, tokenPairs };
}
