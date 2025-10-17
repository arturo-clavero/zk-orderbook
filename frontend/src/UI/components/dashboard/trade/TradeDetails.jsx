import { Stack, Typography } from "@mui/material";
import { safeNumber } from "../../utils/math";


export default function TradeDetails({
    side,
    walletConnected,
    balance, 
    quoteToken,
    mainToken,
}
){
    const quoteBalance = balance[quoteToken.symbol] || 0;
    const mainBalance = balance[mainToken.symbol] || 0;
  const mainChange = mainToken.price24hAgo
    ? mainToken.price / mainToken.price24hAgo - 1
    : 0;
  const quoteChange = quoteToken.price24hAgo
    ? quoteToken.price / quoteToken.price24hAgo - 1
    : 0;
  const change = ((1 + mainChange) / (1 + quoteChange) - 1).toFixed(4);

  const last24 = change > 0 ? `+${change} %` : change < 0 ? `${change} %` : "~";

  const lastPrice = (
    safeNumber(mainToken.price) / safeNumber(quoteToken.price)
  ).toFixed(4);
    return(
        <Stack>
             <Typography variant="caption" color="text.secondary">
        Last price: ${lastPrice} | 24h Change: {last24}
      </Typography>
              {walletConnected && (
                <Typography variant="caption" color="text.secondary">
                  Available: {side === "buy" ? quoteBalance : mainBalance}{" "}
                  {side === "buy" ? quoteToken.symbol : mainToken.symbol}
                </Typography>
              )}
    </Stack>
    )
}
