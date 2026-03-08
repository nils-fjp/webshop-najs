// product-card.js (categories + search + add to cart)
// Requires: shared.js, #categoriesSide, #productsGrid, #pageTitle, #searchInput, #searchBtn, #clearBtn

(function () {
  const categoriesSide = document.getElementById("categoriesSide");
  const grid = document.getElementById("productsGrid");
  const pageTitle = document.getElementById("pageTitle");

  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
  const clearBtn = document.getElementById("clearBtn");

  // If something critical is missing, fail gracefully
  if (!categoriesSide || !grid || !pageTitle) return;

  let activeCategoryName = ""; // "" = All
  let searchTerm = "";
  let lastRenderedProducts = [];

  // ---- CART ----
  function addToCart(product) {
    const cart = window.APP.getCart();
    const existing = cart.find((i) => i.product_id === product.product_id);

    if (existing) existing.qty += 1;
    else {
      cart.push({
        product_id: product.product_id,
        product_name: product.product_name,
        listing_price: Number(product.listing_price || 0),
        qty: 1
      });
    }

    window.APP.saveCart(cart);
    if (window.APP.renderCart) window.APP.renderCart();
    alert("Added to cart!");
  }

  // ---- UI ----
  function renderProductCard(p) {
    return `
      <article class="card">
        <h3>${p.product_name ?? "Unnamed"}</h3>
        <p><strong>${Number(p.listing_price ?? 0).toFixed(2)} kr</strong></p>
        ${p.product_description ? `<p>${p.product_description}</p>` : ""}
        <small>Stock: ${p.stock_quantity ?? 0}</small><br/>
        <button class="addBtn" data-id="${p.product_id}">Add to cart</button>
      </article>
    `;
  }

  function renderCategoryItem(name, isActive = false) {
    const label = name || "All";
    return `
      <button class="catItem ${isActive ? "active" : ""}" data-name="${name}">
        <span>${label}</span>
        <span>›</span>
      </button>
    `;
  }

  async function loadCategoriesSidebar() {
    const res = await fetch(`${window.APP.API_URL}/categories`);
    if (!res.ok) {
      categoriesSide.innerHTML = `<p>Error loading categories</p>`;
      return;
    }

    const categories = await res.json();
    categoriesSide.innerHTML =
      renderCategoryItem("", true) +
      categories.map((c) => renderCategoryItem(c.category_name)).join("");
  }

  async function reloadProducts() {
    pageTitle.textContent = activeCategoryName || "All products";

    let products = [];

    if (!activeCategoryName) {
      const url = new URL(`${window.APP.API_URL}/products`);
      if (searchTerm) url.searchParams.set("search", searchTerm);
      const res = await fetch(url);
      if (!res.ok) return (grid.innerHTML = `<p>Error loading products (${res.status})</p>`);
      products = await res.json();
    } else {
      const url = `${window.APP.API_URL}/categories/${encodeURIComponent(activeCategoryName)}`;
      const res = await fetch(url);
      if (!res.ok) return (grid.innerHTML = `<p>Error loading category products (${res.status})</p>`);
      products = await res.json();
      if (searchTerm) {
        const s = searchTerm.toLowerCase();
        products = products.filter((p) => (p.product_name ?? "").toLowerCase().includes(s));
      }
    }

    lastRenderedProducts = products;

    if (!products.length) {
      grid.innerHTML = `<p>No products found.</p>`;
      return;
    }

    grid.innerHTML = products.map(renderProductCard).join("");
  }

  // ---- Events ----
  categoriesSide.addEventListener("click", (e) => {
    const btn = e.target.closest(".catItem");
    if (!btn) return;

    document.querySelectorAll(".catItem").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    activeCategoryName = btn.dataset.name || "";
    reloadProducts();
  });

  function runSearch() {
    searchTerm = (searchInput?.value || "").trim();
    reloadProducts();
  }

  searchBtn?.addEventListener("click", runSearch);
  searchInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") runSearch();
  });

  clearBtn?.addEventListener("click", () => {
    if (searchInput) searchInput.value = "";
    searchTerm = "";
    reloadProducts();
  });

  grid.addEventListener("click", (e) => {
    const btn = e.target.closest(".addBtn");
    if (!btn) return;

    const id = Number(btn.dataset.id);
    const product = lastRenderedProducts.find((p) => Number(p.product_id) === id);
    if (!product) return;

    addToCart(product);
  });

  // ---- init ----
  (async function init() {
    await loadCategoriesSidebar();
    await reloadProducts();
  })();
})();
