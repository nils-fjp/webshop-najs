// login.js (robust with IDs)
// Works even if your input is not named exactly emailInput

(function () {
  window.APP = window.APP || {
    API_URL: "http://localhost:3007",
    CART_KEY: "cart",
    CURRENT_USER_KEY: "currentUser"
  };

  const emailInput =
    document.getElementById("emailInput") ||
    document.querySelector('input[type="email"]') ||
    document.getElementById("email");

  const loginBtn =
    document.getElementById("loginBtn") ||
    document.querySelector('[data-action="login"]') ||
    document.querySelector("button");

  const logoutBtn = document.getElementById("logoutBtn");
  const userInfo = document.getElementById("userInfo");

  const addressSelect = document.getElementById("addressSelect");
  const shippingSelect = document.getElementById("shippingSelect");

  function setCurrentUser(user) {
    localStorage.setItem(window.APP.CURRENT_USER_KEY, JSON.stringify(user));
  }

  function getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem(window.APP.CURRENT_USER_KEY) || "null");
    } catch {
      return null;
    }
  }

  function clearCurrentUser() {
    localStorage.removeItem(window.APP.CURRENT_USER_KEY);
  }

  function renderUserUI() {
    const user = getCurrentUser();
    if (!user) {
      if (userInfo) userInfo.textContent = "Not logged in";
      if (logoutBtn) logoutBtn.style.display = "none";
      return;
    }
    if (userInfo) userInfo.textContent = `Logged in: ${user.first_name} ${user.last_name} (${user.email})`;
    if (logoutBtn) logoutBtn.style.display = "inline-block";
  }

  async function loadShippingMethods() {
    if (!shippingSelect) return;
    const res = await fetch(`${window.APP.API_URL}/shipping-methods`);
    if (!res.ok) return (shippingSelect.innerHTML = `<option value="">Error loading shipping</option>`);
    const methods = await res.json();
    shippingSelect.innerHTML = methods
      .map((m) => `<option value="${m.shipping_methods_id}">${m.method_name}</option>`)
      .join("");
  }

  async function loadAddresses() {
    if (!addressSelect) return;

    const user = getCurrentUser();
    if (!user) return (addressSelect.innerHTML = `<option value="">Login to see addresses</option>`);

    const res = await fetch(`${window.APP.API_URL}/customers/${user.customer_id}/addresses`);
    if (!res.ok) return (addressSelect.innerHTML = `<option value="">Error loading addresses</option>`);

    const addresses = await res.json();
    addressSelect.innerHTML = addresses
      .map((a) => `<option value="${a.address_id}">${a.address}${a.city ? `, ${a.city}` : ""}</option>`)
      .join("");
  }

  // Expose for cart.js if needed
  window.APP.getCurrentUser = getCurrentUser;
  window.APP.loadAddresses = loadAddresses;
  window.APP.loadShippingMethods = loadShippingMethods;

  loginBtn?.addEventListener("click", async () => {
    const email = (emailInput?.value || "").trim();

    if (!email) {
      alert("Please enter email");
      return;
    }

    const res = await fetch(`${window.APP.API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    if (!res.ok) {
      const txt = await res.text();
      alert("Login failed: " + txt);
      return;
    }

    const user = await res.json();
    setCurrentUser(user);

    renderUserUI();
    await loadShippingMethods();
    await loadAddresses();

    alert("Logged in!");
  });

  logoutBtn?.addEventListener("click", () => {
    clearCurrentUser();
    renderUserUI();
    if (addressSelect) addressSelect.innerHTML = `<option value="">Login to see addresses</option>`;
    alert("Logged out");
  });

  (async function init() {
    renderUserUI();
    await loadShippingMethods();
    await loadAddresses();
  })();
})();
