import {
  Box,
  Button,
  Typography,
  IconButton,
  Stack,
  Collapse,
} from "@mui/material";
import {
  ExpandMore,
  ExpandLess,
  Visibility,
  VisibilityOff,
  KeyboardArrowDown,
} from "@mui/icons-material";

import { useState } from "react";

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
      minHeight: 150,
      backgroundImage: bgImage ? `url(${bgImage})` : "none",
      backgroundSize: "cover",
      backgroundPosition: "center",
      "&::before": {
        content: '""',
        position: "absolute",
        inset: 0,
        bgcolor: bgImage ? "rgba(0,0,0,0.25)" : "transparent",
      },
      "& > *": {
        position: "relative",
      },
    }}
  >
    {children}
  </Box>
);

export const ButtonLight = ({
  title,
  size = 0,
  onClick = () => {},
  flex = 0,
}) => (
  <Button
    onClick={onClick}
    variant="contained"
    size="small"
    sx={{
      flex: flex,
      minWidth: size,
      textTransform: "none",
      bgcolor: "secondary.main",
      color: "secondary.contrastText",
      "&:hover": {
        bgcolor: "secondary.light",
      },
    }}
  >
    {title}
  </Button>
);

export function ExpandableTitle({
  title = "",
  initiallyExpanded = true,
  onToggle,
  color = "text.primary",
  children,
}) {
  const [expanded, setExpanded] = useState(initiallyExpanded);

  const handleToggle = () => {
    setExpanded(!expanded);
    if (onToggle) onToggle(!expanded);
  };

  return (
    <Box>
      {title && title.length > 0 ? (
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ cursor: "pointer", ml: 7, mb: 1, userSelect: "none" }}
          onClick={handleToggle}
        >
          <Typography
            variant="subtitle1"
            sx={{ color: color, fontWeight: 600 }}
          >
            {title}
          </Typography>
          <IconButton
            size="small"
            sx={{
              transform: expanded ? "rotate(0deg)" : "rotate(-90deg)",
              transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)", // smooth easing
              color: color,
            }}
          >
            <KeyboardArrowDown />
          </IconButton>
        </Stack>
      ) : null}

      <Collapse
        in={expanded}
        timeout={1200} // animation duration
        sx={{ mt: 1 }}
      >
        {children}
      </Collapse>
    </Box>
  );
}
