import {
  Box,
  Typography,
  Stack,
  TextField,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Snackbar,
  Alert,
  CircularProgress,
  Switch,
  FormControlLabel,
} from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { useEffect } from "react";
import { useState } from "react";
import { useMyContext } from "../../utils/context.jsx";
import { safeNumber } from "../../utils/math.jsx";
import { useCreateOrder } from "../../../../actions/trade.js";

const style = 0;
export default function TradeForm() {
  const { chartPair, setSwitched, switched, balance, tradeStatus } =
    useMyContext();
  const mainToken = chartPair
    ? switched == false
      ? chartPair.token1
      : chartPair.token2
    : null;
  const quoteToken = chartPair
    ? switched == false
      ? chartPair.token2
      : chartPair.token1
    : null;

  const [tradeType, setTradeType] = useState("spot");
  const [side, setSide] = useState("buy");
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");

  const handleTradeType = (event, newType) => {
    if (newType) setTradeType(newType);
  };

  const handleSide = (newSide) => {
    setSide(newSide);
    setPrice(0);
    setAmount(0);
  };
  const lastPrice = (
    safeNumber(mainToken.price) / safeNumber(quoteToken.price)
  ).toFixed(4);

  const mainChange = mainToken.price24hAgo
    ? mainToken.price / mainToken.price24hAgo - 1
    : 0;
  const quoteChange = quoteToken.price24hAgo
    ? quoteToken.price / quoteToken.price24hAgo - 1
    : 0;
  const change = ((1 + mainChange) / (1 + quoteChange) - 1).toFixed(4);

  const last24 = change > 0 ? `+${change} %` : change < 0 ? `${change} %` : "~";

  const twap1m = (
    safeNumber(mainToken.twap1min) / safeNumber(quoteToken.twap1min)
  ).toFixed(4);
  const twap10m = (
    safeNumber(mainToken.twap10min) / safeNumber(quoteToken.twap10min)
  ).toFixed(4);

  const mainBalance = balance[mainToken.symbol] || 0;
  const quoteBalance = balance[quoteToken.symbol] || 0;
  const total = price * amount;
  const fee = total * 0.001;

  const [slippage, setSlippage] = useState(0.05);
  const [publicRouterFallback, setPublicRouterFallback] = useState(true);

  const [toast, setToast] = useState({ open: false, type: "success", msg: "" });

  useEffect(() => {
    if (tradeStatus === "ORDER_OPEN") {
      setToast({
        open: true,
        type: "success",
        msg: "✅ Order Created Successfully!",
      });
    } else if (tradeStatus === "ERROR") {
      setToast({
        open: true,
        type: "error",
        msg: "❌ Order Failed. Please try again.",
      });
    }
  }, [tradeStatus]);
  const createOrder = useCreateOrder();

  const handleClose = () => setToast((t) => ({ ...t, open: false }));
  const numPrice = Number(price) || 0;
  const numAmount = Number(amount) || 0;
  const totalPrice =
    tradeType === "spot"
      ? numPrice * numAmount
      : (mainToken.price / quoteToken.price) * numAmount * (1 + slippage);
  const invalidBuy = totalPrice > quoteBalance && side == "buy";
  const invalidSell = amount > mainBalance && side == "sell";
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
        minWidth: 300,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        gap: 2,
      }}
    >
      <Box>
        <Typography variant="subtitle2" color="text.secondary">
          Trading Pair
        </Typography>
        <Stack display="flex" direction="row" spacing={2}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {chartPair
              ? `${mainToken.symbol} / ${quoteToken.symbol}`
              : "Select Pair"}
          </Typography>
          <Button
            variant="contained"
            size="small"
            onClick={() => setSwitched((prev) => !prev)}
            sx={{
              minWidth: "2px",
              borderRadius: 2,
              bgcolor: "rgba(255,255,255,0)",
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.2)",
              },
            }}
          >
            <SwapHorizIcon />
          </Button>
        </Stack>
      </Box>

      <ToggleButtonGroup
        value={tradeType}
        exclusive
        onChange={handleTradeType}
        size="small"
        sx={{
          width: 130,
        }}
      >
        {style == 1 ? (
          <>
            <ToggleButton
              value="spot"
              sx={{
                flex: 1,
                color: "text.primary",
                borderColor: "divider",
                fontWeight: 400,
                "&.Mui-selected": {
                  color: "info.main",
                  fontWeight: "bold",
                  backgroundColor: "rgba(30, 144, 255, 0.1)",
                  borderColor: "info.main",
                },
                "&:hover": {
                  backgroundColor: "rgba(30, 144, 255, 0.05)",
                },
              }}
            >
              Spot
            </ToggleButton>

            <ToggleButton
              value="market"
              sx={{
                flex: 1,
                color: "text.primary",
                borderColor: "divider",
                fontWeight: 400,
                "&.Mui-selected": {
                  color: "info.main",
                  fontWeight: "bold",
                  backgroundColor: "rgba(30, 144, 255, 0.1)",
                  borderColor: "info.main",
                },
                "&:hover": {
                  backgroundColor: "rgba(30, 144, 255, 0.05)",
                },
              }}
            >
              Market
            </ToggleButton>
          </>
        ) : (
          <>
            <ToggleButton
              value="spot"
              sx={{
                flex: 1,
                "&.Mui-selected": {
                  fontWeight: "bold",
                },
              }}
            >
              Spot
            </ToggleButton>
            <ToggleButton
              value="market"
              sx={{
                flex: 1,
                "&.Mui-selected": {
                  fontWeight: "bold",
                },
              }}
            >
              Market
            </ToggleButton>
          </>
        )}
      </ToggleButtonGroup>

      <Stack direction="row" spacing={1}>
        <Button
          variant="outlined"
          fullWidth
          onClick={() => handleSide("buy")}
          sx={{
            color: side === "buy" ? "white" : "success.main",
            bgcolor: side === "buy" ? "rgba(0, 128, 0, 0.1)" : "transparent",
            borderColor: side === "buy" ? "success.main" : "divider",
            fontWeight: side === "buy" ? 700 : 400,
            "&:hover": {
              bgcolor:
                side === "buy"
                  ? "rgba(0, 128, 0, 0.2)"
                  : "rgba(0, 128, 0, 0.05)",
            },
          }}
        >
          Buy
        </Button>

        <Button
          variant="outlined"
          fullWidth
          onClick={() => handleSide("sell")}
          sx={{
            color: side === "sell" ? "white" : "error.main",
            bgcolor: side === "sell" ? "rgba(255, 0, 0, 0.1)" : "transparent",
            borderColor: side === "sell" ? "error.main" : "divider",
            fontWeight: side === "sell" ? 700 : 400,
            "&:hover": {
              bgcolor:
                side === "sell"
                  ? "rgba(255, 0, 0, 0.2)"
                  : "rgba(255, 0, 0, 0.05)",
            },
          }}
        >
          Sell
        </Button>
      </Stack>

      <Typography variant="caption" color="text.secondary">
        Last price: ${lastPrice} | 24h Change: {last24}
      </Typography>

      {/* 🔵 MARKET MODE EXTRAS */}

      <Stack spacing={tradeType == "market" ? 1 : 1.5}>
        {tradeType === "market" && (
          <TextField
            label="Max Slippage (%)"
            size="small"
            type="number"
            value={(slippage * 100).toFixed(2)}
            onChange={(e) => setSlippage(Number(e.target.value) / 100)}
            slotProps={{ input: { min: 0, step: 0.1 } }}
            sx={{
              "& .MuiOutlinedInput-root.Mui-focused": {
                color: "white",
                "& fieldset": {
                  borderColor: "text.secondary",
                  borderWidth: 0.5,
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "text.secondary",
              },
            }}
          />
        )}
        {tradeType !== "market" && (
          <TextField
            label={`Price (${quoteToken?.symbol})`}
            size="small"
            type="number"
            value={price !== null && price != "" ? price : "0"}
            onChange={(e) => {
              let val = e.target.value;

              if (!/^\d*\.?\d*$/.test(val)) return;

              if (val.length > 1 && val[0] === "0" && val[1] !== ".") {
                val = val.replace(/^0+/, "");
              }

              setPrice(val);
            }}
            onBlur={() => {
              if (!price && !isNaN(Number(twap10m))) setPrice(Number(twap10m));
            }}
            slotProps={{ input: { min: 0, step: 0.01 } }}
            sx={{
              "& .MuiOutlinedInput-root.Mui-focused": {
                color: "white",
                "& fieldset": {
                  borderColor: "text.secondary",
                  borderWidth: 0.5,
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "text.secondary",
              },
            }}
          />
        )}
        <TextField
          label={`Amount (${mainToken?.symbol})`}
          size="small"
          type="number"
          value={amount !== null && amount != "" ? amount : "0"}
          onChange={(e) => {
            let val = e.target.value;

            if (!/^\d*\.?\d*$/.test(val)) return;

            if (val.length > 1 && val[0] === "0" && val[1] !== ".") {
              val = val.replace(/^0+/, "");
            }

            setAmount(val);
          }}
          error={invalidSell}
          helperText={
            invalidSell
              ? mainBalance > 0
                ? `Can only sell ${mainBalance} ${mainToken?.symbol}`
                : `No ${mainToken?.symbol} to sell, please deposit`
              : ""
          }
          slotProps={{ input: { min: 0, step: 0.01 } }}
          sx={{
            "& .MuiOutlinedInput-root": {
              color: "white",
              "& fieldset": {
                borderColor: "text.secondary",
                borderWidth: 0.5,
              },
              "&:hover fieldset": {
                borderColor: "text.secondary",
              },
              "&.Mui-focused fieldset": {
                borderColor: "text.secondary",
              },
              "&.Mui-error fieldset": {
                borderColor: "error.main",
                borderWidth: 1.5,
              },
              "&.Mui-focused.Mui-error fieldset": {
                borderColor: "error.main",
                borderWidth: 1.5,
              },
            },
            "& .MuiInputLabel-root": {
              color: "text.secondary",
              "&.Mui-focused": {
                color: "text.secondary",
              },
              "&.Mui-error": {
                color: "error.main",
              },
            },
          }}
        />

        <TextField
          label={`Total (${quoteToken?.symbol})`}
          size="small"
          value={totalPrice.toFixed(6)}
          slotProps={{ input: { readOnly: true } }}
          tabIndex={-1}
          error={invalidBuy}
          helperText={invalidBuy ? `Not enough ${quoteToken?.symbol}` : ""}
          sx={{
            "& .MuiOutlinedInput-root": {
              color: "white",
              "& fieldset": {
                borderColor: "text.secondary",
                borderWidth: 0.1,
              },
              "&:hover fieldset": {
                borderColor: "text.secondary",
                borderWidth: 0.1,
              },
              "&.Mui-focused fieldset": {
                borderColor: "text.secondary",
                borderWidth: 0.1,
              },
              "&.Mui-error fieldset": {
                borderColor: "error.main",
              },
              "&.Mui-focused.Mui-error fieldset": {
                borderColor: "error.main",
              },
            },
            "& .MuiInputLabel-root": {
              color: "text.secondary",
              "&.Mui-focused": {
                color: "text.secondary",
              },
              "&.Mui-error": {
                color: "error.main",
              },
            },
          }}
        />
        {tradeType === "market" && (
          <FormControlLabel
            id="AMM fallback"
            control={
              <Switch
                checked={publicRouterFallback}
                onChange={(e) => setPublicRouterFallback(e.target.checked)}
                color="primary"
              />
            }
            label={
              <Typography variant="caption" color="text.secondary">
                Fallback to public AMM
              </Typography>
            }
            sx={{ ml: 0 }}
          />
        )}
        <Typography variant="caption" color="text.secondary">
          Available: {side === "buy" ? quoteBalance : mainBalance}
          {side === "buy"
            ? ` ${quoteToken?.symbol}`
            : ` ${mainToken?.symbol}`}{" "}
          | Fee: {fee.toFixed(2)} {quoteToken?.symbol}
        </Typography>
      </Stack>

      <Button
        variant="contained"
        color={
          tradeStatus === "ERROR"
            ? "warning"
            : side === "buy"
              ? "success"
              : "error"
        }
        fullWidth
        sx={{ py: 1.5, fontWeight: 700 }}
        disabled={tradeStatus !== "OPEN" || price == 0 || amount == 0}
        onClick={async () =>
          await createOrder(
            side,
            price,
            amount,
            chartPair.symbol,
            mainToken,
            quoteToken,
            tradeType
          )
        }
      >
        {(tradeStatus === "LOADING" || tradeStatus === "PROOF_GEN") && (
          <CircularProgress
            size={20}
            sx={{
              color: "white",
            }}
          />
        )}

        {tradeStatus === "OPEN" &&
          `${side === "buy" ? "Buy" : "Sell"} ${mainToken?.symbol}`}
        {tradeStatus === "LOADING" && "Submitting..."}
        {tradeStatus === "PROOF_GEN" && "  Generating Proof..."}
        {tradeStatus === "ORDER_OPEN" && "Order Created ✅"}
        {tradeStatus === "ERROR" && "Order Failed ❌"}
      </Button>
      <Snackbar
        open={toast.open}
        autoHideDuration={2500}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleClose}
          severity={toast.type}
          variant="filled"
          sx={{
            width: "100%",
            fontWeight: 600,
            fontSize: "1rem",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          {toast.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
