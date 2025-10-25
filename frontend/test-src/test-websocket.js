import update_balances from "./test-upd-balance";
import update_orders from "./test-upd-order";

const socket = new WebSocket("wss://your-backend-url.example/ws"); // change URL

export function initWebSocket() {

  socket.onopen = () => {
    console.log("✅ WebSocket connected");
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);

      if (data.type === "balance_update") {
        update_balances(data.balances);
      }

      if (data.type === "orders_update") {
        update_orders(data.orders);
      }

    } catch (err) {
      console.error("⚠️ WebSocket message error:", err, event.data);
    }
  };

  socket.onclose = () => {
    console.warn("❌ WebSocket disconnected. Reconnecting in 3s...");
    setTimeout(initWebSocket, 3000); 
  };

  socket.onerror = (err) => {
    console.error("⚠️ WebSocket error:", err);
    socket.close();
  };

  return socket;
}

export function sendMessage(message) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  } else {
    console.warn("⚠️ WebSocket not connected yet. Message not sent:", message);
  }
}
