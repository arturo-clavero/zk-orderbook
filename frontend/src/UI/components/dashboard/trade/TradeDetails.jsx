import { Stack, Typography } from "@mui/material";
import { floorAndFormat, formatFixed, safeNumber } from "../../utils/math";
import { useMyContext } from "../../utils/context";
import { useEffect } from "react";

export const clickableStyle = {
  cursor: "pointer",
  fontWeight: 600,
  color: "info.main",
  fontSize: "0.75rem",
  ml: 0.5,
};

export default function TradeDetails({
  side,
  price,
  setPrice,
  amount,
  setAmount,
  mainToken,
  quoteToken,
}) {
  const { balance, walletConnected, priceInitialized, setPriceInitialized } = useMyContext();
  const lastPrice = mainToken.price / quoteToken.price;
  const maxAvailable =
    side == "sell"
      ? balance[mainToken.symbol]
      : balance[quoteToken.symbol] / price;


  useEffect(() => {
    if (!priceInitialized && safeNumber(lastPrice) > 0 && price === 0) {
      setPrice(lastPrice);
      setPriceInitialized(true);
    }
  }, [lastPrice, maxAvailable, price, amount]);

  return (
    <Stack>
      <Typography variant="caption" color="text.secondary">
        Last price: ${formatFixed(lastPrice)} |{" "}
        <Typography
          component="span"
          variant="caption"
          sx={clickableStyle}
          onClick={() => setPrice(lastPrice)}
        >
          SET
        </Typography>
      </Typography>
      {walletConnected && (
        <Typography variant="caption" color="text.secondary">
          Max Available: {formatFixed(maxAvailable)} |{" "}
          <Typography
            component="span"
            variant="caption"
            sx={clickableStyle}
            onClick={() => {
              setAmount(maxAvailable);
            }}
          >
            SET
          </Typography>
        </Typography>
      )}
    </Stack>
  );
}
