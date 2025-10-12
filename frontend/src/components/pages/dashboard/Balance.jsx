import { Box, Typography, Stack, Avatar, LinearProgress, Tooltip } from "@mui/material";

const tokens = [
  { symbol: "ETH", amount: 3.5, color: "#627EEA" },
  { symbol: "USDC", amount: 1200, color: "#2775CA" },
  { symbol: "WBTC", amount: 0.25, color: "#F7931A" },
  { symbol: "DAI", amount: 500, color: "#F5AC37" },
];

export default function Balance() {
  const totalBalance = tokens.reduce((acc, t) => acc + t.amount, 0);

  return (
    <Box
      sx={{
        mt: 2,
        p: 3,
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
        bgcolor: "background.paper",
        boxShadow: 2,
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
        Total Balance: {totalBalance.toFixed(2)}
      </Typography>

      <Stack spacing={2}>
        {tokens.map((token, idx) => {
          const percentage = (token.amount / totalBalance) * 100;
          return (
            <Tooltip
              key={idx}
              title={`${token.amount} ${token.symbol} (${percentage.toFixed(1)}%)`}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  sx={{ bgcolor: token.color, width: 24, height: 24 }}
                >
                  {token.symbol[0]}
                </Avatar>

                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {token.symbol}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={percentage}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: "grey.300",
                      "& .MuiLinearProgress-bar": {
                        bgcolor: token.color,
                      },
                    }}
                  />
                </Box>

                <Typography variant="body2" sx={{ minWidth: 60, textAlign: "right" }}>
                  {token.amount}
                </Typography>
              </Box>
            </Tooltip>
          );
        })}
      </Stack>
    </Box>
  );
}
