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
    mainToken,
    quoteToken,
    tradeType
  ) => {
    if (tradeStatus !== "OPEN") return;

    try {
      setTradeStatus("LOADING");

      const order = {
        side,
        price,
        amount,
        mainToken,
        quoteToken,
        tradeType,
        timestamp: Date.now(),
        user: walletAddress,
      };

      setTradeStatus("PROOF_GEN");
      await new Promise((res) => setTimeout(res, 1500));

      // const signature = "0xFakeSignature";
      const signature = await signOrder(order, walletAddress);
      console.log("Order created:", order, "Signature:", signature);
      // await backend.send("new_order", { order, signature });

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
    if (window.ethereum && userAddress) {
      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [JSON.stringify(order), userAddress],
      });
      return signature;
    }

    // fallback: mock sign for test
    console.log("could nto connect... fake sig...");
    return "0xSIMULATED_SIGNATURE";
  } catch (error) {
    console.error("Signature failed:", error);
    throw error;
  }
}
