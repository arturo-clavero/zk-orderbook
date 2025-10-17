import { Button, CircularProgress } from "@mui/material";

export default function TradeButton({
  side,
  tradeStatus,
  mainToken,
  price,
  amount,
  chartPair,
  quoteToken,
  tradeType,
  slippage,
  publicRouterFallback,
  createOrder,
}) {
  const loading = ["LOADING", "PROOF_GEN"].includes(tradeStatus);
  return (
    <Button
      variant="contained"
      color={side === "buy" ? "success" : "error"}
      fullWidth
      sx={{ py: 1.5, fontWeight: 700 }}
      disabled={tradeStatus !== "OPEN" || price == 0 || amount == 0}
      onClick={async () =>
        await createOrder(
          side,
          price,
          amount,
          chartPair.symbol,
          mainToken.symbol,
          quoteToken.symbol,
          tradeType,
          tradeType == "market" ? slippage: null,
          tradeType == "market" ? publicRouterFallback: null,
        )
      }
    >
      {loading && <CircularProgress size={20} sx={{ color: "white", mr: 1 }} />}
      {tradeStatus === "OPEN" &&
        `${side === "buy" ? "Buy" : "Sell"} ${mainToken.symbol}`}
      {tradeStatus === "LOADING" && "Submitting..."}
      {tradeStatus === "PROOF_GEN" && "Generating Proof..."}
      {tradeStatus === "ORDER_OPEN" && "Order Created ✅"}
      {tradeStatus === "ERROR" && "Order Failed ❌"}
    </Button>
  );
}
