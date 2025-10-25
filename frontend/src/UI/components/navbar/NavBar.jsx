import { Box, Typography, Button, Stack } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import WalletConnect from "./WalletConnect.jsx";

async function setFaviconWithBackground(src) {
  const img = new Image();
  img.src = src;
  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#333";
    ctx.beginPath();
    ctx.arc(32, 32, 32, 0, Math.PI * 2);
    ctx.fill();
    ctx.drawImage(img, 8, 8, 50, 50);
    setFavicon(canvas.toDataURL("image/png"));
  };
}

function setFavicon(src) {
  let link = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.getElementsByTagName("head")[0].appendChild(link);
  }
  link.href = src;
}

///END TESTING

export default function NavBar() {
  setFaviconWithBackground("/logo.png");
  console.log("link: ");
  console.log(document.querySelector("link[rel~='icon']").href);

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
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box
          component="img"
          src={`/logo.png`}
          alt="DEX Logo"
          sx={{
            width: { xs: 36, sm: 30 },
            height: { xs: 36, sm: 30 },
            mr: 1.5,
            filter: "drop-shadow(2px 4px 6px rgba(0,0,0,0.5))",
          }}
        />
        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
            fontFamily: "'Roboto Mono', monospace",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "text.primary",
            textShadow: "2px 4px 6px rgba(0,0,0,0.6)",
          }}
        >
          Zorro
        </Typography>
      </Box>

      <WalletConnect />
    </Box>
  );
}
