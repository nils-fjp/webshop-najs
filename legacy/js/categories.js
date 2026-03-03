// =============================================
// CATEGORIES.JS - Product Category Management
// =============================================

class CategoryManager {
  constructor() {
    this.currentCategory = "all";
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.showAllProducts();
  }

  setupEventListeners() {
    const categoryLinks = document.querySelectorAll("nav a[product-category]");

    categoryLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const category = link.dataset.category;
        this.filterByCategory(category);
        this.setActiveLink(link);
        this.scrollToProducts();
      });
    });
  }

  filterByCategory(category) {
    this.currentCategory = category;

    const products = document.querySelectorAll(".product-card");
    const categories = category.split(",");

    let visibleCount = 0;

    products.forEach((product) => {
      const productCategory = product.dataset.category;

      if (categories.includes("all") || categories.includes(productCategory)) {
        product.style.display = "grid";
        product.style.animation = "fadeIn 0.3s ease";
        visibleCount++;
      } else {
        product.style.display = "none";
      }
    });

    this.emitCategoryChange(category, visibleCount);
  }

  showAllProducts() {
    this.filterByCategory("all");
  }

  setActiveLink(activeLink) {
    const allLinks = document.querySelectorAll("nav a[product-category]");
    allLinks.forEach((link) => {
      link.classList.remove("active");
    });

    activeLink.classList.add("active");
  }

  setActiveLinksByCategory(category) {
    const allLinks = document.querySelectorAll("nav a[product-category]");
    const categories = category.split(",");

    allLinks.forEach((link) => {
      if (categories.includes(link.dataset.category)) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  scrollToProducts() {
    const productsSection = document.getElementById("products");
    if (!productsSection) {
      return;
    }

    const rect = productsSection.getBoundingClientRect();
    if (rect.top > 0) {
      const header = document.querySelector("header");
      const headerHeight = header ? header.offsetHeight : 0;
      const gap = parseFloat(getComputedStyle(productsSection).gap) || 0;
      const targetY = window.pageYOffset + rect.top - headerHeight - gap;
      window.scrollTo({ top: targetY, behavior: "smooth" });
    }
  }

  emitCategoryChange(category, count) {
    const event = new CustomEvent("categoryChanged", {
      detail: {
        category: category,
        productCount: count,
        timestamp: new Date(),
      },
    });
    document.dispatchEvent(event);
  }

  getCurrentCategory() {
    return this.currentCategory;
  }

  getProductCount(category = null) {
    const cat = category || this.currentCategory;

    if (cat === "all") {
      return document.querySelectorAll(".product-card").length;
    }

    return document.querySelectorAll(`.product-card[product-category="${cat}"]`)
      .length;
  }
}

// =============================================
// INITIALIZE WHEN DOM IS READY
// =============================================

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    window.CategoryManager = new CategoryManager();
  });
} else {
  window.CategoryManager = new CategoryManager();
}
