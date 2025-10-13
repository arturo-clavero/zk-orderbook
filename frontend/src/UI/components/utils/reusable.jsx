import { Box, Typography } from "@mui/material";

export const InfoBox = ({ title, children, bgImage }) => (
  <Box
    sx={{
      flex: 1,
      p: 3,
      borderRadius: 10, // rounder corners
      bgcolor: "background.paper",
      boxShadow: 3,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
      minHeight: 150, // ensures enough space for content
      backgroundImage: bgImage ? `url(${bgImage})` : "none",
      backgroundSize: "cover",
      backgroundPosition: "center",
      "&::before": {
        content: '""',
        position: "absolute",
        inset: 0,
        bgcolor: bgImage ? "rgba(0,0,0,0.25)" : "transparent", // overlay for readability
      },
      "& > *": {
        position: "relative", // ensures children are above overlay
      },
    }}
  >
    {children}
  </Box>
);
