import { Box, Typography, Stack, LinearProgress, Avatar } from "@mui/material";
import { InfoBox } from "../../utils/reusable.jsx";
import { getContext } from "../../utils/context.jsx";
import PortfolioDistribution from "./PortfolioDistribution.jsx";
export default function Balance() {
  const { tokens } = getContext();

  const totalBalance = tokens.reduce((acc, t) => acc + t.amount, 0);
  const mainToken = tokens[0];

  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 3 }}>
      {/* Total Balance */}
      <InfoBox>
        <Typography
          variant="subtitle2"
          sx={{ color: "text.secondary", mb: 0.5 }}
        >
          Total Balance
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          $ {totalBalance.toFixed(2)}
        </Typography>
      </InfoBox>

      {/* Main Token Balance */}
      <InfoBox>
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
      </InfoBox>

      {/* Portfolio Distribution */}
      <PortfolioDistribution tokens={tokens} />
    </Stack>
  );
}
