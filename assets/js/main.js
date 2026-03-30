(function () {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  const path = window.location.pathname.toLowerCase();
  const navMap = [
    { key: "home", match: /(?:^|\/)index\.html$|\/$/ },
    { key: "about", match: /about\.html$/ },
    { key: "notes", match: /notes\.html$|note\.html$|\/notes\// }
  ];

  for (const item of navMap) {
    if (item.match.test(path)) {
      const activeLink = document.querySelector(`[data-nav="${item.key}"]`);
      if (activeLink) {
        activeLink.setAttribute("aria-current", "page");
      }
      break;
    }
  }

  const toggleBtn = document.getElementById("menuToggle");
  const nav = document.getElementById("siteNav");
  if (toggleBtn && nav) {
    toggleBtn.addEventListener("click", function () {
      const opened = nav.getAttribute("data-open") === "true";
      nav.setAttribute("data-open", opened ? "false" : "true");
      toggleBtn.setAttribute("aria-expanded", opened ? "false" : "true");
    });
  }
})();
