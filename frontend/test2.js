import fetch from "node-fetch";

const HERMES_TWAP_URL = "https://hermes.pyth.network/v2/updates/twap";
const PRICE_IDS = [
  "e62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43", // BTC/USD
  "ef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d", // ETH/USD
];

// Fetch latest TWAPs over a custom time window
async function fetchTwap(windowSeconds) {
  const idsQuery = PRICE_IDS.map((id) => `ids[]=${id}`).join("&");
  const url = `${HERMES_TWAP_URL}/${windowSeconds}/latest?${idsQuery}&parsed=true`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP error ${res.status}`);

  const data = await res.json();

  if (!data.parsed || data.parsed.length === 0) {
    throw new Error("No TWAP data found");
  }

  // Map each result into a cleaner object
  return data.parsed.map(({ id, twap }) => ({
    id,
    price: Number(twap.price) * Math.pow(10, twap.expo),
  }));
}

async function main() {
  try {
    const twap5m = await fetchTwap(300); // 5 min TWAP
    const twap10m = await fetchTwap(600); // 10 min TWAP

    console.log("5m TWAPs:", twap5m);
    console.log("10m TWAPs:", twap10m);
  } catch (err) {
    console.error("Error:", err.message);
  }
}

main();
