import { Box, Typography, Stack, Button, Collapse } from "@mui/material";
import { useState, useEffect } from "react";
import { useMyContext } from "../../utils/context.jsx";
import { ExpandableTitle } from "../../utils/reusable.jsx";
import { useTokens } from "../../../../liveData/Tokens.jsx";
import PortfolioDistribution from "./PortfolioDistribution.jsx";
import { TokenBalance, Actions } from "./utils.jsx";

const style = 2;

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
      <Box
        sx={{ height: 550, width: visible ? (style == 1 ? 320 : 300) : 180 }}
      >
        <Box
          sx={{
            border: 1,
            borderColor: "divider",
            height: visible ? 550 : 220,
            p: 2,
            borderRadius: 2,
            bgcolor: "background.paper",
            boxShadow: 3,
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <ExpandableTitle
            TitleBox={
              <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
                My Balance
              </Typography>
            }
            initiallyExpanded={true}
            onToggle={(expanded) => setVisible(expanded)}
          />

          {visible ? (
            <Collapse in={reveal} timeout={300}>
              <Stack
                px={style == 1 ? 2 : 0}
                display="flex"
                gap={2}
                justifyContent="space-between"
                sx={{
                  height: 417,
                }}
              >
                <Box sx={{ pl: style == 1 ? 1 : 0 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Balance
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    ${totalBalance.toFixed(2)}
                  </Typography>
                </Box>
                <Stack spacing={0.5}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Balance Per Token :
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={3}
                    justifyContent="space-between"
                  >
                    <TokenBalance
                      style={style}
                      token={mainToken}
                      balance={balance}
                    />
                    <TokenBalance
                      style={style}
                      token={secondToken}
                      balance={balance}
                    />
                  </Stack>
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
