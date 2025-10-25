export default function update_orders(orders){
    const ordersElem = document.getElementById("orders");
        if (ordersElem && Array.isArray(data.orders)) {
          const list = orders
            .map(o => `${o.id}. ${o.type.toUpperCase()} ${o.amount} ${o.pair} @ ${o.price}`)
            .join("<br>");
          ordersElem.innerHTML = list || "No orders yet.";
        }
}