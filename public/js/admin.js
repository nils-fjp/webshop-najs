// public/js/admin.js
// applies to public/index.html, previously written inside <script> tag in body on test page

// dynamically build request target from input field values and optional url params
const makeUrl = (urlParams) =>
  `http://localhost:${port.value}/${endpoint.value}${urlParams ?? ""}`;

// make table headers from data keys and paste values into rows and columns
const renderTable = (data) =>
  (table.innerHTML =
    // Kontrollera om data är tom
    data?.length ?
      `<tr>${Object.keys(data[0]).map((fieldName) => `<td><b>${fieldName}</b></td>`).join``}</tr>
              ${data.map(
                (dataRow) =>
                  `<tr>${Object.values(dataRow).map((dataCell) => `<td>${dataCell}</td>`).join``}</tr>`,
              ).join``}`
    : "<tr><td>Inga matchande artiklar</td></tr>");

getBtn.addEventListener(
  "click",
  async (event) => (
    event.preventDefault(),
    renderTable(await fetch(makeUrl()).then((response) => response.json()))
  ),
);
searchField.addEventListener("input", async () =>
  renderTable(
    await fetch(makeUrl(`?search=${searchField.value}`)).then((response) =>
      response.json(),
    ),
  ),
);

/* ////////////////////////////////////////////////////////////////() */

const addProduct = () => {
  const container = document.getElementById("productsContainer");
  const productRow = document.createElement("div");
  productRow.className = "product-row";
  productRow.style = "display:flex; gap: 10px;";
  productRow.innerHTML = `
        <label>Product ID: <input type="number" name="product_id" required /></label>
        <label>Quantity: <input type="number" name="product_quantity" min="1" required /></label>
        <div style="display:flex; align-items:flex-end;">
          <button type="button" onclick="removeProduct(this)" style="color:red;">✕</button>
        </div>
      `;
  container.appendChild(productRow);
};

const removeProduct = (removeBtn) => {
  const productRows = document.querySelectorAll(".product-row");
  if (productRows?.length > 1) {
    removeBtn.closest(".product-row").remove();
  } else {
    alert("At least one product is required.");
  }
};

submitBtn.addEventListener("click", (event) => {
  event.preventDefault();

  // Hämtar de tre huvud-fälten
  const customer_id = parseInt(document.getElementById("customer_id").value);
  const shipping_address_id = parseInt(
    document.getElementById("shipping_address_id").value,
  );
  const shipping_method_id = parseInt(
    document.getElementById("shipping_method_id").value,
  );

  // Samlar ihop alla produktrader till order_items
  const productRows = document.querySelectorAll(".product-row");
  const order_items = [];

  productRows.forEach((productRow) => {
    const inputs = productRow.querySelectorAll("input");
    if (inputs[0].value && inputs[1].value) {
      order_items.push({
        product_id: parseInt(inputs[0].value),
        product_quantity: parseInt(inputs[1].value),
      });
    }
  });

  // Bygger upp JSON-objektet
  const order = {
    customer_id,
    shipping_address_id,
    shipping_method_id,
    order_items,
  };

  console.log("Submitting order:", order);

  // Använder port ~~och endpoint~~ från sidan, precis som GET-anropen
  fetch(`http://localhost:${port.value}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order),
  })
    .then((res) => {
      if (!res.ok) {
        return res.json().then((errData) => {
          throw new Error(errData.error || `Server error: ${res.status}`);
        });
      }
      return res.json();
    })
    .then((data) => {
      console.log("Success:", data);
      alert(`Order created successfully (order_id: ${data.order_id})`);
    })
    .catch((err) => {
      console.error("Error:", err);
      alert(`Failed to create order: ${err.message}`);
    });
});
