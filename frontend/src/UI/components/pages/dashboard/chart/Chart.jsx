import { useEffect, useRef, useState } from "react";
import { Box, Button } from "@mui/material";
import { useMyContext } from "../../../utils/context.jsx";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import QuickPairs from "./QuickPairs.jsx";

let tvScriptLoadingPromise;

export default function Chart({
  defaultInterval = "D",
  width = "100%",
  height = 500,
  containerId = "tradingview-widget",
}) {
  const containerRef = useRef();
  const { chartPair, switched, setSwitched, setMarketVisible, marketVisible } =
    useMyContext();
  const symbol = chartPair
    ? switched == false
      ? `PYTH:${chartPair.token1.symbol}USD/PYTH:${chartPair.token2.symbol}USD`
      : `PYTH:${chartPair.token2.symbol}USD/PYTH:${chartPair.token1.symbol}USD`
    : "";
  const symbolName = chartPair
    ? switched == false
      ? `${chartPair.token1.symbol} / ${chartPair.token2.symbol}`
      : `${chartPair.token2.symbol} / ${chartPair.token1.symbol}`
    : "";

  const token1Icon = chartPair?.token1.icon || "/assets/default.png";
  const token2Icon = chartPair?.token2.icon || "/assets/default.png";

  const symbolIcon = !switched ? token1Icon : token2Icon;

  const overlay = marketVisible
    ? "rgba(10, 15, 28, 0.8)"
    : "rgba(18, 36, 70, 0.3)";

  useEffect(() => {
    if (!chartPair) return;
    [token1Icon, token2Icon].forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, [chartPair, token1Icon, token2Icon]);

  const createWidget = () => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = "";

    new window.TradingView.widget({
      container_id: containerId,
      autosize: false,
      width,
      height,
      symbol,
      interval: defaultInterval,
      timezone: "Etc/UTC",
      theme: "dark",
      style: "10", //1, 2, 3, 10
      locale: "en",
      enable_publishing: false,
      hide_side_toolbar: true,
      save_image: false,
      hide_top_toolbar: false,
      allow_symbol_change: false,
      hide_legend: false,
      studies_access: false,
      withdateranges: true,
      details: true,
    });
  };

  useEffect(() => {
    if (!tvScriptLoadingPromise) {
      tvScriptLoadingPromise = new Promise((resolve) => {
        const script = document.createElement("script");
        script.id = "tradingview-widget-loading-script";
        script.src = "https://s3.tradingview.com/tv.js";
        script.type = "text/javascript";
        script.onload = resolve;
        document.head.appendChild(script);
      });
    }

    tvScriptLoadingPromise.then(() => createWidget());

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, [symbol, defaultInterval, width, height, containerId]);

  return (
    <Box sx={{ flex: 1 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          borderRadius: 2,
          boxShadow: 2,
          width: 250,
        }}
      >
        <Button
          variant="contained"
          size="medium"
          sx={{
            px: 2.5,
            py: 1.5,
            fontSize: "0.95rem",
            borderRadius: 2,
            color: "secondary.contrastText",
            "&:hover": {
              bgcolor: "secondary.light",
            },
          }}
          startIcon={
            <img
              src={symbolIcon}
              alt={symbolName}
              style={{ width: 20, height: 20, borderRadius: "50%" }}
            />
          }
          onClick={() => setMarketVisible((prev) => !prev)}
        >
          {symbolName || "Loading..."}
        </Button>
        <Button
          variant="contained"
          size="medium"
          onClick={() => setSwitched((prev) => !prev)}
          sx={{
            px: 1.5,
            minWidth: "48px",
            borderRadius: 2,
            bgcolor: "rgba(255,255,255,0.1)",
            "&:hover": {
              bgcolor: "rgba(255,255,255,0.2)",
            },
          }}
        >
          <SwapHorizIcon />
        </Button>
      </Box>
      <Box sx={{ position: "relative", width, height }}>
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 10,
            minWidth: "650px",
          }}
        >
          <QuickPairs />
        </Box>
        <Box
          ref={containerRef}
          id={containerId}
          sx={{ width: "100%", height: "100%" }}
        />

        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            backgroundColor: overlay,
          }}
        ></Box>
      </Box>
    </Box>
  );
}
