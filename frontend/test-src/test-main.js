import deposit from "./test-deposit.js";
import withdraw from "./test-withdraw.js";
import trade from "./test-trade.js";
import { initWebSocket } from "./test-websocket.js";

initWebSocket();

async function getUser() {
  if (window.ethereum) {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    return accounts[0];
  } else {
    alert("Please install MetaMask!");
    return null;
  }
}

async function refreshAll() {
  const userElem = document.getElementById("user");

  const user = await getUser();
  userElem.textContent = user ?? "Not connected";
}

document.getElementById("refreshAll").onclick = refreshAll;

// Deposit / Withdraw
document.getElementById("depositBtn").onclick = () => {
  const amount = document.getElementById("depositAmount").value;
  const token = document.getElementById("depositToken").value;
    const walletAddress = document.getElementById("user").textContent;
  deposit(walletAddress, amount, token);
};

document.getElementById("withdrawBtn").onclick = () => {
  const amount = document.getElementById("withdrawAmount").value;
  const token = document.getElementById("withdrawToken").value;
      const walletAddress = document.getElementById("user").textContent;

  withdraw(walletAddress, amount, token);
};

// Pair switch logic
const chartPair = document.getElementById("chartPair");
const mainToken = document.getElementById("mainToken");
const quoteToken = document.getElementById("quoteToken");

chartPair.onchange = () => {
  const [main, quote] = chartPair.value.split("/");
  mainToken.textContent = main;
  quoteToken.textContent = quote;
};

document.getElementById("switchPair").onclick = () => {
  const tmp = mainToken.textContent;
  mainToken.textContent = quoteToken.textContent;
  quoteToken.textContent = tmp;
};

// Market / Spot toggle
const tradeTypeSelect = document.getElementById("tradeTypeSelect");
tradeTypeSelect.onchange = () => {
  document.getElementById("marketOptions").style.display =
    tradeTypeSelect.value === "Market" ? "flex" : "none";
};

// Trade button
document.getElementById("tradeBtn").onclick = () => {
    const chartPairV = chartPair.value;
    const mTok = mainToken.textContent;
    const qTok = quoteToken.textContent;

  const side = document.getElementById("sideSelect").value.toLowerCase();
  const tradeType = tradeTypeSelect.value.toLowerCase();
    const amount = document.getElementById("amountInputTrade").value;
  const price = document.getElementById("priceInput").value;

  const slippage = tradeType == "market" ? document.getElementById("slippageInput").value: undefined;
  const amm = tradeType=="market"? document.getElementById("ammFallback").value: undefined;
    const walletAddress = document.getElementById("user").textContent.toLowerCase();

    trade(walletAddress, chartPairV, mTok, qTok, side, tradeType, amount, price, slippage, amm);
};

// Load user
refreshAll();
