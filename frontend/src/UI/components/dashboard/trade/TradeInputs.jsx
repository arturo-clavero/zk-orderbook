import { Stack, TextField } from "@mui/material";
import { textFieldBase } from "./styles.js";
import TradeAmmFallback from "./TradeAmmFallback.jsx";
import { handleNumeric } from "../../utils/reusable.jsx";
import { displayFormat, format } from "../../utils/math.jsx";
import { useMyContext } from "../../utils/context.jsx";
import { useState } from "react";
export default function TradeInputs({
  tradeType,
  mainToken,
  quoteToken,
  price,
  setPrice,
  amount,
  setAmount,
  slippage,
  setSlippage,
  publicRouterFallback,
  setPublicRouterFallback,
  invalidBuy,
  invalidSell
}) {
  const { walletConnected, balance, priceInitialized, setPriceInitialized } = useMyContext();

  const totalPrice = price * amount;
  const mainBalance = balance[mainToken.symbol];
  const [inputSlippage, setInputSlippage] = useState(5);
  // const invalidSell = mainBalance < amount;
  // const invalidBuy = balance[quoteToken.symbol] < totalPrice;

  return (
    <Stack spacing={1.5}>
      {tradeType === "market" ? (
        <TextField
          label="Max Slippage (%)"
          size="small"
          type="number"
          value={inputSlippage}
          onChange={(e) => {
            const val = e.target.value;
            handleNumeric(val, null);
            const num = parseFloat(val);
            if (!isNaN(num)) {
              setSlippage(num / 100);
              setInputSlippage(num);
            }
          }}
          slotProps={{ input: { min: 0, step: 0.1 } }}
          sx={textFieldBase}
        />
      ) : (
        <TextField
          label={`Price (${quoteToken?.symbol})`}
          size="small"
          type="number"
          value={price}
          onChange={(e) => {
            if (!priceInitialized)
              setPriceInitialized(true);
            const val = e.target.value;
            handleNumeric(val, null);
            const num = parseFloat(val);
            if (!isNaN(num)) setPrice(num);
          }}
          sx={textFieldBase}
        />
      )}

      <TextField
        label={`Amount (${mainToken?.symbol})`}
        size="small"
        type="number"
        value={amount}
        onChange={(e) => {
          const val = e.target.value;
          handleNumeric(val, null);
          const num = parseFloat(val);
          if (!isNaN(num)) setAmount(num);
        }}
        error={invalidSell}
        helperText={
          invalidSell && walletConnected
            ? mainBalance > 0
              ? `Can only sell ${mainBalance} ${mainToken.symbol}`
              : `No ${mainToken.symbol} to sell`
            : ""
        }
        sx={textFieldBase}
      />

      <TextField
        label={`Total (${quoteToken?.symbol})`}
        size="small"
        value={format(totalPrice) || 0}
        slotProps={{ input: { readOnly: true } }}
        tabIndex={-1}
        error={invalidBuy}
        helperText={
          invalidBuy && walletConnected ? `Not enough ${quoteToken.symbol}` : ""
        }
        sx={textFieldBase}
      />

      {tradeType === "market" && (
        <TradeAmmFallback
          publicRouterFallback={publicRouterFallback}
          setPublicRouterFallback={setPublicRouterFallback}
        />
      )}
    </Stack>
  );
}
