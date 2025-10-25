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
  CircularProgress,
} from "@mui/material";
import { useTokens } from "../../../../liveData/Tokens.jsx";
import { useMyContext } from "../../utils/context.jsx";
import { textFieldBase } from "../trade/styles.js";
import { clickableStyle } from "../trade/TradeDetails.jsx";
import useDeposit from "../../../../actions/deposit.js";
import useWithdraw from "../../../../actions/withdraw.js";
import { handleNumeric } from "../../utils/reusable.jsx";
import { format } from "../../utils/math.jsx";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";

export default function ModalDepositWithdraw({
  open,
  close,
  _type = "deposit",
}) {
  const { tokens } = useTokens();
  const { chartPair, switched, balance, dwStatus, setToast, walletAddress } =
    useMyContext();
  const currToken = switched === false ? chartPair.token1 : chartPair.token2;
  const [type, setType] = useState(_type);
  const [selectedToken, setSelectedToken] = useState(currToken?.symbol || "");
  const [amount, setAmount] = useState(0);

  const invalidAmount = type == "withdraw" && amount > balance[selectedToken];
  useEffect(() => {
    setSelectedToken(currToken?.symbol || "");
  }, [currToken]);

  const onClose = () => {
    close();
    setAmount(0);
  };

  const handleConfirm = type == "deposit" ? useDeposit() : useWithdraw();

  const available = balance[selectedToken] || 0;
  const loading = [
    "LOADING",
    "SIGN",
    "PROOF_GEN",
    "OPEN_METAMASK",
    "VERIFY_TX",
  ].includes(dwStatus);

  useEffect(() => {
    if (dwStatus === "SUCCESS")
      setToast({
        open: true,
        type: "success",
        msg: `${type} created successfully!`,
      });
    else if (dwStatus === "ERROR")
      setToast({
        open: true,
        type: "error",
        msg: `❌ $(type) failed. Please try again.`,
      });
  }, [dwStatus]);

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (dwStatus !== "OPEN") return;
        onClose();
      }}
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
        <Button
          variant="contained"
          size="small"
          disabled={dwStatus != "OPEN"}
          onClick={() => setType(type == "deposit" ? "withdraw" : "deposit")}
          sx={{
            ml: 2,
            minWidth: "2px",
            borderRadius: 2,
            bgcolor: "rgba(255,255,255,0)",
            "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
          }}
        >
          <SwapHorizIcon />
        </Button>
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
            error={invalidAmount}
            helperText={invalidAmount ? "Insufficient Balance" : ""}
            onChange={(e) => {
              const val = e.target.value;
              handleNumeric(val === "" ? 0 : val, setAmount);
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
            sx={textFieldBase}
          />
          <Typography variant="caption" color="rgba(255,255,255,0.7)">
            Balance: {available} {selectedToken}{" "}
            {type === "withdraw" && (
              <>
                {" | "}
                <Typography
                  component="span"
                  variant="caption"
                  sx={clickableStyle}
                  onClick={() => setAmount(balance[selectedToken])}
                >
                  SET MAX{" "}
                </Typography>
              </>
            )}
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
        {dwStatus == "OPEN" && (
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
        )}

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
            "&.Mui-disabled": {
              background: "text.secondary",
              color: "#f3f4f6",
              cursor: "not-allowed",
              backgroundImage: "none",
            },
          }}
          onClick={async () =>
            await handleConfirm(type, amount, selectedToken, walletAddress)
          }
          disabled={invalidAmount || amount == 0 || dwStatus != "OPEN"}
        >
          {/* {type === "deposit" ? "Deposit" : "Withdraw"} */}
          {loading && (
            <CircularProgress size={20} sx={{ color: "white", mr: 1 }} />
          )}
          {dwStatus === "OPEN" &&
            `${type === "deposit" ? "Deposit" : "Withdraw"}`}
          {dwStatus === "LOADING" && "Submitting..."}
          {dwStatus === "PROOF_GEN" && "Generating Proof..."}

          {dwStatus === "SIGN" && "Sign Order..."}
          {dwStatus === "OPEN_METAMASK" && "Open MetaMask..."}

          {dwStatus === "VERIFY_TX" && `Verifying ${type} ...`}
          {dwStatus === "SUCCESS" && "sucess"}

          {dwStatus === "ERROR" && "Order Failed ❌"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
