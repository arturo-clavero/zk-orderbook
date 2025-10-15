import { useEffect, useRef, useState } from "react";
import { Box, Button } from "@mui/material";
import { useMyContext } from "../../../utils/context.jsx";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";

let tvScriptLoadingPromise;

export default function Chart({
  //   defaultSymbol = "PYTH:SOLUSD/PYTH:PYUSDUSD",
  //  defaultSymbol = "PYTH:PYUSDUSD/PYTH:SOLUSD",

  // defaultSymbol = "PYTH:SOLUSD",//223.87901000
  //   defaultSymbol = "PYTH:PYUSDUSD",//0.999999

  defaultInterval = "D",
  width = "100%",
  height = 500,
  containerId = "tradingview-widget",
}) {
  const containerRef = useRef();
  const { chartPair, switched, setSwitched } = useMyContext();
  //     const tokenA = switched ? chartPair?.token2 : chartPair?.token1;
  // const tokenB = switched ? chartPair?.token1 : chartPair?.token2;
  // const symbol = chartPair
  //   ? `PYTH:${tokenA.symbol}USD/PYTH:${tokenB.symbol}USD`
  //   : "";
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
  useEffect(() => {
    if (!chartPair) return;
    [token1Icon, token2Icon].forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, [chartPair, token1Icon, token2Icon]);
  // const symbolIcon = tokenA?.icon || "/assets/default.png";

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
    <>
      <Box sx={{ top: 10, left: 10, display: "flex", gap: 1 }}>
        <Button
          variant="contained"
          size="small"
          startIcon={
            <img
              src={symbolIcon}
              alt={symbolName}
              style={{ width: 20, height: 20, borderRadius: "50%" }}
            />
          }
        >
          {symbolName || "Loading..."}
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={() => setSwitched((prev) => !prev)}
          startIcon={<SwapHorizIcon />}
        >
          Switch
        </Button>
      </Box>
      <Box sx={{ position: "relative", width, height }}>
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
            backgroundColor: "rgba(18, 36, 70, 0.3)", // match
            // backgroundColor: "rgba(40, 60, 90, 0.2)", // lighter blue
          }}
        ></Box>
      </Box>
    </>
  );
}
