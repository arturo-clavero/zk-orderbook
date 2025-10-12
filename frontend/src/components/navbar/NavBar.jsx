import { Box, Typography, Button, Stack } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

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
        boxShadow: 3,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box
          component="img"
          src="/vite.svg" //TODO: replace logo
          alt="DEX Logo"
          sx={{ width: 36, height: 36, mr: 1 }}
        />
        <Typography variant="h6" sx={{ fontWeight: 700, color: "white" }}>
          ZkDEX
        </Typography>
      </Box>

      <Stack direction="row" spacing={3}>
        {navItems.map((item) => (
          <Button
            key={item.name}
            component={Link}
            to={item.path}
            sx={{
              color:
                location.pathname === item.path ? "secondary.main" : "white",
              fontWeight: location.pathname === item.path ? 700 : 500,
              textTransform: "none",
            }}
          >
            {item.name}
          </Button>
        ))}
      </Stack>

      <Box>
        <Button
          variant="contained"
          color="secondary"
          sx={{ textTransform: "none" }}
        >
          Connect Wallet
        </Button>
      </Box>
    </Box>
  );
}
