import { createContext, useState, useContext } from "react";
import { useTokens } from "../../../liveData/Tokens";
import { pairDefs } from "../../../liveData/tokenDefs";
import { useWebSocketData } from "../../../liveData/useWebSocketData";

const AppContext = createContext();

function updateOrders(newOrders, orders, setOrders) {}

function initializeBalance(tokens) {
  const balance = {};
  Object.values(tokens).forEach((t) => {
    balance[t.symbol] = 1; //test delete!
  });
  console.log("init balanec: ", balance);
  return balance;
}

function updateBalances(newBalance, balance, setBalance) {
  const updated = { ...balance };

  if (Array.isArray(newBalance)) {
    // e.g. [{symbol: "ETH", amount: 1}, {symbol: "USDC", amount: 2}]
    newBalance.forEach((t) => {
      updated[t.symbol] = t.amount;
    });
  } else if (typeof newBalance === "object" && newBalance !== null) {
    // e.g. { ETH: 1, USDC: 5 }
    Object.entries(newBalance).forEach(([symbol, amount]) => {
      updated[symbol] = amount;
    });
  }

  setBalance(updated);
}

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
  const { tokenPairs, tokens } = useTokens();
  preloadIcons(tokenPairs);
  const str = `${pairDefs[0][0]}/${pairDefs[0][1]}`;
  const [chartPair, setChartPair] = useState(tokenPairs[str]);
  const [switched, setSwitched] = useState(false);
  const [marketVisible, setMarketVisible] = useState(false);
  const [depositWithdrawLoading, setDepositWithdrawLoading] = useState(false);
  const [balance, setBalance] = useState(() => initializeBalance(tokens));
  const [orders, setOrders] = useState(null);
  const [tradeStatus, setTradeStatus] = useState("OPEN");
  const [animateWallet, setAnimateWallet] = useState(false);
    const [subtleAnimateWallet, setSubtleAnimateWallet] = useState(true);
const [animationWalletLock, setAnimationWalletLock] = useState(false); 

 const handleWalletPopAnimation = () => {
    if (!animationWalletLock) {
      console.log("Trigger click animation");
      setAnimationWalletLock(true);
      setAnimateWallet(true);
      setTimeout(() => {
        setAnimateWallet(false);
        setAnimationWalletLock(false);
      }, 1200);
    }
  };

  useWebSocketData({
    walletConnected,
    walletAddress,
    onMessage: (data) => {
      if (data.type === "balances")
        updateBalances(data.balances, balance, setBalance);
      if (data.type === "orders") updateOrders(data.orders, orders, setOrders);
    },
  });

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
        chartPair,
        setChartPair,
        switched,
        setSwitched,
        marketVisible,
        setMarketVisible,
        depositWithdrawLoading,
        setDepositWithdrawLoading,
        balance,
        setBalance,
        orders,
        setOrders,
        tradeStatus,
        setTradeStatus,
        animateWallet,
        setAnimateWallet,
        subtleAnimateWallet,
        setSubtleAnimateWallet,
        animationWalletLock, 
        setAnimationWalletLock,
        handleWalletPopAnimation
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useMyContext() {
  return useContext(AppContext);
}
