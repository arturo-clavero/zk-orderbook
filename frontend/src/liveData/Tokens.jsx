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
} from "./utils.jsx";
import { LocalConvenienceStoreOutlined } from "@mui/icons-material";
const connection = new HermesClient("https://hermes.pyth.network", {});

export function useTokens() {
  const [tokens, setTokens] = useState(() => initializeTokens());
  // const [tokenPairs, setTokenPairs] = useState({});

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
        // console.log("results ", r);
        results.priceNow = r;
        // console.log("results map: ", results);
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

  //fetch historic data every 1 min / 10 min / 24hrs
  // useEffect(() => {
  //   let count = 0;
  //   let standard = 60; //1 min

  //   async function fetchPeriodic() {
  //     count += 1;
  //     const results = { ...nullResults };
  //     results.twap1min = await fetchDataFallback(standard, "TWAP");

  //     if (count % 10 == 0)
  //       results.twap10min = await fetchDataFallback(standard * 10, "TWAP");

  //     if (count % (24 * 60) == 0) {
  //       results.price24hAgo = await fetchDataFallback(
  //         standard * 24 * 60,
  //         "24HAGO"
  //       );
  //       count = 0;
  //     }
  //     setTokensParam(setTokens, setTokenPairs, results);
  //   }
  //   fetchPeriodic();
  //   const interval = setInterval(fetchPeriodic, standard * 1000);
  //   return () => clearInterval(interval);
  // }, []);
  // console.log("tokens: ", tokens);
  // console.log("token pairs: ", tokenPairs);
  return { tokens, tokenPairs };
}
