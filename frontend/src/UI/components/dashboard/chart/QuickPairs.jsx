import {
  Box,
  Typography,
  Stack,
  Avatar,
  Divider,
  TextField,
  InputAdornment,
} from "@mui/material";
import { useTokens } from "../../../../liveData/Tokens.jsx";
import { useState } from "react";
import { useMyContext } from "../../utils/context.jsx";
import { SortableHeader } from "../../utils/Sorting.jsx";
import SearchIcon from "@mui/icons-material/Search";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { safeNumber } from "../../utils/math.jsx";
const titleFontSize = 12;
const titleFontWeight = 500;

export default function QuickPairs() {
  const { tokenPairs } = useTokens();

  const {
    walletConnected,
    setChartPair,
    setSwitched,
    marketVisible,
    setMarketVisible,
  } = useMyContext();
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [searchTerm, setSearchTerm] = useState("");

  const sortedPairs = Object.entries(tokenPairs).sort(([k1, p1], [k2, p2]) => {
    if (!sortConfig.key) return 0;

    const a =
      sortConfig.key === "pair"
        ? `${p1.token1.symbol}/${p1.token2.symbol}`
        : sortConfig.key === "price"
          ? safeNumber(p1.price)
          : sortConfig.key === "change"
            ? p1.price24hAgo !== 0
              ? p1.price / p1.price24hAgo - 1
              : 0
            : sortConfig.key === "twap10"
              ? safeNumber(p1.twap10min)
              : sortConfig.key === "twap1"
                ? safeNumber(p1.twap1min)
                : 0;

    const b =
      sortConfig.key === "pair"
        ? `${p2.token1.symbol}/${p2.token2.symbol}`
        : sortConfig.key === "price"
          ? safeNumber(p2.price)
          : sortConfig.key === "change"
            ? p2.price24hAgo !== 0
              ? p2.price / p2.price24hAgo - 1
              : 0
            : sortConfig.key === "twap10"
              ? safeNumber(p2.twap10min)
              : sortConfig.key === "twap1"
                ? safeNumber(p2.twap1min)
                : 0;

    if (a < b) return sortConfig.direction === "asc" ? -1 : 1;
    if (a > b) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const filteredPairs = sortedPairs.filter(([key, pair]) => {
    const t1 = pair.token1.symbol.toLowerCase();
    const t2 = pair.token2.symbol.toLowerCase();
    const search = searchTerm.toLowerCase();

    return (
      t1.includes(search) ||
      t2.includes(search) ||
      `${t1}/${t2}`.includes(search) ||
      `${t2}/${t1}`.includes(search)
    );
  });

  const switchPair = (pair) => {
    setSwitched(false);
    setChartPair(pair);
    setMarketVisible(false);
  };

  return (
    <Box>
      {marketVisible && (
        <ClickAwayListener onClickAway={() => setMarketVisible(false)}>
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
            <Stack direction="row" spacing={1} sx={{ mb: 2, px: 1 }}>
              <TextField
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search pair (e.g. SOL/USDC)"
                variant="outlined"
                size="small"
                sx={{ flex: 1 }}
                slotProps={{
                  htmlInput: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Stack>
            <Stack direction="row" spacing={1} sx={{ px: 1 }}>
              <Typography
                sx={{
                  flex: 1,
                  fontWeight: titleFontWeight,
                  fontSize: titleFontSize,
                }}
              >
                Pair
              </Typography>

              <SortableHeader
                label="Price"
                sortKey="price"
                sortConfig={sortConfig}
                setSortConfig={setSortConfig}
                flex={1}
              />
              <SortableHeader
                label="24H Change"
                sortKey="change"
                sortConfig={sortConfig}
                setSortConfig={setSortConfig}
                flex={1}
              />
              <SortableHeader
                label="TWAP (10min)"
                sortKey="twap10"
                sortConfig={sortConfig}
                setSortConfig={setSortConfig}
                flex={1}
              />
              <SortableHeader
                label="TWAP (1min)"
                sortKey="twap1"
                sortConfig={sortConfig}
                setSortConfig={setSortConfig}
                flex={1}
              />
            </Stack>
            <Divider sx={{ mb: 2, mt: 2 }} />

            {filteredPairs.map(([key, pair], idx) => {
              const token1 = pair.token1;
              const token2 = pair.token2;
              const price = safeNumber(pair.price).toFixed(4);
              const change = safeNumber(
                pair.price24hAgo !== 0 ? pair.price / pair.price24hAgo - 1 : 0
              ).toFixed(4);
              const priceChange =
                change > 0 ? `+${change} %` : change < 0 ? `${change} %` : "~";
              const twap1min = safeNumber(pair.twap1min).toFixed(4);
              const twap10min = safeNumber(pair.twap10min).toFixed(4);
              return (
                <Stack
                  key={idx}
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{
                    mb: 2,
                    px: 1,
                    cursor: "pointer",
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                  onClick={() => switchPair(pair)}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ flex: 1 }}
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
                    sx={{
                      flex: 1,
                      color:
                        priceChange[0] == "+"
                          ? "green"
                          : priceChange[0] == "-"
                            ? "red"
                            : "white",
                    }}
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
        </ClickAwayListener>
      )}
    </Box>
  );
}
