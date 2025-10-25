import { GlobalStyles } from "@mui/material";

export default function HideScrollbarsGlobal() {
  return (
    <GlobalStyles
      styles={{
        "*": {
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        },
        "*::-webkit-scrollbar": {
          width: 0,
          height: 0,
          background: "transparent",
        },
      }}
    />
  );
}
