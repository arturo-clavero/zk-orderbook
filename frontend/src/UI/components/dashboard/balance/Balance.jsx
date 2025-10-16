import {
  Box,
  Typography,
  Stack,
  Button,
  Avatar,
  Collapse,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useMyContext } from "../../utils/context.jsx";
import { ExpandableTitle } from "../../utils/reusable.jsx";
import ModalDepositWithdraw from "./ModalDepositWithdraw.jsx";
import { useTokens } from "../../../../liveData/Tokens.jsx";
import PortfolioDistribution from "./PortfolioDistribution.jsx";
function TokenBalance({ token, balance }) {
  const price =
    balance[token.symbol] == 0 || token.twap1min == 0
      ? 0
      : balance[token.symbol] * token.twap1min;

  return (
    <Stack sx={{ px: 1 }} spacing={1} alignItems="start" minWidth={100}>
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
      <Box sx={{ ml: 1, pl: 2 }}>
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

function Actions({ direction = "row" }) {
  const [modalDepositOpen, setModalDepositOpen] = useState(false);
  const [modalWithdrawOpen, setModalWithdrawOpen] = useState(false);

  const spacing = direction == "row" ? 1.5 : 3;
  return (
    <Stack
      direction={direction}
      spacing={spacing}
      justifyItems="space-between"
      alignItems="center"
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

export default function Balance() {
  const { walletConnected, chartPair, switched, balance } = useMyContext();
  const { tokens } = useTokens();

  const totalBalance = Object.values(tokens).reduce(
    (acc, t) => acc + balance[t.symbol] * t.twap1min,
    0
  );

  const mainToken = chartPair
    ? !switched
      ? chartPair.token1
      : chartPair.token2
    : tokens["ETH"];
  const secondToken = chartPair
    ? !switched
      ? chartPair.token2
      : chartPair.token1
    : tokens["PYUSD"];

  const [visible, setVisible] = useState(true);
  const [reveal, setReveal] = useState(false);

  useEffect(() => {
    if (walletConnected) {
      const timer = setTimeout(() => setReveal(true), 100);
      return () => clearTimeout(timer);
    } else {
      setReveal(false);
    }
  }, [walletConnected]);

  if (!walletConnected) return null;

  return (
    <>
      <Box sx={{ height: 500 }}>
        <Box
          sx={{
            height: visible ? 500 : 220,
            p: 2,
            borderRadius: 2,
            bgcolor: "background.paper",
            boxShadow: 3,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <ExpandableTitle
            title="My Balance"
            initiallyExpanded={true}
            onToggle={(expanded) => setVisible(expanded)}
          />

          {visible ? (
            <Collapse in={reveal} timeout={300}>
              <Stack
                px={2}
                justifyContent="space-between"
                sx={{
                  height: 417,
                }}
              >
                <Box sx={{ pl: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Balance
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    ${totalBalance.toFixed(2)}
                  </Typography>
                </Box>

                <Stack
                  direction="row"
                  spacing={3}
                  justifyContent="space-between"
                >
                  <TokenBalance token={mainToken} balance={balance} />
                  <TokenBalance token={secondToken} balance={balance} />
                </Stack>

                <Actions />
                <PortfolioDistribution
                  totalBalance={totalBalance}
                  tokens={tokens}
                  balance={balance}
                />
              </Stack>
            </Collapse>
          ) : (
            <>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: 500,
                  gap: 2,
                  p: 2,
                  borderRadius: 2,
                }}
              >
                <Actions direction="column" />
              </Box>
            </>
          )}
        </Box>
        {!visible && <Box bgcolor="orange" sx={{ flex: 1 }}></Box>}
      </Box>
    </>
  );
}
