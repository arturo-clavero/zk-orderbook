import {
  Box,
  Typography,
  Stack,
  Avatar,
  IconButton,
  Divider,
} from "@mui/material";
import { useTokens } from "../../../../../liveData/Tokens.jsx";
import { ButtonLight, ExpandableTitle } from "../../../utils/reusable.jsx";
import { SwapHorizRounded } from "@mui/icons-material";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { useState } from "react";
import { getContext } from "../../../utils/context.jsx";

const titleFontSize = 12;
const titleFontWeight = 500;

export default function QuickPairs() {
  const { tokens, tokenPairs } = useTokens();
  const [visible, setVisible] = useState(true);
  const { walletConnected } = getContext();

  return (
    <Box>
      {/* <ExpandableTitle
        title="Quick Pairs"
        initiallyExpanded={true}
        onToggle={(expanded) => setVisible(expanded)}
        visible={walletConnected}
      > */}
      {visible && (
        <Box
          sx={{
            width: "100%",
            py: 2,
            px: 3,
            border: 1,
            borderColor: "divider",
            borderRadius: 2,
            bgcolor: "background.paper",
            boxShadow: 2,
          }}
        >
          <Stack direction="row" spacing={1} sx={{ px: 1 }}>
            <Typography
              sx={{
                flex: 2,
                fontWeight: titleFontWeight,
                fontSize: titleFontSize,
              }}
            >
              Pair
            </Typography>
            <Typography
              sx={{
                flex: 1,
                fontWeight: titleFontWeight,
                fontSize: titleFontSize,
              }}
            >
              Price
            </Typography>
            <Typography
              sx={{
                flex: 1,
                fontWeight: titleFontWeight,
                fontSize: titleFontSize,
              }}
            >
              24H Change (%)
            </Typography>
            <Typography
              sx={{
                flex: 1,
                fontWeight: titleFontWeight,
                fontSize: titleFontSize,
              }}
            >
              Spread
            </Typography>
            <Typography
              sx={{
                flex: 1,
                fontWeight: titleFontWeight,
                fontSize: titleFontSize,
              }}
            >
              Liquidity
            </Typography>
            <Typography
              sx={{
                flex: 1,
                fontWeight: titleFontWeight,
                fontSize: titleFontSize,
              }}
            >
              24H Volume
            </Typography>
            <Typography
              sx={{
                flex: 1,
                fontWeight: titleFontWeight,
                fontSize: titleFontSize,
              }}
            >
              Volatility
            </Typography>
            <Typography
              sx={{
                flex: 1,
                fontWeight: titleFontWeight,
                fontSize: titleFontSize,
              }}
            >
              Health Score
            </Typography>
          </Stack>
          <Divider sx={{ mb: 3 }} />

          {Object.entries(tokenPairs).map(([key, pair], idx) => {
            const token1 = pair.token1;
            const token2 = pair.token2;
            const price = pair.price.toFixed(4);
            const priceChange = 0;
            // const priceChange = pair.price > 0 ? `+${pair.price}%` : `${pair.price}%` ;
            const spread = 0;
            const liquidity = `0%`;
            const volume = 0;
            const volatility = 0;
            const healthScore = 40;
            // const healthScore = 100 - (spread -> {0.5 to max}  -> {0- 25}) - (volume -> {0 - 1M} -> {25 -> 0})
            return (
              <Stack
                key={idx}
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ mb: 2, px: 1 }}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ flex: 2 }}
                  alignItems="center"
                >
                  <Avatar
                    src={token1.icon || "/assets/default.png"}
                    sx={{ width: 24, height: 24 }}
                  />
                  <Typography variant="body1">
                    {token1.symbol} / {token2.symbol}
                  </Typography>
                </Stack>

                <Typography sx={{ flex: 1 }}>
                  {price ? `${price}` : "N/A"}
                </Typography>

                <Typography
                  sx={{ flex: 1, color: priceChange > 0 ? "green" : "red" }}
                >
                  {priceChange ? `${priceChange}` : "N/A"}
                </Typography>
                <Typography sx={{ flex: 1 }}>
                  {spread ? `${spread}` : "N/A"}
                </Typography>
                <Typography sx={{ flex: 1 }}>
                  {liquidity ? `${liquidity}` : "N/A"}
                </Typography>
                <Typography sx={{ flex: 1 }}>
                  {volume ? `${volume}` : "N/A"}
                </Typography>
                <Typography sx={{ flex: 1 }}>
                  {volatility ? `${volatility}` : "N/A"}
                </Typography>
                <Typography
                  sx={{
                    flex: 1,
                    color:
                      healthScore > 85
                        ? "green"
                        : healthScore > 65
                          ? "orange"
                          : healthScore > 50
                            ? "yellow"
                            : "red",
                  }}
                >
                  {healthScore ? `~${healthScore}%` : "N/A"}
                </Typography>
              </Stack>
            );
          })}
        </Box>
      )}
      {/* </ExpandableTitle> */}
    </Box>
  );
}
