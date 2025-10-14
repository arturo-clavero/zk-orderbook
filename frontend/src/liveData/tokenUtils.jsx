import { tokenDefs, pairDefs } from "./tokenDefs.jsx";

const HERMES_TWAP_URL = "https://hermes.pyth.network/v2/updates/twap";

const HERMES_PRICE_URL = "https://hermes.pyth.network/v2/updates/price/latest";

export function initializeTokens() {
  return tokenDefs.reduce((acc, t) => {
    acc[t.symbol] = {
      ...t,
      price: 0,
      price24hAgo: 0,
      twap1min: 0,
      twap10min: 0,
    };
    return acc;
  }, {});
}

export function initializeTokenPairs(tokens) {
  return pairDefs.reduce((acc, [s1, s2]) => {
    acc[`${s1}/${s2}`] = {
      token1: tokens[s1] || {
        symbol: s1,
        price: 0,
        price24hAgo: 0,
        twap1min: 0,
        twap10min: 0,
      },
      token2: tokens[s2] || {
        symbol: s2,
        price: 0,
        price24hAgo: 0,
        twap1min: 0,
        twap10min: 0,
      },
      price: 0,
      price24hAgo: 0,
      twap1h: 0,
      twap24h: 0,
    };
    return acc;
  }, {});
}

export const nullResults = {
  priceNow: null,
  price24hAgo: null,
  twap1min: null,
  twap10min: null,
};

export function setTokensParam(setTokens, setTokenPairs, result) {
  let updatedTokens = null;
  setTokens((prev) => {
    updatedTokens = { ...prev };
    tokenDefs.forEach((t) => {
      const symbol = t.symbol;
      const feed = t.feed;

      if (result.priceNow?.has(feed))
        updatedTokens[symbol].price = result.priceNow.get(feed);
      if (result.price24hAgo?.has(feed))
        updatedTokens[symbol].price24hAgo = result.price24hAgo.get(feed);
      if (result.twap1min?.has(feed))
        updatedTokens[symbol].twap1min = result.twap1min.get(feed);
      if (result.twap10min?.has(feed))
        updatedTokens[symbol].twap10min = result.twap10min.get(feed);
    });
    if (setTokenPairs) {
      const updatedPairs = {};
      pairDefs.forEach(([s1, s2]) => {
        const token1 = updatedTokens[s1];
        const token2 = updatedTokens[s2];

        updatedPairs[`${s1}/${s2}`] = {
          token1,
          token2,
          price: token2?.price ? token1.price / token2.price : 0,
          price24hAgo: token2?.price24hAgo
            ? token1.price24hAgo / token2.price24hAgo
            : 0,
          twap1min: token2?.twap1min ? token1.twap1min / token2.twap1min : 0,
          twap10min: token2?.twap10min
            ? token1.twap10min / token2.twap10min
            : 0,
        };
      });
      setTokenPairs(updatedPairs);
    }
    return updatedTokens;
  });
}

export async function fetchDataFallback(time, type) {
  try {
    const fallbackOffsets = [0, 60, 300, 900, -60, -300, -900];

    for (const offset of fallbackOffsets) {
      if (time + offset < 0) break;
      const result = await fetchData(time + offset, type);
      if (result !== undefined) {
        console.log("Using offset (seconds):", offset);
        return result;
      }
    }
    throw new Error("all fallbacks failed, no data available at this time");
  } catch (err) {
    console.error("Hermes fetch failed:", err);
  }
}

async function fetchData(time, type) {
  try {
    const priceIds = tokenDefs.map((t) => t.feed.slice(2));
    const idsQuery = priceIds.map((id) => `ids[]=${id}`).join("&");
    let url;
    if (type == "TWAP")
      url = `${HERMES_TWAP_URL}/${time}/latest?${idsQuery}&parsed=true`;
    else if (type == "24HAGO") {
      const now = Math.floor(Date.now() / 1000);
      const prevTime = now - time;
      url = `${HERMES_PRICE_URL}?${idsQuery}&publish_time=${prevTime}&parsed=true`;
    } else throw new Error("Incorrect type: ", +type);

    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);

    const data = await res.json();

    if (!data.parsed || data.parsed.length === 0) {
      throw new Error("No TWAP data found");
    }
    const result = data.parsed;
    const resultMap = new Map();
    for (let i = 0; i < result.length; i++) {
      const feed = `0x${result[i].id}`;
      const price =
        type === "TWAP"
          ? Number(result[i].twap.price)
          : Number(result[i].price.price);
      const expo = type === "TWAP" ? result[i].twap.expo : result[i].price.expo;
      const realPrice = price * Math.pow(10, expo);
      resultMap.set(feed, realPrice);
    }
    return resultMap;
  } catch (err) {
    console.error("Hermes fetch failed:", err);
    console.error("type: ", type);
    return null;
  }
}

export function parsePriceUpdatesStream(event) {
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
