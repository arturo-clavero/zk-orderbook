import { Box, Typography, Stack, Collapse, Avatar, Button } from "@mui/material";
import { InfoBox, ButtonLight } from "../../../utils/reusable.jsx";
import { useMyContext } from "../../../utils/context.jsx";
import PortfolioDistribution from "./PortfolioDistribution.jsx";
import { ExpandableTitle } from "../../../utils/reusable.jsx";
import { useState, useEffect } from "react";
import deposit from "../../../../../actions/deposit.js";
import withdraw from "../../../../../actions/withdraw.js";

const a = 3000;
const x = a;
const y = a;
const z = a;

function TokenBalance({ token }) {
  return (
    <Stack direction="column">
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{ mt: 1, mb: 2 }}
      >
        <Avatar
          sx={{
            bgcolor: token.color,
            width: 20,
            height: 20,
            fontSize: 18,
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
          {(token.amount * token.price).toFixed(2)} USD
        </Typography>
        <Typography
          variant="caption"
          sx={{ fontWeight: 500, color: "text.secondary" }}
        >
          {token.amount.toFixed(2)} {token.symbol}
        </Typography>
      </Box>
      {/* </Collapse> */}
    </Stack>
  );
}

function Actions() {
  return (
    <Stack direction="row" spacing={3} sx={{ mt: 1 }}>
      <ButtonLight title="Deposit" size="small" onClick={()=> deposit()} />
        {/* Deposit
      </ButtonLight> */}
      <ButtonLight title="Withdraw" size="small" onClick={()=>withdraw()}/>
        {/* Withdraw
      </ButtonLight> */}
    </Stack>
  );
}

export default function Balance() {
  const { tokens, walletConnected } = useMyContext();

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
    <Box sx={{mb: 10, flexShrink: 1}}>
      <ExpandableTitle
        title="My Balance"
        initiallyExpanded={true}
        onToggle={(expanded) => setVisible(expanded)}
      />
      {visible && (
        <Collapse in={reveal} timeout={a}>
          {" "}
          <Stack direction={{ xs: "row", sm: "column" }} 
          spacing={3}
 
           >
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
            {/* </InfoBox> */}
            {/* <InfoBox spacing={2}> */}
              <Stack direction="row" spacing={3}>
              <TokenBalance token={mainToken} />
              <TokenBalance token={mainToken} />
              </Stack>
              <Actions/>
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