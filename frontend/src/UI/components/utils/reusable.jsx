import {
  Box,
  Button,
  Typography,
  IconButton,
  Stack,
  Collapse,
} from "@mui/material";
import { KeyboardArrowDown } from "@mui/icons-material";

import { useState } from "react";

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
  shrinkTitle = undefined,
  initiallyExpanded = true,
  onToggle,
  color = "text.secondary",
  children,
  isVisible = true,
  TitleBox = <Box></Box>,
}) {
  if (shrinkTitle === undefined) shrinkTitle = title;
  const [expanded, setExpanded] = useState(initiallyExpanded);

  const handleToggle = () => {
    setExpanded(!expanded);
    if (onToggle) onToggle(!expanded);
  };
  const finalTitle = isVisible ? title : shrinkTitle;

  return (
    <Box>
      {/* { && title.length > 0 &title& ( */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{
          cursor: "pointer",
          userSelect: "none",
          mb: 0.5,
        }}
        onClick={handleToggle}
      >
        {TitleBox}
        {/* <Typography
            variant="subtitle2"
            sx={{ fontWeight: 700, color: color }}
          >
            {finalTitle}
          </Typography> */}
        <IconButton
          size="small"
          sx={{
            transform: expanded ? "rotate(0deg)" : "rotate(-90deg)",
            transition: "transform 0.3s ease",
            color: color,
            p: 0,
          }}
        >
          <KeyboardArrowDown />
        </IconButton>
      </Stack>
      {/* )} */}

      <Collapse in={expanded} timeout={300}>
        {children}
      </Collapse>
    </Box>
  );
}
