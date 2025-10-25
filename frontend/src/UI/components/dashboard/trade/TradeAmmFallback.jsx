import {
  Typography,
  FormControlLabel,
  Switch,
  Tooltip,
  IconButton,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

export default function TradeAmmFallback({
  publicRouterFallback,
  setPublicRouterFallback,
}) {
  return (
    <FormControlLabel
      control={
        <Switch
          checked={publicRouterFallback}
          onChange={(e) => setPublicRouterFallback(e.target.checked)}
          sx={{
            "& .MuiSwitch-track": { backgroundColor: "#444", opacity: 1 },
            "& .MuiSwitch-thumb": { backgroundColor: "#aaa" },
            "& .MuiSwitch-switchBase.Mui-checked": { color: "success.main" },
            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
              backgroundColor: "#1e6956ff",
              opacity: 1,
            },
            "& .MuiSwitch-switchBase.Mui-checked:hover": {
              backgroundColor: "rgba(0, 230, 118, 0.15)",
            },
          }}
        />
      }
      label={
        <Typography
          variant="caption"
          sx={{
            color: "text.primary",
            userSelect: "none",
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          Fallback to public AMM
          <Tooltip
            title={
              <Typography variant="body2" sx={{ maxWidth: 250 }}>
                Routes your trade through a public AMM. The trade amount and
                token type will be visible publicly, but it will not be linked
                to your wallet. This ensures execution even during low liquidity
                periods.
              </Typography>
            }
            arrow
            placement="bottom"
            slotProps={{
              tooltip: {
                sx: {
                  border: 1,
                  borderColor: "text.secondary",
                  bgcolor: "background.paper",
                  color: "text.primary",
                  p: 1.2,
                  borderRadius: 1,
                  maxWidth: 280,
                  fontSize: "0.8rem",
                  boxShadow: "0px 2px 8px rgba(0,0,0,0.5)",
                },
              },
              popper: {
                modifiers: [
                  { name: "preventOverflow", options: { padding: 12 } },
                ],
              },
            }}
          >
            <IconButton size="small" sx={{ p: 0, color: "text.secondary" }}>
              <HelpOutlineIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
        </Typography>
      }
      sx={{ ml: 0 }}
    />
  );
}
