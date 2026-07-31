window.SiteNavigation.init();

const comparisonTable = document.querySelector("[data-comparison]");
const comparisonButtons = document.querySelectorAll("[data-comparison-button]");

if (comparisonTable && comparisonButtons.length) {
  comparisonButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const audience = button.dataset.comparisonButton;
      comparisonTable.dataset.comparisonActive = audience;

      comparisonButtons.forEach((control) => {
        control.setAttribute(
          "aria-pressed",
          String(control.dataset.comparisonButton === audience),
        );
      });
    });
  });
}
