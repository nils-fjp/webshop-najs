// cart.js (checkout auto-fill)
// Requires: #checkoutBtn, #cartItems, #cartSummary
// Optional: #addressSelect, #shippingSelect (if they exist, it populates them)

(function () {
  window.APP = window.APP || {
    API_URL: "http://localhost:3007",
    CART_KEY: "cart",
    CURRENT_USER_KEY: "currentUser"
  };

  const cartItemsEl = document.getElementById("cartItems");
  const cartSummaryEl = document.getElementById("cartSummary");
  const checkoutBtn = document.getElementById("checkoutBtn");

  // -----------------------
  // user
  // -----------------------
  function getCurrentUser() {
    if (window.APP.getCurrentUser) return window.APP.getCurrentUser();
    try {
      return JSON.parse(localStorage.getItem(window.APP.CURRENT_USER_KEY) || "null");
    } catch {
      return null;
    }
  }

  // -----------------------
  // cart storage
  // -----------------------
  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(window.APP.CART_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(window.APP.CART_KEY, JSON.stringify(cart));
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

  function renderCart() {
    if (!cartItemsEl || !cartSummaryEl) return;
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
            <small>${Number(item.listing_price).toFixed(2)} kr each</small>
          </div>
          <div>
            <span class="qty">x ${item.qty}</span>
          </div>
          <div>
            <strong>${(item.qty * item.listing_price).toFixed(2)} kr</strong>
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

  // -----------------------
  // checkout data loaders (AUTO)
  // -----------------------
  async function ensureShippingMethodsLoaded(shippingSelectEl) {
    if (!shippingSelectEl) return;

    // If it already has valid options, do not reload
    if (shippingSelectEl.options.length > 0 && shippingSelectEl.value) return;

    const res = await fetch(`${window.APP.API_URL}/shipping-methods`);
    if (!res.ok) {
      shippingSelectEl.innerHTML = `<option value="">Error loading shipping</option>`;
      return;
    }

    const methods = await res.json();
    if (!methods.length) {
      shippingSelectEl.innerHTML = `<option value="">No shipping methods</option>`;
      return;
    }

    shippingSelectEl.innerHTML = methods
      .map((m) => `<option value="${m.shipping_methods_id}">${m.method_name}</option>`)
      .join("");

    // Select the first one
    shippingSelectEl.value = String(methods[0].shipping_methods_id);
  }

  async function ensureAddressesLoaded(addressSelectEl, user) {
    if (!addressSelectEl) return;

    // If it already has valid options, do not reload
    if (addressSelectEl.options.length > 0 && addressSelectEl.value) return;

    const res = await fetch(`${window.APP.API_URL}/customers/${user.customer_id}/addresses`);
    if (!res.ok) {
      addressSelectEl.innerHTML = `<option value="">Error loading addresses</option>`;
      return;
    }

    const addresses = await res.json();
    if (!addresses.length) {
      addressSelectEl.innerHTML = `<option value="">No addresses found</option>`;
      return;
    }

    addressSelectEl.innerHTML = addresses
      .map(
        (a) =>
          `<option value="${a.address_id}">${a.address}${a.city ? `, ${a.city}` : ""}</option>`
      )
      .join("");

    // Select the first one
    addressSelectEl.value = String(addresses[0].address_id);
  }

  // -----------------------
  // checkout
  // -----------------------
  checkoutBtn?.addEventListener("click", async () => {
    const user = getCurrentUser();
    if (!user) {
      alert("You must login first!");
      return;
    }

    const cart = getCart();
    if (!cart.length) {
      alert("Cart is empty!");
      return;
    }

    const addressSelectEl = document.getElementById("addressSelect");
    const shippingSelectEl = document.getElementById("shippingSelect");

    if (!addressSelectEl || !shippingSelectEl) {
      alert("This page is missing addressSelect / shippingSelect in HTML.");
      return;
    }

    // ✅ Auto-fill + auto-select first option
    await ensureShippingMethodsLoaded(shippingSelectEl);
    await ensureAddressesLoaded(addressSelectEl, user);

    const shipping_address_id = Number(addressSelectEl.value);
    const shipping_method_id = Number(shippingSelectEl.value);

    if (!shipping_address_id) {
      alert("Please choose an address");
      return;
    }
    if (!shipping_method_id) {
      alert("Please choose a shipping method");
      return;
    }

    const payload = {
      customer_id: user.customer_id,
      shipping_address_id,
      shipping_method_id,
      order_items: cart.map((i) => ({
        product_id: i.product_id,
        product_quantity: i.qty
      }))
    };

    const res = await fetch(`${window.APP.API_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errText = await res.text();
      alert("Order failed: " + errText);
      return;
    }

    const okText = await res.text();
    clearCart();
    renderCart();
    alert(okText);
  });

  renderCart();
})();
