import {
  Box,
  Typography,
  Stack,
  Avatar,
  Button,
  Divider,
  Chip,
} from "@mui/material";

// Example orders
const latestOrders = [
  {
    pair: "ETH/USDC",
    type: "Buy",
    amount: 1.2,
    filled: 0.6,
    price: 1750,
    status: "Partially Filled",
    icon: "/assets/eth.png",
  },
  {
    pair: "WBTC/USDC",
    type: "Sell",
    amount: 0.1,
    filled: 0,
    price: 30000,
    status: "Pending",
    icon: "/assets/wbtc.png",
  },
  {
    pair: "USDC/DAI",
    type: "Buy",
    amount: 500,
    filled: 500,
    price: 1,
    status: "Filled",
    icon: "/assets/usdc.png",
  },
];

export default function Orders() {
  return (
    <Box
      sx={{
        p: 3,
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
        bgcolor: "background.paper",
        boxShadow: 2,
      }}
    >
      {/* Section title */}
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
        Latest Orders
      </Typography>

      {/* Header row */}
      <Stack direction="row" spacing={2} sx={{ mb: 1, px: 1 }}>
        <Typography sx={{ flex: 2, fontWeight: 600 }}>Pair</Typography>
        <Typography sx={{ flex: 1, fontWeight: 600 }}>Type</Typography>
        <Typography sx={{ flex: 1, fontWeight: 600 }}>Amount</Typography>
        <Typography sx={{ flex: 1, fontWeight: 600 }}>Filled</Typography>
        <Typography sx={{ flex: 1, fontWeight: 600 }}>Price</Typography>
        <Typography sx={{ flex: 1, fontWeight: 600 }}>Status</Typography>
        <Typography sx={{ flex: 1, fontWeight: 600 }}>Actions</Typography>
      </Stack>
      <Divider sx={{ mb: 1 }} />

      {/* Order rows */}
      {latestOrders.map((order, idx) => (
        <Stack
          key={idx}
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{ mb: 1, px: 1 }}
        >
          {/* Pair */}
          <Stack
            direction="row"
            spacing={1}
            sx={{ flex: 2 }}
            alignItems="center"
          >
            <Avatar src={order.icon} sx={{ width: 24, height: 24 }} />
            <Typography variant="body1">{order.pair}</Typography>
          </Stack>

          {/* Type */}
          <Typography sx={{ flex: 1 }}>{order.type}</Typography>

          {/* Amount */}
          <Typography sx={{ flex: 1 }}>{order.amount}</Typography>

          {/* Filled */}
          <Typography sx={{ flex: 1 }}>{order.filled}</Typography>

          {/* Price */}
          <Typography sx={{ flex: 1 }}>${order.price}</Typography>

          {/* Status */}
          <Chip
            label={order.status}
            color={
              order.status === "Filled"
                ? "success"
                : order.status === "Pending"
                  ? "warning"
                  : "info"
            }
            size="small"
            sx={{ flex: 1 }}
          />

          {/* Actions */}
          <Stack direction="row" spacing={1} sx={{ flex: 1 }}>
            <Button
              variant="outlined"
              size="small"
              disabled={order.status === "Filled"}
            >
              Cancel
            </Button>
            <Button variant="text" size="small">
              View
            </Button>
          </Stack>
        </Stack>
      ))}
    </Box>
  );
}
