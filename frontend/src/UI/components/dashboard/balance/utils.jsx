import { Box, Typography, Stack, Button, Avatar } from "@mui/material";
import { useState } from "react";
import ModalDepositWithdraw from "./ModalDepositWithdraw.jsx";

export function TokenBalance({ token, balance, style }) {
  const price =
    balance[token.symbol] == 0 || token.twap1min == 0
      ? 0
      : balance[token.symbol] * token.twap1min;

  return (
    <Stack
      sx={{ px: style == 1 ? 1 : 0 }}
      spacing={1}
      alignItems="start"
      minWidth={100}
    >
      <Stack direction="row" spacing={1}>
        <Avatar
          src={token.icon}
          alt={token.symbol}
          sx={{
            bgcolor: token.color || "primary.main",
            width: 24,
            height: 24,
            fontSize: 12,
          }}
        >
          {token.symbol[0]}
        </Avatar>
        <Typography variant="subtitle2" color="text.secondary">
          {token.symbol}
        </Typography>
      </Stack>
      <Box sx={{ pl: style == 1 ? 2 : 0 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          ${price.toFixed(2)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {balance[token.symbol].toFixed(2)} {token.symbol}
        </Typography>
      </Box>
    </Stack>
  );
}

export function Actions({ direction = "column" }) {
  const [modalDepositOpen, setModalDepositOpen] = useState(false);
  const [modalWithdrawOpen, setModalWithdrawOpen] = useState(false);

  const spacing = direction == "row" ? 1.5 : 3;
  return (
    <Stack
      direction={direction}
      spacing={spacing}
      justifyItems="space-between"
      alignItems="center"
      py={1.5}
    >
      <Button
        variant={"outlined"}
        color="success"
        fullWidth
        onClick={() => setModalDepositOpen(true)}
      >
        DEPOSIT
      </Button>
      <ModalDepositWithdraw
        open={modalDepositOpen}
        close={() => setModalDepositOpen(false)}
      />
      <Button
        variant={"outlined"}
        color={"info.main"}
        sx={{
          color: "info.main",
          borderColor: "info.main",
          "&:hover": {
            backgroundColor: "rgba(30, 144, 255, 0.1)",
            borderColor: "info.main",
          },
        }}
        fullWidth
        onClick={() => setModalWithdrawOpen(true)}
      >
        WITHDRAW
      </Button>{" "}
      <ModalDepositWithdraw
        open={modalWithdrawOpen}
        close={() => setModalWithdrawOpen(false)}
        type="withdraw"
      />
    </Stack>
  );
}
