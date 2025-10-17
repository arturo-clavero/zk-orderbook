import { ToggleButton, ToggleButtonGroup } from "@mui/material";

export default function TradeTypeSelector({ tradeType, setTradeType }) {
  return (
    <ToggleButtonGroup
      value={tradeType}
      exclusive
      onChange={(e, newType) => newType && setTradeType(newType)}
      size="small"
      sx={{ width: 130 }}
    >
      {["spot", "market"].map((type) => (
        <ToggleButton
          key={type}
          value={type}
          sx={{
            flex: 1,
            "&.Mui-selected": { fontWeight: "bold" },
          }}
        >
          {type[0].toUpperCase() + type.slice(1)}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
