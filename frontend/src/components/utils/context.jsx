import { createContext, useState, useContext } from "react";

const AppContext = createContext();

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
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function getContext() {
  return useContext(AppContext);
}
