// shared.js – gemensamma hjälpfunktioner (laddas efter config.js)
// Ger cart- och user-helpers på window.APP som övriga scripts använder.

// ---- Cart helpers ----

window.APP.getCart = function () {
  try {
    return JSON.parse(localStorage.getItem(window.APP.CART_KEY)) || [];
  } catch {
    return [];
  }
};

window.APP.saveCart = function (cart) {
  localStorage.setItem(window.APP.CART_KEY, JSON.stringify(cart));
};

window.APP.clearCart = function () {
  window.APP.saveCart([]);
};

window.APP.getCartTotals = function () {
  const cart = window.APP.getCart();
  const itemsCount = cart.reduce((sum, i) => sum + i.qty, 0);
  const total = cart.reduce((sum, i) => sum + i.qty * i.listing_price, 0);
  return { itemsCount, total };
};

// ---- User helpers ----

window.APP.getCurrentUser = function () {
  try {
    return JSON.parse(localStorage.getItem(window.APP.CURRENT_USER_KEY) || "null");
  } catch {
    return null;
  }
};

window.APP.setCurrentUser = function (user) {
  localStorage.setItem(window.APP.CURRENT_USER_KEY, JSON.stringify(user));
};

window.APP.clearCurrentUser = function () {
  localStorage.removeItem(window.APP.CURRENT_USER_KEY);
};
