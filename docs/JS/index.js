window.SiteNavigation.init();

const mobileContentMedia = window.matchMedia("(max-width: 899px)");
const mobileAccordionSections = document.querySelectorAll("[data-mobile-accordion]");

mobileAccordionSections.forEach((section, index) => {
  const title = section.querySelector(":scope > .section-title");

  if (!title) {
    return;
  }

  const button = document.createElement("button");
  const panel = document.createElement("div");
  const buttonId = `mobile-section-toggle-${index + 1}`;
  const panelId = `mobile-section-panel-${index + 1}`;

  button.type = "button";
  button.id = buttonId;
  button.className = "mobile-section-toggle";
  button.setAttribute("aria-controls", panelId);

  panel.id = panelId;
  panel.className = "mobile-section-panel";
  panel.setAttribute("aria-labelledby", buttonId);

  while (title.nextSibling) {
    panel.appendChild(title.nextSibling);
  }

  title.insertAdjacentElement("afterend", button);
  button.insertAdjacentElement("afterend", panel);

  const setExpanded = (expanded) => {
    button.setAttribute("aria-expanded", String(expanded));
    button.textContent = expanded ? "Ocultar esta sección" : "Leer esta sección";
    button.setAttribute(
      "aria-label",
      `${expanded ? "Ocultar" : "Mostrar"}: ${title.textContent.trim()}`
    );
    panel.hidden = !expanded;
  };

  button.addEventListener("click", () => {
    setExpanded(button.getAttribute("aria-expanded") !== "true");
  });

  const syncSection = () => {
    setExpanded(!mobileContentMedia.matches);
  };

  syncSection();

  if (mobileContentMedia.addEventListener) {
    mobileContentMedia.addEventListener("change", syncSection);
  } else {
    mobileContentMedia.addListener(syncSection);
  }
});

const faqSection = document.getElementById("faq");

if (faqSection) {
  const faqItems = Array.from(faqSection.children).filter((child) =>
    child.matches(".faq-item")
  );
  const visibleFaqCount = 8;

  if (faqItems.length > visibleFaqCount) {
    const moreFaqItems = faqItems.slice(visibleFaqCount);
    const morePanel = document.createElement("div");
    const moreButton = document.createElement("button");

    morePanel.id = "faq-more-panel";
    morePanel.className = "faq-more-panel";
    morePanel.setAttribute("aria-labelledby", "faq-more-toggle");

    moreFaqItems.forEach((item) => {
      morePanel.appendChild(item);
    });

    moreButton.type = "button";
    moreButton.id = "faq-more-toggle";
    moreButton.className = "faq-more-toggle";
    moreButton.setAttribute("aria-controls", morePanel.id);

    faqSection.appendChild(moreButton);
    faqSection.appendChild(morePanel);

    const setFaqExpanded = (expanded) => {
      moreButton.setAttribute("aria-expanded", String(expanded));
      moreButton.textContent = expanded
        ? "Mostrar menos preguntas"
        : `Ver ${moreFaqItems.length} preguntas más`;
      morePanel.hidden = !expanded;

      if (!expanded) {
        morePanel.querySelectorAll("details[open]").forEach((item) => {
          item.open = false;
        });
      }
    };

    moreButton.addEventListener("click", () => {
      setFaqExpanded(moreButton.getAttribute("aria-expanded") !== "true");
    });

    const syncFaq = () => {
      setFaqExpanded(!mobileContentMedia.matches);
    };

    syncFaq();

    if (mobileContentMedia.addEventListener) {
      mobileContentMedia.addEventListener("change", syncFaq);
    } else {
      mobileContentMedia.addListener(syncFaq);
    }
  }
}
