import React, { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";

let tvScriptLoadingPromise;

export default function Chart({
  defaultSymbol = "PYTH:BTCUSD",
  defaultInterval = "D",
  width = "100%",
  height = 500,
  containerId = "tradingview-widget",
}) {
  const containerRef = useRef();

  const createWidget = () => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = "";

    new window.TradingView.widget({
      container_id: containerId,
      autosize: false,
      width,
      height,
      symbol: defaultSymbol,
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
  }, [defaultSymbol, defaultInterval, width, height, containerId]);

  return (
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
  );
}
