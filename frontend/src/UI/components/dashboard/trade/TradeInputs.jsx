import { Stack, TextField } from "@mui/material";
import { textFieldBase } from "./styles.js";
import TradeAmmFallback from "./TradeAmmFallback.jsx";
import { handleNumeric } from "../../utils/reusable.jsx";
import { format } from "../../utils/math.jsx";
import { useMyContext } from "../../utils/context.jsx";

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
}) {
  const { walletConnected, balance } = useMyContext();

  const totalPrice = price * amount;
  const mainBalance = balance[mainToken.symbol];
  const invalidSell = mainBalance < amount;
  const invalidBuy = balance[quoteToken.symbol] < totalPrice;

  return (
    <Stack spacing={1.5}>
      {tradeType === "market" ? (
        <TextField
          label="Max Slippage (%)"
          size="small"
          type="number"
          value={(slippage * 100).toFixed(2)}
          onChange={(e) => handleNumeric(Number(e.target.value) / 100, setSlippage)}
          slotProps={{ input: { min: 0, step: 0.1 } }}
          sx={textFieldBase}
        />
      ) : (
        <TextField
          label={`Price (${quoteToken?.symbol})`}
          size="small"
          type="number"
        value={format(price)  == 0 ? "" : format(price)}

         onChange={(e) => {
              const val = e.target.value;
              handleNumeric(val === "" ? 0 : val, setPrice);
            }}
          sx={textFieldBase}
        />
      )}

      <TextField
        label={`Amount (${mainToken?.symbol})`}
        size="small"
        type="number"
        value={format(amount)  == 0 ? "" : format(amount)}

         onChange={(e) => {
              const val = e.target.value;
              handleNumeric(val === "" ? 0 : val, setAmount);
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
