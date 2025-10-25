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

export default function TradeForm() {
  const { chartPair, setSwitched, switched, balance, tradeStatus, setToast } =
    useMyContext();

  //order parameters
  const [tradeType, setTradeType] = useState("spot");
  const [side, setSide] = useState("buy");
  const [price, setPrice] = useState(0);
  const [amount, setAmount] = useState(0);
  const mainToken = switched ? chartPair?.token2 : chartPair?.token1;
  const quoteToken = switched ? chartPair?.token1 : chartPair?.token2;
  const [slippage, setSlippage] = useState(0.05);
  const [publicRouterFallback, setPublicRouterFallback] = useState(true);
  const totalPrice = price * amount;
  const invalidBuy = balance[quoteToken.symbol] < totalPrice;
  const mainBalance = balance[mainToken.symbol];
  const invalidSell = mainBalance < amount;
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
        price={price}
        setPrice={setPrice}
        amount={amount}
        setAmount={setAmount}
        mainToken={mainToken}
        quoteToken={quoteToken}
      />
      <TradeInputs
        tradeType={tradeType}
        mainToken={mainToken}
        quoteToken={quoteToken}
        price={price}
        setPrice={setPrice}
        amount={amount}
        setAmount={setAmount}
        slippage={slippage}
        setSlippage={setSlippage}
        publicRouterFallback={publicRouterFallback}
        setPublicRouterFallback={setPublicRouterFallback}
        invalidBuy={invalidBuy}
        invalidSell={invalidSell}
      />
      <TradeButton
        tradeType={tradeType}
        side={side}
        price={price}
        amount={amount}
        mainToken={mainToken}
        quoteToken={quoteToken}
        slippage={slippage}
        publicRouterFallback={publicRouterFallback}
        invalidBuy={invalidBuy}
        invalidSell={invalidSell}
      />
    </Box>
  );
}
