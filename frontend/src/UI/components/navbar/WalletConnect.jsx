import {
  Button,
  Menu,
  MenuItem,
  Box,
  Tooltip,
  IconButton,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { useMyContext } from "../utils/context.jsx";
import { ethers } from "ethers";
import { useState } from "react";
import LogoutIcon from "@mui/icons-material/Logout";

export default function WalletConnect() {
  const {
    walletConnected,
    setWalletConnected,
    walletAddress,
    setWalletAddress,
    walletMenuAnchor,
    setWalletMenuAnchor,
    setState,
  } = useMyContext();

  const [tooltipText, setTooltipText] = useState("Copy Address");

  const shortenAddress = (addr) => {
    if (!addr) return "";
    let str = `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    console.log("str: ", str);
    const strShort = str.toLowerCase();
    console.log("low: ", strShort);
    return strShort;
  };

  const copyAddress = async () => {
    if (walletAddress) {
      await navigator.clipboard.writeText(walletAddress);
      setTooltipText("Copied");
      setTimeout(() => setTooltipText("Copy Address"), 1500);
    }
  };

  const handleWalletClick = (event) => setWalletMenuAnchor(event.currentTarget);
  const handleWalletClose = () => setWalletMenuAnchor(null);

  const connectWallet = async () => {
    setState("");
    try {
      if (!window.ethereum) {
        alert("MetaMask not detected!");
        return;
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const address = await signer.getAddress();
      setWalletConnected(true);
      setWalletAddress(address);
      handleWalletClose();

      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          console.log("changing accounts: ", accounts);
          setWalletAddress(accounts[0]);
          setWalletConnected(true);
        } else {
          disconnectWallet();
        }
      });

      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    } catch (error) {
      console.error("Wallet connection failed:", error);
    }
  };

  const disconnectWallet = () => {
    setWalletConnected(false);
    setWalletAddress("");
    handleWalletClose();
    setState("");
  };

  const switchWallet = async () => {
    try {
      if (!window.ethereum) return;

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts.length > 1) {
        console.log("in)", accounts);
        let i;
        for (i = 0; i < accounts.length; i++) {
          console.log(i, "/", accounts.length);
          if (accounts[i].toLowerCase() === walletAddress.toLowerCase()) {
            console.log("found at: ", i);
            if (i + 1 < accounts.length) i += 1;
            else i = 0;
            console.log("i: ", i);
            break;
          } else if (i == accounts.length - 1) {
            i = 0;
            break;
          }
        }

        setWalletAddress(accounts[i]);
        handleWalletClose();
        setState("");
      } else console.log("only one wallet");
    } catch (err) {
      console.error("Switch wallet failed:", err);
    }
  };

  return (
    <>
      {walletConnected ? (
        <>
          <Box
            sx={{
              mr: 5,
              textTransform: "none",
              fontWeight: 600,
              "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
            }}
          >
            <Button
              variant="contained"
              sx={{
                textTransform: "none",
                bgcolor: "secondary.main",
                color: "secondary.contrastText",
                "&:hover": {
                  bgcolor: "secondary.light",
                },
              }}
              onClick={handleWalletClick}
              startIcon={<LogoutIcon sx={{ color: "info.main" }} />}
            >
              {shortenAddress(walletAddress)}
              <Tooltip title={tooltipText}>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    copyAddress();
                  }}
                  sx={{ ml: 0.5, p: 0.3, color: "#fff" }}
                >
                  <ContentCopyIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Tooltip>
            </Button>
            {/* close this button at top before tooltip to get rid of the button insde button error */}
          </Box>
          <Menu
            anchorEl={walletMenuAnchor}
            open={Boolean(walletMenuAnchor)}
            onClose={handleWalletClose}
            sx={{ mt: 0.5 }}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem onClick={disconnectWallet}>Disconnect</MenuItem>
            <MenuItem onClick={switchWallet}>Switch Account</MenuItem>
          </Menu>
        </>
      ) : (
        <Button
          onClick={connectWallet}
          startIcon={
            <AccountBalanceWalletIcon sx={{ color: "success.main" }} />
          }
          variant="contained"
          sx={{
            mr: 5,
            textTransform: "none",
            bgcolor: "secondary.main",
            color: "secondary.contrastText",
            "&:hover": {
              bgcolor: "secondary.light",
            },
          }}
        >
          Wallet
        </Button>
      )}
    </>
  );
}
