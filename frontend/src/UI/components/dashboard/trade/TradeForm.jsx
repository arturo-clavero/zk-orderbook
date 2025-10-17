import { Box } from "@mui/material";
import { useState, useEffect } from "react";
import { useMyContext } from "../../utils/context.jsx";
import { useCreateOrder } from "../../../../actions/trade.js";
import TradeHeader from "./TradeHeader.jsx";
import TradeTypeSelector from "./TradeTypeSelector.jsx";
import TradeSideSelector from "./TradeSideSelector.jsx";
import TradeDetails from "./TradeDetails.jsx";
import TradeInputs from "./TradeInputs.jsx";
import TradeButton from "./TradeButton.jsx";
import ToastAlert from "./ToastAlert.jsx";

export default function TradeForm() {
  const {
    chartPair,
    setSwitched,
    switched,
    balance,
    tradeStatus,
    walletConnected,
  } = useMyContext();
  const createOrder = useCreateOrder();

  const mainToken = switched ? chartPair?.token2 : chartPair?.token1;
  const quoteToken = switched ? chartPair?.token1 : chartPair?.token2;

  const [tradeType, setTradeType] = useState("spot");
  const [side, setSide] = useState("buy");
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");
  const [slippage, setSlippage] = useState(0.05);
  const [publicRouterFallback, setPublicRouterFallback] = useState(true);
  const [toast, setToast] = useState({ open: false, type: "success", msg: "" });

  const numPrice = Number(price) || 0;
  const numAmount = Number(amount) || 0;
  const totalPrice =
    tradeType === "spot"
      ? numPrice * numAmount
      : (mainToken.price / quoteToken.price) * numAmount * (1 + slippage);

  // const invalidBuy = (totalPrice > balance[quoteToken.symbol] || !walletConnected) && side === "buy";
  // const invalidSell = (amount > balance[mainToken.symbol] || ! walletConnected) && side === "sell";

  const invalidBuy = (totalPrice > balance[quoteToken.symbol] ) && side === "buy";
  const invalidSell = (amount > balance[mainToken.symbol] ) && side === "sell";

  useEffect(() => {
    if (tradeStatus === "ORDER_OPEN")
      setToast({
        open: true,
        type: "success",
        msg: "✅ Order Created Successfully!",
      });
    else if (tradeStatus === "ERROR")
      setToast({
        open: true,
        type: "error",
        msg: "❌ Order Failed. Please try again.",
      });
  }, [tradeStatus]);

  return (
    <Box
      sx={{
        border: 1,
        borderColor: "divider",
        p: 2,
        height: 550,
        borderRadius: 2,
        bgcolor: "background.paper",
        boxShadow: 3,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        gap: 2,
      }}
    >
      <TradeHeader
        chartPair={chartPair}
        mainToken={mainToken}
        quoteToken={quoteToken}
        setSwitched={setSwitched}
      />
      <TradeTypeSelector tradeType={tradeType} setTradeType={setTradeType} />
      <TradeSideSelector side={side} setSide={setSide} />
      <TradeDetails
        side={side}
        walletConnected={walletConnected}
        balance={balance}
        quoteToken={quoteToken}
        mainToken={mainToken}
      />
      <TradeInputs
        tradeType={tradeType}
        side={side}
        mainToken={mainToken}
        quoteToken={quoteToken}
        price={price}
        setPrice={setPrice}
        amount={amount}
        setAmount={setAmount}
        totalPrice={totalPrice}
        invalidBuy={invalidBuy}
        invalidSell={invalidSell}
        balance={balance}
        slippage={slippage}
        setSlippage={setSlippage}
        publicRouterFallback={publicRouterFallback}
        setPublicRouterFallback={setPublicRouterFallback}
        walletConnected={walletConnected}
      />
      <TradeButton
        side={side}
        tradeStatus={tradeStatus}
        mainToken={mainToken}
        price={price}
        amount={amount}
        chartPair={chartPair}
        quoteToken={quoteToken}
        tradeType={tradeType}
        slippage={slippage}
        publicRouterFallback={publicRouterFallback}
        createOrder={createOrder}
        walletConnected={walletConnected}
      />
      <ToastAlert toast={toast} setToast={setToast} />
    </Box>
  );
}
