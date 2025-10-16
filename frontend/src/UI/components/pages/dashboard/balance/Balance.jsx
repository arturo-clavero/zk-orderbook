import {
  Box,
  Typography,
  Stack,
  Collapse,
  Avatar,
  Button,
} from "@mui/material";
import { InfoBox, ButtonLight } from "../../../utils/reusable.jsx";
import { useMyContext } from "../../../utils/context.jsx";
import PortfolioDistribution from "./PortfolioDistribution.jsx";
import { ExpandableTitle } from "../../../utils/reusable.jsx";
import { useState, useEffect } from "react";
import ModalDepositWithdraw from "./ModalDepositWithdraw.jsx";
import { useTokens } from "../../../../../liveData/Tokens.jsx";
const a = 3000;
const x = a;
const y = a;
const z = a;

function TokenBalance({ token, balance }) {
  const price =
    balance[token.symbol] == 0 || token.twap1min == 0
      ? 0
      : balance[token.symbol] * token.twap1min;
  return (
    <Stack direction="column">
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{ mt: 1, mb: 2 }}
      >
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

        <Typography variant="caption" sx={{ color: "text.secondary", mb: 0.5 }}>
          {token.symbol} Balance
        </Typography>
      </Stack>
      <Box sx={{ display: "flex", flexDirection: "column", ml: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          {price.toFixed(2)} USD
        </Typography>
        <Typography
          variant="caption"
          sx={{ fontWeight: 500, color: "text.secondary" }}
        >
          {balance[token.symbol].toFixed(2)} {token.symbol}
        </Typography>
      </Box>
    </Stack>
  );
}

function Actions() {
  const [modalDepositOpen, setModalDepositOpen] = useState(false);
  const [modalWithdrawOpen, setModalWithdrawOpen] = useState(false);
  return (
    <Stack direction="row" spacing={3} sx={{ mt: 1 }}>
      <ButtonLight
        title="Deposit"
        size="small"
        onClick={() => setModalDepositOpen(true)}
      />
      <ModalDepositWithdraw
        open={modalDepositOpen}
        close={() => setModalDepositOpen(false)}
      />
      <ButtonLight
        title="Withdraw"
        size="small"
        onClick={() => setModalWithdrawOpen(true)}
      />
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
    ? switched == false
      ? chartPair.token1
      : chartPair.token2
    : tokens["ETH"];
  const secondToken = chartPair
    ? switched == false
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
    <Box sx={{ mb: 10, flexShrink: 1 }}>
      <ExpandableTitle
        title="My Balance"
        initiallyExpanded={true}
        onToggle={(expanded) => setVisible(expanded)}
      />
      {visible && (
        <Collapse in={reveal} timeout={a}>
          {" "}
          <Stack direction={{ xs: "row", sm: "column" }} spacing={3}>
            <InfoBox spacing={3}>
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ color: "text.secondary", mb: 0.5 }}
                >
                  Total Balance
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  $ {totalBalance.toFixed(2)}
                </Typography>
              </Box>
              <Stack direction="row" spacing={3}>
                <TokenBalance token={mainToken} balance={balance} />
                <TokenBalance token={secondToken} balance={balance} />
              </Stack>
              <Actions />
            </InfoBox>
            <PortfolioDistribution
              totalBalance={totalBalance}
              tokens={tokens}
              balance={balance}
            />
          </Stack>
        </Collapse>
      )}
    </Box>
  );
}
