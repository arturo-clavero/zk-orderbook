export const tokenDefs = [
  {
    symbol: "WBTC",
    feed: "0xc9d8b075a5c69303365ae23633d4e085199bf5c520a3b90fed1322a0342ffc33",
    icon: "/btc3.png",
    decimals: "8",
    contract: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
  },
  {
    symbol: "ETH",
    feed: "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace",
    icon: "/eth.png",
    decimals: "18",
    contract: "",
  },
  // {
  //   symbol: "SOL",
  //   feed: "0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d",
  //   icon: "/sol.png",
  //    decimals: "9",
  //   contract: "",
  // },
  {
    symbol: "PYUSD",
    feed: "0xc1da1b73d7f01e7ddd54b3766cf7fcd644395ad14f70aa706ec5384c59e76692",
    icon: "/pyusd.png",
    decimals: "6",
    contract: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
  },
];

// https://docs.pyth.network/price-feeds/price-feeds

export const pairDefs = [
  // ["PYUSD", "ETH"],
  ["ETH", "PYUSD"],
  // ["WBTC", "ETH"],
  ["PYUSD", "WBTC"],
];
