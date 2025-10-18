import {
  Box,
  Typography,
  Stack,
  Avatar,
  Chip,
  Divider,
  Tooltip,
  IconButton,
} from "@mui/material";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import { useTokens } from "../../../../liveData/Tokens";

const orders = [
  {
    pair: "ETH/PYUSD",
    side: "Buy",
    type: "Spot",
    amount: 1.2,
    remaining: 0.6,
    price: 1750,
    status: "Partially Filled",
    icon: "/assets/eth.png",
  },
  {
    pair: "ETH/PYUSD",
    side: "Sell",
    type: "Market",
    amount: 0.1,
    remaining: 0,
    executedPrice: 30150,
    slippage: 0.5,
    status: "Pending",
    icon: "/assets/wbtc.png",
  },
  {
    pair: "ETH/PYUSD",
    side: "Buy",
    type: "Spot",
    amount: 500,
    remaining: 500,
    price: 1,
    status: "Filled",
    icon: "/assets/usdc.png",
  },
];

const formatNumber = (num, decimals = 6) => parseFloat(num.toFixed(decimals));

const flexPair = 1.3;
const flexSide = 0.4;
const flexType = 0.7;
const flexAmount = 1.2;
const flexPrice = 0.8;
const flexAction = 0.2;

export default function Orders() {
  const { tokenPairs } = useTokens();
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
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
        Latest Orders
      </Typography>

      <Stack direction="column" spacing={1}>
        <Stack
          direction="row"
          alignItems="center"
          sx={{
            mb: 0.5,
            px: 2,
            py: 1,
            borderBottom: "1px solid",
            borderColor: "divider",
            fontSize: 14,
            fontWeight: 600,
            color: "text.secondary",
          }}
        >
          <Box sx={{ flex: flexPair }}>Pair</Box>
          <Box sx={{ flex: flexSide }}>Side</Box>
          <Box sx={{ flex: flexType }}>Type</Box>
          <Box sx={{ flex: flexAmount }}>Filled / Amount</Box>
          <Box sx={{ flex: flexPrice }}>Price</Box>
          <Box sx={{ flex: flexAction, textAlign: "center" }}>Actions</Box>
        </Stack>

        {orders.map((order, idx) => {
          const isMarket = order.type === "Market";
          const fillPercent = Math.min(
            ((order.amount - order.remaining) / order.amount) * 100,
            100
          );
          const sideColor =
            order.side === "Buy" ? "success.main" : "error.main";
          const displayPrice = isMarket
            ? `$${formatNumber(order.executedPrice)}`
            : `$${formatNumber(order.price)}`;
          const icon1 = tokenPairs[order.pair].token1.icon;
          const icon2 = tokenPairs[order.pair].token2.icon;

          return (
            <Stack
              key={idx}
              direction="row"
              alignItems="center"
              sx={{
                px: 2,
                py: 1,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                "&:hover": { bgcolor: "action.hover" },
              }}
            >
              <Box
                sx={{
                  gap: 1,
                  flex: flexPair,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Stack direction="row" sx={{ alignItems: "center" }}>
                  {" "}
                  <Avatar
                    src={icon1}
                    sx={{
                      width: 28,
                      height: 28,
                      boxShadow: "10px 2px 20px rgba(0, 0, 0, 0.6)",
                      zIndex: 2,
                    }}
                  />{" "}
                  <Avatar
                    src={icon2}
                    sx={{ width: 28, height: 28, marginLeft: -0.8, zIndex: 1 }}
                  />{" "}
                </Stack>
                <Typography sx={{ fontWeight: 500, fontSize: 14, ml: 1 }}>
                  {tokenPairs[order.pair].token1.symbol} /{" "}
                  {tokenPairs[order.pair].token2.symbol}
                </Typography>
              </Box>

              <Box
                sx={{
                  flex: flexSide,
                  color: sideColor,
                  fontWeight: 500,
                  fontSize: 14,
                }}
              >
                {order.side}
              </Box>

              <Box sx={{ flex: flexType }}>
                <Chip
                  label={order.type}
                  color={order.type === "Market" ? "default" : "secondary"}
                  size="small"
                  sx={{
                    fontWeight: 600,
                    fontSize: 13,
                    height: 22,
                    maxWidth: 100,
                  }}
                />
              </Box>

              <Box
                sx={{
                  flex: flexAmount,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box sx={{ width: 28, height: 28 }}>
                  <CircularProgressbar
                    value={fillPercent}
                    strokeWidth={25}
                    text={""}
                    styles={buildStyles({
                      pathTransitionDuration: 0.5,
                      strokeLinecap: "butt",
                      pathColor: "url(#gradientColor)",
                      trailColor: "#222",
                    })}
                  />
                  <svg style={{ height: 0 }}>
                    <defs>
                      <linearGradient
                        id="gradientColor"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="#00c6ff" />
                        <stop offset="100%" stopColor="#0072ff" />
                      </linearGradient>
                    </defs>
                  </svg>
                </Box>
                <Tooltip
                  title={`${formatNumber(order.amount - order.remaining)} / ${formatNumber(order.amount)}`}
                >
                  <Typography sx={{ fontSize: 14, fontWeight: 400 }}>
                    {formatNumber(order.amount - order.remaining)} /{" "}
                    {formatNumber(order.amount)}
                  </Typography>
                </Tooltip>
              </Box>

              <Box sx={{ flex: flexPrice }}>
                <Tooltip title={isMarket ? `Slippage: ${order.slippage}%` : ""}>
                  <Typography sx={{ fontWeight: 500, fontSize: 14 }}>
                    {displayPrice}
                  </Typography>
                </Tooltip>
              </Box>

              <Box
                sx={{
                  flex: flexAction,
                  display: "flex",
                  justifyContent: "center",
                  gap: 1,
                }}
              >
                <Tooltip title="View Order">
                  <IconButton
                    size="small"
                    sx={{
                      bgcolor: "background.paper",
                      boxShadow: `0 0 6px 1px #4ca0afff`,
                      "&:hover": {
                        bgcolor: "background.paper",
                        boxShadow: `0 0 8px 4px #5dc2d4ff`,
                      },
                    }}
                  >
                    <VisibilityIcon
                      fontSize="small"
                      sx={{ color: "#78dbd3ff" }}
                    />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Cancel Order">
                  <IconButton
                    size="small"
                    disabled={order.status === "Filled"}
                    sx={{
                      bgcolor: "background.paper",
                      boxShadow: `0 0 6px 1px #f44336`,
                      "&:hover": {
                        bgcolor: "background.paper",
                        boxShadow: `0 0 8px 4px #f44336`,
                      },
                    }}
                  >
                    <CloseIcon fontSize="small" sx={{ color: "#e78a83ff" }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Stack>
          );
        })}
      </Stack>
    </Box>
  );
}
