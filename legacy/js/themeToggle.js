const toggle = document.getElementById("theme");
const body = document.body;

// Initialize theme based on localStorage or system preference
function initializeTheme() {
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (savedTheme === "light") {
    body.classList.add("light-mode");
    updateToggleButton(true);
  } else if (savedTheme === "dark") {
    body.classList.remove("light-mode");
    updateToggleButton(false);
  } else if (prefersDark) {
    body.classList.remove("light-mode");
    updateToggleButton(false);
  } else {
    // Default to light mode
    body.classList.add("light-mode");
    updateToggleButton(true);
  }
}

// Update toggle button text and aria-label based on current mode
function updateToggleButton(isLightMode) {
  if (isLightMode) {
    toggle.textContent = "🌙";
    toggle.setAttribute("aria-label", "Toggle dark mode");
    toggle.setAttribute("title", "Toggle dark mode");
  } else {
    toggle.textContent = "☀️";
    toggle.setAttribute("aria-label", "Toggle light mode");
    toggle.setAttribute("title", "Toggle light mode");
  }
}

toggle.addEventListener("click", () => {
  const isLightMode = body.classList.toggle("light-mode");
  updateToggleButton(isLightMode);

  localStorage.setItem("theme", isLightMode ? "light" : "dark");
});

// Initialize theme on page load
initializeTheme();
