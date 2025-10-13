import { Box, Typography, Stack, Collapse, Avatar } from "@mui/material";
import { InfoBox } from "../../../utils/reusable.jsx";
import { getContext } from "../../../utils/context.jsx";
import PortfolioDistribution from "./PortfolioDistribution.jsx";
import { ExpandableTitle } from "../../../utils/reusable.jsx";
import { useState, useEffect } from "react";

const a = 3000;
const x = a;
const y = a;
const z = a;
export default function Balance() {
  const { tokens, walletConnected } = getContext();

  const totalBalance = tokens.reduce((acc, t) => acc + t.amount, 0);
  const mainToken = tokens[0];
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
    <Box>
      <ExpandableTitle
        title="My Balance"
        initiallyExpanded={true}
        onToggle={(expanded) => setVisible(expanded)}
      />
      {visible && (
        <Collapse in={reveal} timeout={a}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{}}>
            {/* Total Balance */}

            <InfoBox>
              {/* <Collapse in={reveal} timeout={x}> */}

              <Typography
                variant="subtitle2"
                sx={{ color: "text.secondary", mb: 0.5 }}
              >
                Total Balance
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                $ {totalBalance.toFixed(2)}
              </Typography>
              {/* </Collapse> */}
            </InfoBox>

            {/* Main Token Balance */}

            <InfoBox>
              {/* <Collapse in={reveal} timeout={y}> */}

              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mt: 1, mb: 2 }}
              >
                <Avatar
                  sx={{
                    bgcolor: mainToken.color,
                    width: 24,
                    height: 24,
                    fontSize: 18,
                  }}
                >
                  {mainToken.symbol[0]}
                </Avatar>
                <Typography
                  variant="subtitle2"
                  sx={{ color: "text.secondary", mb: 0.5 }}
                >
                  {mainToken.symbol} Balance
                </Typography>
              </Stack>
              <Box sx={{ display: "flex", flexDirection: "column", ml: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {(mainToken.amount * mainToken.price).toFixed(2)} USD
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 500, color: "text.secondary" }}
                >
                  {mainToken.amount.toFixed(2)} {mainToken.symbol}
                </Typography>
              </Box>
              {/* </Collapse> */}
            </InfoBox>

            {/* <Collapse in={reveal} timeout={z}> */}

            <PortfolioDistribution tokens={tokens} />
            {/* </Collapse> */}
          </Stack>
        </Collapse>
      )}
    </Box>
  );
}
