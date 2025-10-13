import fetch from "node-fetch";

const HERMES_URL = "https://hermes.pyth.network/v2/updates/price/latest";
const PRICE_IDS = [
  "e62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43", // BTC/USD
  "ef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d", // ETH/USD
];

// Fetch price closest to a given timestamp
async function fetchPriceAtTime(publishTime) {
  const idsQuery = PRICE_IDS.map((id) => `ids[]=${id}`).join("&");
  const url = `${HERMES_URL}?${idsQuery}&publish_time=${publishTime}&parsed=true`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP error ${res.status}`);

  const data = await res.json();

  if (!data.parsed || data.parsed.length === 0) {
    return null;
  }

  // Return an array of prices for each id
  return data.parsed.map(({ id, price }) => ({
    id,
    price: Number(price.price) * Math.pow(10, price.expo),
  }));
}

// Try to fetch ~24h ago with fallback retries
async function fetch24hPrice() {
  const now = Math.floor(Date.now() / 1000);
  let target = now - 24 * 60 * 60;

  const fallbackOffsets = [0, 60, 300, 900]; // +0s, +1m, +5m, +15m

  for (const offset of fallbackOffsets) {
    const result = await fetchPriceAtTime(target + offset);
    if (result && result.length > 0) {
      console.log("Using offset (seconds):", offset);
      return result;
    }
  }

  throw new Error("No price data found within fallback window");
}

async function main() {
  try {
    const price24hAgo = await fetch24hPrice();
    console.log("Prices ~24h ago:", price24hAgo);
  } catch (err) {
    console.error(err.message);
  }
}

main();
