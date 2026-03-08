// cart.js (checkout auto-fill)
// Requires: shared.js, #checkoutBtn, #cartItems, #cartSummary
// Optional: #addressSelect, #shippingSelect (if they exist, it populates them)

(function () {
  const cartItemsEl = document.getElementById("cartItems");
  const cartSummaryEl = document.getElementById("cartSummary");
  const checkoutBtn = document.getElementById("checkoutBtn");

  // -----------------------
  // cart rendering
  // -----------------------
  function renderCart() {
    if (!cartItemsEl || !cartSummaryEl) return;
    const cart = window.APP.getCart();

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
            <button class="removeBtn" data-id="${item.product_id}">Remove</button>
          </div>
        </div>
      `
      )
      .join("");

    const { itemsCount, total } = window.APP.getCartTotals();
    cartSummaryEl.innerHTML = `
      <p>Items: <strong>${itemsCount}</strong></p>
      <p>Total: <strong>${total.toFixed(2)} kr</strong></p>
    `;
  }

  // -----------------------
  // checkout
  // -----------------------
  checkoutBtn?.addEventListener("click", async () => {
    const user = window.APP.getCurrentUser();
    if (!user) {
      alert("You must login first!");
      return;
    }

    const cart = window.APP.getCart();
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

    // Auto-fill selects if not already populated (uses loaders from login.js)
    if (!shippingSelectEl.value && window.APP.loadShippingMethods) {
      await window.APP.loadShippingMethods();
    }
    if (!addressSelectEl.value && window.APP.loadAddresses) {
      await window.APP.loadAddresses();
    }

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
      const errData = await res.json();
      alert("Order failed: " + (errData.error || "Unknown error"));
      return;
    }

    const data = await res.json();
    window.APP.clearCart();
    renderCart();
    alert(data.message || "Order created!");
  });

  // Expose so product-card.js can trigger a re-render after adding items
  window.APP.renderCart = renderCart;

  // Remove item from cart (delegated click on .removeBtn)
  cartItemsEl?.addEventListener("click", (e) => {
    const btn = e.target.closest(".removeBtn");
    if (!btn) return;
    const id = Number(btn.dataset.id);
    const cart = window.APP.getCart().filter((i) => i.product_id !== id);
    window.APP.saveCart(cart);
    renderCart();
  });

  renderCart();
})();
