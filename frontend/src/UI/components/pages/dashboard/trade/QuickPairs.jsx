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

const x = 1.3;
const y = 1.2;
const z = 1.6;

export default function QuickPairs() {
  const { tokens, tokenPairs } = useTokens();
  const [visible, setVisible] = useState(true);
    const {walletConnected } = getContext();
  

  return (
    <Box>
      <ExpandableTitle
        title="Quick Pairs"
        initiallyExpanded={true}
        onToggle={(expanded) => setVisible(expanded)}
        visible={walletConnected}
      >
      {visible && (
        <Box
          sx={{
            py: 2,
            px: 3,
            border: 1,
            borderColor: "divider",
            borderRadius: 2,
            bgcolor: "background.paper",
            boxShadow: 2,
          }}
        >
          <Stack direction="row" spacing={2} sx={{ px: 1 }}>
            <Typography sx={{ flex: 2, fontWeight: 600 }}>Pair</Typography>
            <Typography sx={{ flex: 1, fontWeight: 600 }}>Price</Typography>
            <Stack
              direction="row"
              spacing={3}
              sx={{ flex: 3, display: "flex", justifyContent: "center" }}
            >
              <Box sx={{ flex: x, display: "flex", justifyContent: "center" }}>
                <ArrowUpCircle size={22} color="#a0a0a0ff" />
              </Box>
              <Box sx={{ flex: y, display: "flex", justifyContent: "center" }}>
                <SwapHorizRounded
                  sx={{ fontSize: 35, color: "text.secondary", pb: 1 }}
                />
              </Box>
              <Box sx={{ flex: z, display: "flex", justifyContent: "center" }}>
                <ArrowDownCircle size={22} color="#a0a0a0ff" />
              </Box>
            </Stack>
          </Stack>
          <Divider sx={{ mb: 3 }} />

          {Object.entries(tokenPairs).map(([key, pair], idx) => {
            const price = pair.price;
            const token1 = pair.token1;
            const token2 = pair.token2;

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
                  {price ? `${price.toFixed(4)}` : "N/A"}
                </Typography>

                <Stack direction="row" spacing={2} sx={{ flex: 3 }}>
                  <ButtonLight title="DEPOSIT" flex={x} />
                  <ButtonLight title="TRADE" flex={y} />
                  <ButtonLight title="WITHDRAW" flex={z} />
                </Stack>
              </Stack>
            );
          })}
        </Box>
      )}
      </ExpandableTitle>
    </Box>
  );
}
