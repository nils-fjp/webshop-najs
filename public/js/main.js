// =============================================
// MAIN.JS - Application Entry Point
// =============================================

const App = {
  modules: {
    cart: null,
    navigation: null,
    categories: null,
    carousel: null,
  },

  // =========================================
  // INITIALIZATION
  // =========================================

  init() {
    this.initCart();
    this.initNavigation();
    this.initCategories();
    this.initCarousel();
    this.initProductImages();
    this.setupGlobalEvents();
  },

  // =========================================
  // MODULE INITIALIZATION
  // =========================================

  initCart() {
    if (window.myCart) {
      this.modules.cart = window.myCart;
    }
  },

  initNavigation() {
    const hamburger = document.getElementById("hamburger");
    if (hamburger) {
      this.modules.navigation = {
        hamburger: hamburger,
        isActive: false,
      };
    }
  },

  initCategories() {
    if (window.CategoryManager) {
      this.modules.categories = window.CategoryManager;
    }
  },

  initProductImages() {
    const images = document.querySelectorAll(".product-image img");

    if (images.length === 0) {
      return;
    }

    images.forEach((img) => {
      const wrapper = img.closest(".product-image");

      if (!wrapper) {
        return;
      }

      const markLoaded = () => {
        wrapper.classList.add("is-loaded");
      };

      if (img.complete && img.naturalWidth > 0) {
        markLoaded();
        return;
      }

      img.addEventListener("load", markLoaded, { once: true });
      img.addEventListener("error", markLoaded, { once: true });
    });
  },

  // =========================================
  // GLOBAL EVENT HANDLERS
  // =========================================

  setupGlobalEvents() {
    window.addEventListener("error", (e) => {
      console.error("[Neon Market] Global error:", e.error);
    });

    this.setupBackToTop();
  },

  // =========================================
  // BACK TO TOP
  // =========================================

  setupBackToTop() {
    const backToTopBtn = document.getElementById("backToTop");

    if (!backToTopBtn) {
      return;
    }

    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 300) {
        backToTopBtn.classList.add("visible");
      } else {
        backToTopBtn.classList.remove("visible");
      }
    });

    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  },
};

// =============================================
// APPLICATION STARTUP
// =============================================

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    App.init();
  });
} else {
  App.init();
}

window.NeonMarket = App;
