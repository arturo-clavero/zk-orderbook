import { useMyContext } from "../UI/components/utils/context";
import axios from "axios";

export function getMarketPrice(mainToken, quoteToken) {
  const maxSlippage = 0.2;
  const marketPrice = mainToken.price / quoteToken.price;
  return marketPrice * (1 + maxSlippage);
}

export function useCreateOrder() {
  const { tradeStatus, setTradeStatus, walletAddress } = useMyContext();

  const createOrder = async (
    side,
    price,
    amount,
    chartPair,
    mainToken,
    quoteToken,
    tradeType,
    slippage,
    ammFallback
  ) => {
    if (tradeStatus !== "OPEN") return;

    try {
      setTradeStatus("LOADING");
      const orderFloatPriority= {
        side,
        price: parseFloat(price),
        amount: parseFloat(amount),
        chartPair,
        mainToken,
        quoteToken,
        tradeType,
         ...(tradeType === "market" && {
          slippage: parseFloat(slippage),
          ammFallback,
        }),
        timestamp: Date.now(),
        user: walletAddress,
      };

      const orderStringPriority = {
                tradeType,

      side,
        price: price.toString(),
        amount: amount.toString(),
        chartPair,
        mainToken,
        quoteToken,
         ...(tradeType === "market" && {
          slippage: slippage.toString(),
          ammFallback,
        }),
        timestamp: Date.now(),
        user: walletAddress,
      };

      console.log("order backend: ", orderFloatPriority);
      console.log("order for sign: ", orderStringPriority);

      //sign!
      setTradeStatus("SIGN")
setTimeout(() => {
  setTradeStatus(prev => (prev === "SIGN" ? "OPEN_METAMASK" : prev));
}, 5000);    
      const signature = await signOrder(orderStringPriority, walletAddress);

      //proof gen!
      setTradeStatus("PROOF_GEN");
      await new Promise((res) => setTimeout(res, 1500));
      // await backend.send("new_order", { orderFloatPiority, signature });
      
      //new order!
      console.log("Order created:", orderFloatPriority, "Signature:", signature);
      setTradeStatus("ORDER_OPEN");
      setTimeout(() => setTradeStatus("OPEN"), 2500);

    } catch (err) {
      console.error("Order creation failed:", err);
      setTradeStatus("ERROR");
      setTimeout(() => setTradeStatus("OPEN"), 2500);
    }
  };

  return createOrder;
}

async function signOrder(order, userAddress) {
  try {
    // Make sure the wallet is actually connected
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    if (!accounts || accounts.length === 0) {
      console.log("Wallet not authorized. Ask user to connect first.");
      throw new Error("Wallet not connected");
    }
 // Build EIP712 typed data dynamically
    const orderFields = [
      { name: "tradeType", type: "string" },
      { name: "side", type: "string" },
      { name: "price", type: "string" },
      { name: "amount", type: "string" },
      { name: "mainToken", type: "string" },
      { name: "quoteToken", type: "string" },
      { name: "timestamp", type: "uint256" },
      { name: "user", type: "address" },
    ];

    if (order.tradeType === "market") {
      orderFields.push({ name: "slippage", type: "string" });
      orderFields.push({ name: "ammFallback", type: "bool" });
    }

    const msgParams = {
      domain: {
        chainId: 1,
        name: "MyDapp",
        version: "1",
      },
      message: order,
      primaryType: "Order",
      types: {
        EIP712Domain: [
          { name: "name", type: "string" },
          { name: "version", type: "string" },
          { name: "chainId", type: "uint256" },
        ],
        Order: orderFields,
      },
    };

const signature = await ethereum.request({
  method: "eth_signTypedData_v4",
  params: [userAddress, JSON.stringify(msgParams)],
});

    return signature;
  } catch (err) {
    console.error("Signature failed:", err);
    throw err;
  }

}
