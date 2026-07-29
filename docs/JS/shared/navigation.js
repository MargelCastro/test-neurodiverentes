(function () {
  "use strict";

  function init() {
    if (document.documentElement.dataset.siteNavigationReady === "true") {
      return;
    }

    document.documentElement.dataset.siteNavigationReady = "true";

    const mobileMenu = document.querySelector(".mobile-menu");
    const desktopNavGroup = document.querySelector(".nav-group");

    if (desktopNavGroup) {
      let desktopMenuCloseTimer;

      const cancelDesktopMenuClose = () => {
        window.clearTimeout(desktopMenuCloseTimer);
      };

      const closeDesktopMenu = () => {
        cancelDesktopMenuClose();
        desktopNavGroup.open = false;
      };

      const scheduleDesktopMenuClose = () => {
        cancelDesktopMenuClose();
        desktopMenuCloseTimer = window.setTimeout(closeDesktopMenu, 350);
      };

      desktopNavGroup.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeDesktopMenu);
      });

      desktopNavGroup.addEventListener("pointerenter", cancelDesktopMenuClose);
      desktopNavGroup.addEventListener("pointerleave", scheduleDesktopMenuClose);
      desktopNavGroup.addEventListener("focusout", (event) => {
        if (!desktopNavGroup.contains(event.relatedTarget)) {
          closeDesktopMenu();
        }
      });

      document.addEventListener("click", (event) => {
        if (!desktopNavGroup.contains(event.target)) {
          closeDesktopMenu();
        }
      });
    }

    if (mobileMenu) {
      const mobileMenuTrigger = mobileMenu.querySelector("summary");

      const syncMenuState = () => {
        const isOpen = mobileMenu.open;
        document.body.classList.toggle("menu-open", isOpen);

        if (mobileMenuTrigger) {
          mobileMenuTrigger.setAttribute(
            "aria-label",
            isOpen ? "Cerrar menú" : "Abrir menú"
          );
        }
      };

      const closeMenu = () => {
        mobileMenu.open = false;
        syncMenuState();
      };

      mobileMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
      });

      mobileMenu.addEventListener("toggle", syncMenuState);

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && mobileMenu.open) {
          closeMenu();
        }
      });

      const desktopMedia = window.matchMedia("(min-width: 1280px)");
      const syncMenu = () => {
        if (desktopMedia.matches) {
          closeMenu();
        } else {
          syncMenuState();
        }
      };

      syncMenu();

      if (desktopMedia.addEventListener) {
        desktopMedia.addEventListener("change", syncMenu);
      } else {
        desktopMedia.addListener(syncMenu);
      }
    }
  }

  window.SiteNavigation = Object.freeze({ init });
})();
