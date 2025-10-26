import { useState, useRef } from "react";
import {
  Box,
  Typography,
  Link,
  IconButton,
  Collapse,
  List,
  ListItem,
  ListItemText,
  Stack,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { Element, scroller } from "react-scroll";

export default function Footer() {
  const [showContracts, setShowContracts] = useState(false);
  const contractsRef = useRef(null);

  const contracts = [
    {
      name: "QuizNFT Contract",
      address: "0x0000000000000000000000000000000000000000",
    },
    {
      name: "Verifier Contract",
      address: "0x1111111111111111111111111111111111111111",
    },
  ];

  const handleExpand = () => {
    setShowContracts((prev) => !prev);
    setTimeout(() => {
      scroller.scrollTo("contractSection", {
        duration: 500,
        delay: 0,
        smooth: "easeInOutQuart",
        offset: -50,
      });
    }, 100);
  };

  return (
    <Element name="contractSection">
      <Box
        component="footer"
        sx={{
          py: 3,
          borderTop: 1,
          borderColor: "divider",
          textAlign: "center",
        }}
      >
        <Stack
          direction="row"
          spacing={10}
          justifyContent="center"
          alignItems="center"
        >
          <Box
            sx={{
              flex: 1,
              mr: 2,
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "flex-start",
            }}
          >
            <Link
              href="https://github.com/arturo-clavero"
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <GitHubIcon sx={{ mr: 0.5 }} /> GitHub
            </Link>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  userSelect: "none",
                }}
                onClick={handleExpand}
              >
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  Smart Contracts
                </Typography>
                <IconButton size="small" sx={{ ml: 0.5 }}>
                  {showContracts ? (
                    <ExpandLessIcon fontSize="small" />
                  ) : (
                    <ExpandMoreIcon fontSize="small" />
                  )}
                </IconButton>
              </Box>
              <Collapse in={showContracts} timeout="auto" unmountOnExit>
               
<Box
  ref={contractsRef}
  sx={{
    marginTop: 1,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
    justifyContent: "start",
    alignItems: "center",
  }}
>
  {contracts.map((c, idx) => (
    <Link
      key={idx}
      href={`https://etherscan.io/address/${c.address}`}
      target="_blank"
      rel="noopener noreferrer"
      underline="hover"
      sx={{ color: "info.main", fontWeight: 500 }}
    >
      {c.name}
    </Link>
  ))}
</Box>
              </Collapse>
            </Box>
          </Box>
        </Stack>

        {/* <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 1, display: "block" }}
        >
          Some notes to keep in mind ...
        </Typography> */}
      </Box>
    </Element>
  );
}
