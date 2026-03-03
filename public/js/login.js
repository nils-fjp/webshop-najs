const API = "http://localhost:3007";

const loginBtn = document.getElementById("loginBtn");
const loginStatus = document.getElementById("loginStatus");
const emailInput = document.getElementById("email");

const addressSelect = document.getElementById("addressSelect");
const shippingSelect = document.getElementById("shippingSelect");

function setCurrentUser(user) {
  localStorage.setItem("currentUser", JSON.stringify(user));
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser") || "null");
}

loginBtn.onclick = async () => {
  const email = emailInput.value.trim();
  if (!email) return alert("Enter an email");

  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  });

  if (!res.ok) {
    loginStatus.textContent = "Login failed";
    return;
  }

  const user = await res.json();
  setCurrentUser(user);

  loginStatus.textContent = `Logged in as ${user.first_name} ${user.last_name}`;

  await loadAddresses(user.customer_id);
  await loadShippingMethods();
};

async function loadAddresses(customer_id) {
  const res = await fetch(`${API}/customers/${customer_id}/addresses`);
  const addresses = await res.json();

  addressSelect.innerHTML = addresses.map(a => `
    <option value="${a.address_id}">
      ${a.street_address}, ${a.city}
    </option>
  `).join("");
}

async function loadShippingMethods() {
  const res = await fetch(`${API}/shipping-methods`);
  const methods = await res.json();

  shippingSelect.innerHTML = methods.map(m => `
    <option value="${m.shipping_methods_id}">
      ${m.method_name} (${m.price} kr)
    </option>
  `).join("");
}