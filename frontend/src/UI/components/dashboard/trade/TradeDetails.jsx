import { Stack, Typography } from "@mui/material";
import { safeNumber } from "../../utils/math";

export default function TradeDetails({
  walletConnected,
  lastPrice,
  maxAvailable,
  setPrice,
  setAmount,
  maxInputAmount,
}) {
  const clickableStyle = {
    cursor: "pointer",
    fontWeight: 600,
    color: "info.main",
    fontSize: "0.75rem",
    ml: 0.5,
  };

  return (
    <Stack>
      <Typography variant="caption" color="text.secondary">
        Last price: ${lastPrice} |{" "}
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
          Max Available: {maxAvailable} |{" "}
          <Typography
            component="span"
            variant="caption"
            sx={clickableStyle}
            onClick={() => setAmount(maxInputAmount)}
          >
            SET
          </Typography>
        </Typography>
      )}
    </Stack>
  );
}
