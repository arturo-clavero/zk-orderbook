import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  TextField,
  MenuItem,
  Avatar,
} from "@mui/material";
import { useTokens } from "../../../../liveData/Tokens.jsx";
import deposit from "../../../../actions/deposit.js";
import withdraw from "../../../../actions/withdraw.js";
import { useMyContext } from "../../utils/context.jsx";

export default function ModalDepositWithdraw({
  open,
  close,
  type = "deposit",
}) {
  const { tokens } = useTokens();
  const { chartPair, switched } = useMyContext();

  const currToken =
    chartPair && switched === false
      ? chartPair.token1
      : chartPair
        ? chartPair.token2
        : Object.values(tokens)[0];

  const [selectedToken, setSelectedToken] = useState(currToken?.symbol || "");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    setSelectedToken(currToken?.symbol || "");
  }, [currToken]);

  const onClose = () => {
    close();

    setAmount("");
  };

  const handleConfirm = async () => {
    if (!amount || !selectedToken) return;
    if (type == "deposit") await deposit(selectedToken, parseFloat(amount));
    else await withdraw(selectedToken, parseFloat(amount));

    onClose();
  };

  const available = tokens[selectedToken]?.amount || 0;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            background: "linear-gradient(180deg, #0a0f1c 0%, #111827 100%)",
            borderRadius: "16px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0px 8px 32px rgba(0,0,0,0.6)",
            color: "white",
            p: 2,
          },
        },
      }}
    >
      <DialogTitle
        sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}
      >
        {type === "deposit" ? "Deposit Tokens" : "Withdraw Tokens"}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            select
            id="TokenSelect"
            label="Token"
            value={selectedToken}
            onChange={(e) => setSelectedToken(e.target.value)}
            fullWidth
            sx={{
              "& .MuiInputBase-root": {
                background: "rgba(255,255,255,0.05)",
                borderRadius: "12px",
                color: "white",
              },
              "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.6)" },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255,255,255,0.1)",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255,255,255,0.3)",
              },
            }}
            slotProps={{
              select: {
                renderValue: (selected) => {
                  const token = Object.values(tokens).find(
                    (t) => t.symbol === selected
                  );
                  if (!token) return "";
                  return (
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Avatar src={token.icon} sx={{ width: 20, height: 20 }} />
                      <Typography>{token.symbol}</Typography>
                    </Stack>
                  );
                },
              },
            }}
          >
            {Object.values(tokens).map((t) => (
              <MenuItem
                key={t.symbol}
                value={t.symbol}
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <Avatar src={t.icon} sx={{ width: 20, height: 20 }} />
                <Typography>{t.symbol}</Typography>
              </MenuItem>
            ))}
          </TextField>

          <TextField
            id="SelectAmount"
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => {
              let value = Number(e.target.value);

              if (value < 0) value = 0;

              if (type === "withdraw") {
                const max = tokens[selectedToken]?.amount || 0;
                if (value > max) value = max;
              }

              setAmount(value);
            }}
            fullWidth
            slotProps={{
              htmlInput: {
                min: 0,
                max:
                  type === "withdraw"
                    ? tokens[selectedToken]?.amount || 0
                    : undefined,
              },
            }}
            sx={{
              "& .MuiInputBase-root": {
                background: "rgba(255,255,255,0.05)",
                borderRadius: "12px",
                color: "white",
              },
              "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.6)" },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255,255,255,0.1)",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255,255,255,0.3)",
              },
            }}
          />

          <Typography variant="caption" color="rgba(255,255,255,0.7)">
            Available: {available} {selectedToken}
          </Typography>
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          borderTop: "1px solid rgba(255,255,255,0.1)",
          mt: 2,
          px: 2,
          pb: 2,
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            flex: 1,
            borderColor: "rgba(255,255,255,0.3)",
            color: "rgba(255,255,255,0.7)",
            fontWeight: "bold",
            borderRadius: "12px",
          }}
        >
          Cancel
        </Button>
        <Button
          color="success"
          variant="contained"
          sx={{
            flex: 1,
            background: "linear-gradient(90deg, #2563eb, #4f46e5)",
            borderRadius: "12px",
            fontWeight: "bold",
            "&:hover": {
              background: "linear-gradient(90deg, #1d4ed8, #4338ca)",
            },
          }}
          onClick={handleConfirm}
        >
          {type === "deposit" ? "Deposit" : "Withdraw"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
