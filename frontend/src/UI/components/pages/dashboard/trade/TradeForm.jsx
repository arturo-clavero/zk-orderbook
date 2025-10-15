import { Box, Typography, Stack, TextField, Button, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useState } from "react";
import { useMyContext } from "../../../utils/context.jsx";

export default function TradeForm() {
  const { chartPair, tokens } = useMyContext();
  const mainToken = chartPair?.token1;
  const quoteToken = chartPair?.token2;

  const [tradeType, setTradeType] = useState("spot"); // could be spot/market
  const [side, setSide] = useState("buy"); // buy/sell
  const [price, setPrice] = useState(0);
  const [amount, setAmount] = useState(0);

  const handleTradeType = (event, newType) => {
    if (newType) setTradeType(newType);
  };

  const handleSide = (newSide) => {
    setSide(newSide);
  };

  const availableBalance = mainToken?.amount || 0;
  const total = price * amount;
  const fee = total * 0.001; // example 0.1% fee

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: "background.paper",
        boxShadow: 3,
        minWidth: 300,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {/* Header: Pair Info */}
      <Box>
        <Typography variant="subtitle2" color="text.secondary">
          Trading Pair
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {chartPair ? `${mainToken.symbol} / ${quoteToken.symbol}` : "Select Pair"}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Last Price: ${price.toFixed(2) || 0} | 24h High: $0 | 24h Low: $0 | Volume: 0
        </Typography>
      </Box>

      {/* Trade Type */}
      <ToggleButtonGroup
        value={tradeType}
        exclusive
        onChange={handleTradeType}
        size="small"
        sx={{ mb: 1 }}
      >
        <ToggleButton value="spot">Spot</ToggleButton>
        <ToggleButton value="market">Market</ToggleButton>
      </ToggleButtonGroup>

      {/* Buy/Sell Switch */}
      <Stack direction="row" spacing={1}>
        <Button
          variant={side === "buy" ? "contained" : "outlined"}
          color="success"
          fullWidth
          onClick={() => handleSide("buy")}
        >
          Buy
        </Button>
        <Button
          variant={side === "sell" ? "contained" : "outlined"}
          color="error"
          fullWidth
          onClick={() => handleSide("sell")}
        >
          Sell
        </Button>
      </Stack>

      {/* Price & Amount */}
      <Stack spacing={1}>
        <TextField
          label={`Price (${quoteToken?.symbol})`}
          size="small"
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />
        <TextField
          label={`Amount (${mainToken?.symbol})`}
          size="small"
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        <TextField
          label={`Total (${quoteToken?.symbol})`}
          size="small"
          value={total.toFixed(2)}
          InputProps={{ readOnly: true }}
        />
      </Stack>

      {/* Info / Fees */}
      <Typography variant="caption" color="text.secondary">
        Available: {availableBalance} {mainToken?.symbol} | Fee: {fee.toFixed(2)} {quoteToken?.symbol}
      </Typography>

      {/* Execute Trade */}
      <Button
        variant="contained"
        color={side === "buy" ? "success" : "error"}
        fullWidth
        sx={{ py: 1.5, fontWeight: 700 }}
      >
        {side === "buy" ? "Buy" : "Sell"} {mainToken?.symbol}
      </Button>
    </Box>
  );
}
