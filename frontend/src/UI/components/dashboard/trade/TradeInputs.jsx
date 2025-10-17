import {
  Stack,
  TextField,
  Typography,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { textFieldBase } from "./styles.js";
import TradeAmmFallback from "./TradeAmmFallback.jsx";
export default function TradeInputs({
  tradeType,
  side,
  mainToken,
  quoteToken,
  price,
  setPrice,
  amount,
  setAmount,
  totalPrice,
  invalidBuy,
  invalidSell,
  balance,
  slippage,
  setSlippage,
  publicRouterFallback,
  setPublicRouterFallback,
}) {
  const mainBalance = balance[mainToken.symbol] || 0;
  const quoteBalance = balance[quoteToken.symbol] || 0;
  const fee = totalPrice * 0.001;

  const handleNumeric = (val, setter) => {
    if (!/^\d*\.?\d*$/.test(val)) return;
    if (val.length > 1 && val[0] === "0" && val[1] !== ".")
      val = val.replace(/^0+/, "");
    setter(val);
  };

  return (
    <Stack spacing={1.5}>
      {tradeType === "market" ? (
        <TextField
          label="Max Slippage (%)"
          size="small"
          type="number"
          value={(slippage * 100).toFixed(2)}
          onChange={(e) => setSlippage(Number(e.target.value) / 100)}
          slotProps={{ input: { min: 0, step: 0.1 } }}
          sx={textFieldBase}
        />
      ) : (
        <TextField
          label={`Price (${quoteToken?.symbol})`}
          size="small"
          type="number"
          value={price || ""}
          onChange={(e) => handleNumeric(e.target.value, setPrice)}
          sx={textFieldBase}
        />
      )}

      <TextField
        label={`Amount (${mainToken?.symbol})`}
        size="small"
        type="number"
        value={amount || ""}
        onChange={(e) => handleNumeric(e.target.value, setAmount)}
        error={invalidSell}
        helperText={
          invalidSell
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
        value={totalPrice.toFixed(6)}
        slotProps={{ input: { readOnly: true } }}
        tabIndex={-1}
        error={invalidBuy}
        helperText={invalidBuy ? `Not enough ${quoteToken.symbol}` : ""}
        sx={textFieldBase}
      />

      {tradeType === "market" && (
        <TradeAmmFallback
          publicRouterFallback={publicRouterFallback}
          setPublicRouterFallback={setPublicRouterFallback}
        />
      )}

      <Typography variant="caption" color="text.secondary">
        Available: {side === "buy" ? quoteBalance : mainBalance}{" "}
        {side === "buy" ? quoteToken.symbol : mainToken.symbol} | Fee:{" "}
        {fee.toFixed(2)} {quoteToken.symbol}
      </Typography>
    </Stack>
  );
}
