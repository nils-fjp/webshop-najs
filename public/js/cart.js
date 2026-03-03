// =======================
// CONFIG
// =======================
const API_URL = "http://localhost:3007";
const CART_KEY = "cart";

// =======================
// DOM
// =======================
const productsGrid = document.getElementById("productsGrid");
const cartItemsEl = document.getElementById("cartItems");
const cartSummaryEl = document.getElementById("cartSummary");
const checkoutBtn = document.getElementById("checkoutBtn");

// Keep last fetched products here so we can add by id
let currentProducts = [];

// =======================
// CART (localStorage)
// =======================
function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(product, qty = 1) {
  const cart = getCart();
  const existing = cart.find((i) => i.product_id === product.product_id);

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      product_id: product.product_id,
      product_name: product.product_name,
      listing_price: Number(product.listing_price),
      qty
    });
  }

  saveCart(cart);
}

function updateQty(product_id, newQty) {
  let cart = getCart();
  const item = cart.find((i) => i.product_id === product_id);
  if (!item) return;

  item.qty = newQty;

  if (item.qty <= 0) {
    cart = cart.filter((i) => i.product_id !== product_id);
  }

  saveCart(cart);
}

function clearCart() {
  saveCart([]);
}

function getCartTotals() {
  const cart = getCart();
  const itemsCount = cart.reduce((sum, i) => sum + i.qty, 0);
  const total = cart.reduce((sum, i) => sum + i.qty * i.listing_price, 0);
  return { itemsCount, total };
}

// =======================
// RENDER UI
// =======================
function renderProductCard(p) {
  return `
    <article class="card">
      <h3>${p.product_name}</h3>
      <p><strong>${Number(p.listing_price).toFixed(2)} kr</strong></p>
      <button class="addToCartBtn" data-id="${p.product_id}">
        Add to cart
      </button>
    </article>
  `;
}

function renderProducts() {
  if (!currentProducts.length) {
    productsGrid.innerHTML = "<p>No products found.</p>";
    return;
  }
  productsGrid.innerHTML = currentProducts.map(renderProductCard).join("");
}

function renderCart() {
  const cart = getCart();

  if (!cart.length) {
    cartItemsEl.innerHTML = "<p>Your cart is empty.</p>";
    cartSummaryEl.innerHTML = "";
    return;
  }

  cartItemsEl.innerHTML = cart
    .map(
      (item) => `
      <div class="cart-row" data-id="${item.product_id}">
        <div>
          <strong>${item.product_name}</strong><br />
          <small>${item.listing_price} kr each</small>
        </div>

        <div>
          <button class="minusBtn">-</button>
          <span class="qty">${item.qty}</span>
          <button class="plusBtn">+</button>
        </div>

        <div>
          <strong>${(item.qty * item.listing_price).toFixed(2)} kr</strong>
          <button class="removeBtn">Remove</button>
        </div>
      </div>
    `
    )
    .join("");

  const { itemsCount, total } = getCartTotals();
  cartSummaryEl.innerHTML = `
    <p>Items: <strong>${itemsCount}</strong></p>
    <p>Total: <strong>${total.toFixed(2)} kr</strong></p>
  `;
}

// =======================
// API: LOAD PRODUCTS
// =======================
async function loadAllProducts() {
  const res = await fetch(`${API_BASE}/products`);
  if (!res.ok) {
    productsGrid.innerHTML = `<p>Error loading products (${res.status})</p>`;
    return;
  }

  currentProducts = await res.json();
  renderProducts();
}

// =======================
// EVENTS
// =======================

// Add to cart
productsGrid.addEventListener("click", (e) => {
  const btn = e.target.closest(".addToCartBtn");
  if (!btn) return;

  const id = Number(btn.dataset.id);
  const product = currentProducts.find((p) => p.product_id === id);
  if (!product) return;

  addToCart(product, 1);
  renderCart();
});

// Cart qty controls
cartItemsEl.addEventListener("click", (e) => {
  const row = e.target.closest(".cart-row");
  if (!row) return;

  const product_id = Number(row.dataset.id);
  const cart = getCart();
  const item = cart.find((i) => i.product_id === product_id);
  if (!item) return;

  if (e.target.closest(".plusBtn")) updateQty(product_id, item.qty + 1);
  if (e.target.closest(".minusBtn")) updateQty(product_id, item.qty - 1);
  if (e.target.closest(".removeBtn")) updateQty(product_id, 0);

  renderCart();
});

// Checkout → create order
checkoutBtn.addEventListener("click", async () => {
  const cart = getCart();
  if (!cart.length) return alert("Cart is empty!");

  const { total } = getCartTotals();

  // This payload depends on your backend order schema
  const payload = {
    customer_id: 1, // later: from logged-in user
    total_price: total,
    items: cart.map((i) => ({
      product_id: i.product_id,
      qty: i.qty,
      price: i.listing_price
    }))
  };

  // ✅ This requires that your backend has POST /orders
  const res = await fetch(`${API_BASE}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errText = await res.text();
    alert("Order failed: " + errText);
    return;
  }

  const data = await res.json();

  clearCart();
  renderCart();
  alert("Order created! ID: " + (data.order_id ?? "OK"));
});

// =======================
// INIT
// =======================
(async function init() {
  await loadAllProducts();
  renderCart();
})();
const user = getCurrentUser();
if (!user) return alert("You must login first!");

/* const payload = {
  customer_id: user.customer_id,
  shipping_address_id: Number(addressSelect.value),
  shipping_method_id: Number(shippingSelect.value),
  total_price: total,
  items: cart.map(i => ({
    product_id: i.product_id,
    qty: i.qty,
    price: i.listing_price
  }))
}; */