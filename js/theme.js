document.addEventListener("DOMContentLoaded", () => {
  const savedSettings = JSON.parse(localStorage.getItem("userSettings"));
  const theme = savedSettings?.theme || "light"; // default to light
  applyTheme(theme);
});

function applyTheme(theme) {
  document.body.classList.remove("light-theme", "dark-theme");
  document.body.classList.add(`${theme}-theme`);
}
