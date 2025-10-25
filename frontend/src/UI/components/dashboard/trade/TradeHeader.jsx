import { Box, Typography, Stack, Button } from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";

export default function TradeHeader({
  chartPair,
  mainToken,
  quoteToken,
  setSwitched,
}) {
  return (
    <Box>
      <Typography variant="subtitle2" color="text.secondary">
        Trading Pair
      </Typography>
      <Stack display="flex" direction="row" spacing={2}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {chartPair
            ? `${mainToken.symbol} / ${quoteToken.symbol}`
            : "Select Pair"}
        </Typography>
        <Button
          variant="contained"
          size="small"
          onClick={() => setSwitched((p) => !p)}
          sx={{
            minWidth: "2px",
            borderRadius: 2,
            bgcolor: "rgba(255,255,255,0)",
            "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
          }}
        >
          <SwapHorizIcon />
        </Button>
      </Stack>
    </Box>
  );
}
