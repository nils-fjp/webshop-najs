// =============================================
// NAV.JS - Mobile Navigation Toggle
// =============================================

document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector("#hamburger");
  const navList = document.getElementById("nav-list");

  if (!hamburger || !navList) {
    return;
  }

  hamburger.addEventListener("click", () => {
    navList.classList.toggle("active");
  });

  const navItems = navList.querySelectorAll("a");

  navItems.forEach((link) => {
    link.addEventListener("click", () => {
      if (navList.classList.contains("active")) {
        navList.classList.remove("active");
      }
    });
  });
});
