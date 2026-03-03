const API_BASE = "http://localhost:3007";

const categoriesSide = document.getElementById("categoriesSide");
const grid = document.getElementById("productsGrid");
const pageTitle = document.getElementById("pageTitle");

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const clearBtn = document.getElementById("clearBtn");

// Estado de filtros
let activeCategoryName = ""; // "" = All
let searchTerm = "";

// 1) Card (usa tus columnas reales)
function renderProductCard(p) {
  return `
    <article class="card">
      <h3>${p.product_name ?? "Unnamed"}</h3>
      <p><strong>${Number(p.listing_price ?? 0).toFixed(2)} kr</strong></p>
      ${p.product_description ? `<p>${p.product_description}</p>` : ""}
      <small>Stock: ${p.stock_quantity ?? 0}</small>
    </article>
  `;
}

// 2) Render categoría
function renderCategoryItem(name, isActive = false) {
  const label = name || "All";
  return `
    <button class="catItem ${isActive ? "active" : ""}" data-name="${name}">
      <span>${label}</span>
      <span>›</span>
    </button>
  `;
}

// 3) Cargar categorías sidebar
async function loadCategoriesSidebar() {
  const res = await fetch(`${API_BASE}/categories`);
  if (!res.ok) {
    categoriesSide.innerHTML = `<p>Error loading categories</p>`;
    return;
  }

  const categories = await res.json();

  categoriesSide.innerHTML =
    renderCategoryItem("", true) +
    categories.map(c => renderCategoryItem(c.category_name)).join("");
}

// 4) Esta es la función MÁS importante: recarga según filtros
async function reloadProducts() {
  // Título
  pageTitle.textContent = activeCategoryName || "All products";

  let products = [];

  if (!activeCategoryName) {
    // ✅ All: usamos backend search real: /products?search=
    const url = new URL(`${API_BASE}/products`);
    if (searchTerm) url.searchParams.set("search", searchTerm);

    const res = await fetch(url);
    if (!res.ok) {
      grid.innerHTML = `<p>Error loading products (${res.status})</p>`;
      return;
    }
    products = await res.json();
  } else {
    // ✅ Category: tu endpoint actual NO soporta ?search (todavía)
    // Entonces hacemos: 1) traer productos de esa categoría 2) filtrar en frontend
    const url = `${API_BASE}/categories/${encodeURIComponent(activeCategoryName)}`;
    const res = await fetch(url);

    if (!res.ok) {
      grid.innerHTML = `<p>Error loading category products (${res.status})</p>`;
      return;
    }

    products = await res.json();

    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      products = products.filter(p =>
        (p.product_name ?? "").toLowerCase().includes(s)
      );
    }
  }

  // Pintar
  if (!products.length) {
    grid.innerHTML = `<p>No products found.</p>`;
    return;
  }

  grid.innerHTML = products.map(renderProductCard).join("");
}

// 5) Click categoría
categoriesSide.addEventListener("click", (e) => {
  const btn = e.target.closest(".catItem");
  if (!btn) return;

  document.querySelectorAll(".catItem").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");

  activeCategoryName = btn.dataset.name; // "" => All
  reloadProducts();
});

// 6) Search handlers
function runSearch() {
  searchTerm = searchInput.value.trim();
  reloadProducts();
}

searchBtn.addEventListener("click", runSearch);
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") runSearch();
});

clearBtn.addEventListener("click", () => {
  searchInput.value = "";
  searchTerm = "";
  reloadProducts();
});

// init
(async function init() {
  await loadCategoriesSidebar();
  await reloadProducts();
})();