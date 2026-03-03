async function submitOrder() {
  const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");

  if (cartItems.length === 0) {
    alert("Cart is empty");
    return;
  }

  // Normally these would come from logged-in user + form
  const customer_id = 1;
  const shipping_address_id = 10;
  const shipping_method_id = 2;

  const items = cartItems.map((item) => ({
    product_id: Number(item.id),
    quantity: Number(item.quantity),
    item_price: Number(item.price),
  }));

  const payload = {
    customer_id,
    shipping_address_id,
    shipping_method_id,
    items,
  };

  const API_BASE = "http://localhost:3007";

  const response = await fetch(`${API_BASE}/api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    alert(data.message || "Order failed");
    return;
  }

  // Success
  localStorage.removeItem("cartItems");
  alert(`Order created! ID: ${data.order_id}`);
}