import { createContext, useState, useContext } from "react";

const AppContext = createContext();

const tokens = [
  { symbol: "ETH", amount: 350, color: "#627EEA" },
  { symbol: "USDC", amount: 1200, color: "#2775CA" },
  { symbol: "WBTC", amount: 250, color: "#F7931A" },
  { symbol: "DAI", amount: 500, color: "#F5AC37" },
];

export function ContextProvider({ children }) {
  const [state, setState] = useState("");
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [walletMenuAnchor, setWalletMenuAnchor] = useState(null);
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function getContext() {
  return useContext(AppContext);
}
