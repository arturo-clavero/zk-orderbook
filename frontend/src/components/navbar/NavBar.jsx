import { Box, Typography, Button, Stack } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import WalletConnect from "./WalletConnect.jsx";

export default function NavBar() {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/" },
    { name: "Orders", path: "/orders" },
    { name: "Activity", path: "/activity" },
  ];

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1300,
        width: "100%",
        px: { xs: 2, sm: 4 },
        py: 1.5,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        bgcolor: "primary.main",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      }}
    >
      {/* Logo + Title */}
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box
          component="img"
          src="/l16.png"
          alt="DEX Logo"
          sx={{
            width: { xs: 36, sm: 45 },
            height: { xs: 36, sm: 45 },
            mr: 1,
            filter: "drop-shadow(2px 4px 6px rgba(0,0,0,0.5))",
          }}
        />
        <Typography
          variant="h6"
          sx={{
            fontWeight: 900,
            fontFamily: "'Roboto Mono', monospace",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "text.primary",
            textShadow: "2px 4px 6px rgba(0,0,0,0.6)",
          }}
        >
          ZKDEX
        </Typography>
      </Box>

      <Stack
        direction="row"
        spacing={2}
        sx={{ flexGrow: 1, justifyContent: "center" }}
      >
        {navItems.map((item) => (
          <Button
            key={item.name}
            component={Link}
            to={item.path}
            sx={{
              width: 140, // fixed width
              textAlign: "center",
              color:
                location.pathname === item.path
                  ? "success.main"
                  : "text.primary",
              fontWeight: location.pathname === item.path ? 700 : 500,
              textTransform: "none",
            }}
          >
            {item.name}
          </Button>
        ))}
      </Stack>

      <WalletConnect />
    </Box>
  );
}
