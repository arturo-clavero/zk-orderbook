import {
  Box,
  Stack,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useMyContext } from "../../utils/context";

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
  walletConnected,
}) {
  const { handleWalletPopAnimation } = useMyContext();
  const loading = ["LOADING", "SIGN", "PROOF_GEN", "OPEN_METAMASK"].includes(
    tradeStatus
  );
  return (
    <Box sx={{ position: "relative" }}>
      <Stack spacing={1}>
        {!walletConnected && (
          <Typography variant="caption" color="error">
            Please connect your wallet to trade
          </Typography>
        )}
        <Button
          variant="contained"
          color={side === "buy" ? "success" : "error"}
          fullWidth
          sx={{ py: 1.5, fontWeight: 700 }}
          disabled={
            tradeStatus !== "OPEN" ||
            price == 0 ||
            amount == 0 ||
            !walletConnected
          }
          onClick={async () =>
            await createOrder(
              side,
              price,
              amount,
              chartPair.symbol,
              mainToken.symbol,
              quoteToken.symbol,
              tradeType,
              tradeType == "market" ? slippage : 0,
              tradeType == "market" ? publicRouterFallback : 0
            )
          }
        >
          {loading && (
            <CircularProgress size={20} sx={{ color: "white", mr: 1 }} />
          )}
          {tradeStatus === "OPEN" &&
            `${side === "buy" ? "Buy" : "Sell"} ${mainToken.symbol}`}
          {tradeStatus === "LOADING" && "Submitting..."}
          {tradeStatus === "SIGN" && "Sign Order..."}
          {tradeStatus === "OPEN_METAMASK" && "Open MetaMask..."}

          {tradeStatus === "PROOF_GEN" && "Generating Proof..."}
          {tradeStatus === "ORDER_OPEN" && "Order Created ✅"}
          {tradeStatus === "ERROR" && "Order Failed ❌"}
        </Button>
        {!walletConnected && (
          <Box
            onClick={() => handleWalletPopAnimation()}
            sx={{
              position: "absolute",
              inset: 0,
              cursor: "pointer",
            }}
          />
        )}
      </Stack>
    </Box>
  );
}
