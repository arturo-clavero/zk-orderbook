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
              24H Change
            </Typography>
            <Typography
              sx={{
                flex: 1,
                fontWeight: titleFontWeight,
                fontSize: titleFontSize,
              }}
            >
              TWAP (10min)
            </Typography>
            <Typography
              sx={{
                flex: 1,
                fontWeight: titleFontWeight,
                fontSize: titleFontSize,
              }}
            >
              TWAP (1min)
            </Typography>
          </Stack>
          {Object.entries(tokenPairs).map(([key, pair], idx) => {
            const token1 = pair.token1;
            const token2 = pair.token2;
            const price = pair.price.toFixed(4);
            const priceChange = (price / pair.price24hAgo - 1).toFixed(4);
            const twap1min = pair.twap1min.toFixed(4);
            const twap10min = pair.twap10min.toFixed(4);
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
                  {twap1min ? `${twap1min}` : "N/A"}
                </Typography>
                <Typography sx={{ flex: 1 }}>
                  {twap10min ? `${twap10min}` : "N/A"}
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
