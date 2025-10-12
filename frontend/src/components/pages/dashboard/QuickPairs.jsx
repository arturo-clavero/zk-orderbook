import { Box, Typography, Stack, Avatar, Button, Divider } from "@mui/material";

const pairs = [
  {
    symbol: "ETH",
    name: "Ethereum",
    icon: "/assets/ETH.png",
    price: 1750,
    available: 3.5,
    inOrders: 1.2,
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    icon: "/assets/USDC.png",
    price: 1,
    available: 1200,
    inOrders: 300,
  },
  {
    symbol: "WBTC",
    name: "Wrapped BTC",
    icon: "/assets/WBTC.png",
    price: 30000,
    available: 0.25,
    inOrders: 0.1,
  },
];

export default function QuickPairs() {
  return (
    <Box sx={{ mt:6, p: 3, border: 1, borderColor: "divider", borderRadius: 2, bgcolor: "background.paper", boxShadow: 2 }}>
      
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
        Quick Pairs
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 1, px: 1 }}>
        <Typography sx={{ flex: 2, fontWeight: 600 }}>Token</Typography>
        <Typography sx={{ flex: 1, fontWeight: 600 }}>Price</Typography>
        <Typography sx={{ flex: 1, fontWeight: 600 }}>Available</Typography>
        <Typography sx={{ flex: 1, fontWeight: 600 }}>In Orders</Typography>
        <Typography sx={{ flex: 3, fontWeight: 600 }}>Actions</Typography>
      </Stack>
      <Divider sx={{ mb: 1 }} />

      {pairs.map((pair, idx) => (
        <Stack
          key={idx}
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{ mb: 1, px: 1 }}
        >
          <Stack direction="row" spacing={1} sx={{ flex: 2 }} alignItems="center">
            <Avatar src={pair.icon} sx={{ width: 24, height: 24 }} />
            <Typography variant="body1">{pair.symbol}</Typography>
          </Stack>

          <Typography sx={{ flex: 1 }}>${pair.price}</Typography>

          <Typography sx={{ flex: 1 }}>{pair.available}</Typography>

          <Typography sx={{ flex: 1 }}>{pair.inOrders}</Typography>

          <Stack direction="row" spacing={1} sx={{ flex: 3 }}>
            <Button variant="outlined" size="small">Deposit</Button>
            <Button variant="contained" size="small" color="primary">Trade</Button>
            <Button variant="outlined" size="small" color="secondary">Withdraw</Button>
          </Stack>
        </Stack>
      ))}
    </Box>
  );
}
