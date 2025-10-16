import { useEffect, useRef } from "react";

export function useWebSocketData({
  walletConnected,
  walletAddress,
  onMessage,
}) {
  const wsRef = useRef(null);

  useEffect(() => {
    if (!walletConnected) return;

    const ws = new WebSocket("wss://your-backend/ws"); // replace with real backend
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WebSocket Connected");
      ws.send(JSON.stringify({ type: "subscribe", wallet: walletAddress }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage?.(data); // delegate back to context
      } catch (err) {
        console.error("WS parse error:", err);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket Disconnected");
    };

    return () => {
      ws.close();
    };
  }, [walletConnected, walletAddress, onMessage]);

  return wsRef;
}
