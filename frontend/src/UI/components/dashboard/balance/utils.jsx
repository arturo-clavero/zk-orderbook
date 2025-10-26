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
      spacing={0.5}
      alignItems="start"
      minWidth={100}
    >
      <Stack direction="row" spacing={1}>
        <Avatar
          src={token.icon}
          alt={token.symbol}
          sx={{
            bgcolor: token.color || "primary.main",
            width: 20,
            height: 20,
            fontSize: 12,
          }}
        >
          {token.symbol[0]}
        </Avatar>
        <Typography variant="subtitle2" color="text.primary" fontWeight={600}>
          {token.symbol}
        </Typography>
      </Stack>
      <Box sx={{ pl: style == 1 ? 2 : 0.75 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {`$ ${price.toFixed(2)}`}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {balance[token.symbol].toFixed(2)} {token.symbol}
        </Typography>
      </Box>
    </Stack>
  );
}

export function Actions({ direction = "column" }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("deposit");

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
        onClick={() => {setModalOpen(true); setModalType("deposit")}}
      >
        DEPOSIT
      </Button>
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
        onClick={() => {setModalOpen(true); setModalType("withdraw")}}
      >
        WITHDRAW
      </Button>{" "}
      <ModalDepositWithdraw
        open={modalOpen}
        close={() => setModalOpen(false)}
        type={modalType}
        setType={setModalType}
      />
    </Stack>
  );
}
