import { createContext, useState, useContext } from "react";
import { useTokens } from "../../../liveData/Tokens";
import { pairDefs } from "../../../liveData/tokenDefs";
const AppContext = createContext();

const tokens = [
  { symbol: "ETH", amount: 350, color: "#627EEA" },
  { symbol: "USDC", amount: 1200, color: "#2775CA" },
  { symbol: "WBTC", amount: 250, color: "#F7931A" },
  { symbol: "DAI", amount: 500, color: "#F5AC37" },
];

export function preloadIcons(tokenPairs) {
  const urls = new Set();

  Object.values(tokenPairs).forEach((pair) => {
    if (pair.token1?.icon) urls.add(pair.token1.icon);
    if (pair.token2?.icon) urls.add(pair.token2.icon);
  });

  urls.forEach((url) => {
    const img = new Image();
    img.src = url;
  });
}

export function ContextProvider({ children }) {
  const [state, setState] = useState("");
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [walletMenuAnchor, setWalletMenuAnchor] = useState(null);
  const { tokenPairs } = useTokens();
  preloadIcons(tokenPairs);
  const str = `${pairDefs[0][0]}/${pairDefs[0][1]}`;
  const [chartPair, setChartPair] = useState(tokenPairs[str]);
  const [switched, setSwitched] = useState(false);

  return (
    <AppContext.Provider
      value={{
        walletConnected,
        setWalletConnected,
        walletAddress,
        setWalletAddress,
        walletMenuAnchor,
        setWalletMenuAnchor,
        state,
        setState,
        tokens,
        chartPair,
        setChartPair,
        switched,
        setSwitched,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useMyContext() {
  return useContext(AppContext);
}
