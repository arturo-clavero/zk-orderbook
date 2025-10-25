import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#0D1B2A",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#1B263B",
    },
    background: {
      default: "#0A0F1C",
      paper: "#121A2A",
    },
    text: {
      primary: "#E0E0E0",
      secondary: "#a0a0a0ff",
    },
    success: {
      main: "#2fc29dff",
      secondary: "#2fc26cff",
      contrastText: "#ffffff",
    },
    warning: {
      main: "#FF9800",
      contrastText: "#ffffff",
    },
    info: {
      main: "#29B6F6",
      contrastText: "#ffffff",
    },
    divider: "rgba(255, 255, 255, 0.12)",
    typography: {
      fontFamily: "'Inter', sans-serif",
      h5: { fontWeight: 700 },
      h6: { fontWeight: 600 },
      body1: { fontWeight: 500 },
      body2: { fontWeight: 400 },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: "none",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
    },
  },
});

export default theme;
