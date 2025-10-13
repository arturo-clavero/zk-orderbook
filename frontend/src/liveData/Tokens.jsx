import { useState, useEffect } from "react";
import { HermesClient } from "@pythnetwork/hermes-client";
import { tokenDefs } from "./tokenDefs.jsx";
import {
  initializeTokens,
  initializeTokenPairs,
  nullResults,
  setTokensParam,
  parsePriceUpdatesStream,
  fetchDataFallback,
} from "./tokenUtils.jsx";
const connection = new HermesClient("https://hermes.pyth.network", {});

export function useTokens() {
  const [tokens, setTokens] = useState(() => initializeTokens());
  const [tokenPairs, setTokenPairs] = useState(() =>
    initializeTokenPairs(tokens)
  );
  const priceIds = tokenDefs.map((t) => t.feed);

  //stream live prices
  useEffect(() => {
    let eventSource;

    async function startStream() {
      eventSource = await connection.getPriceUpdatesStream(priceIds);
      eventSource.onmessage = (event) => {
        let results = { ...nullResults };
        const r = parsePriceUpdatesStream(event);
        results.priceNow = r;
        setTokensParam(setTokens, setTokenPairs, results);
      };
      eventSource.onerror = (error) => {
        console.error("Error receiving updates:", error);
        eventSource.close();
      };
    }

    startStream();

    return () => {
      if (eventSource) eventSource.close();
    };
  }, []);

  // fetch historic data every 1 min
  useEffect(() => {
    async function fetchPeriodic() {
      const results = { ...nullResults };
      results.twap1min = await fetchDataFallback(60, "TWAP");
      results.twap10min = await fetchDataFallback(600, "TWAP");
      results.price24hAgo = await fetchDataFallback(60 * 24 * 60, "24HAGO");
      console.log("RESULTS", results);
      setTokensParam(setTokens, setTokenPairs, results);
    }
    fetchPeriodic();
    const interval = setInterval(fetchPeriodic, 60 * 1000);
    return () => clearInterval(interval);
  }, []);
  return { tokens, tokenPairs };
}
