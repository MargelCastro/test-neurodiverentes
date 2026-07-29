(function () {
  "use strict";

  function getScrollBehavior(reducedMotionQuery) {
    return reducedMotionQuery.matches ? "auto" : "smooth";
  }

  function focusElement(element) {
    element.focus({ preventScroll: true });
  }

  function focusableElements(container) {
    return Array.from(
      container.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter((element) => !element.hasAttribute("hidden"));
  }

  function handleDialogKeydown(event, dialog, closeDialog) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeDialog();
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    const focusable = focusableElements(dialog);

    if (!focusable.length) {
      event.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  window.TestAccessibility = Object.freeze({
    focusElement,
    getScrollBehavior,
    handleDialogKeydown
  });
})();
