import { Stack, Button } from "@mui/material";

export default function TradeSideSelector({ side, setSide }) {
  return (
    <Stack direction="row" spacing={1}>
      {["buy", "sell"].map((s) => (
        <Button
          key={s}
          variant="outlined"
          fullWidth
          onClick={() => setSide(s)}
          sx={{
            color: s === "buy" ? "success.main" : "error.main",
            bgcolor:
              side === s
                ? s === "buy"
                  ? "rgba(0,128,0,0.1)"
                  : "rgba(255,0,0,0.1)"
                : "transparent",
            borderColor:
              s === side
                ? s === "buy"
                  ? "success.main"
                  : "error.main"
                : "divider",
            fontWeight: s === side ? 700 : 400,
          }}
        >
          {s[0].toUpperCase() + s.slice(1)}
        </Button>
      ))}
    </Stack>
  );
}
