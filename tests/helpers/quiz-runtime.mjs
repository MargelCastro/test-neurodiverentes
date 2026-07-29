import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../.."
);
const docsRoot = path.join(projectRoot, "docs");

class FakeClassList {
  constructor(initial = "") {
    this.values = new Set(initial.split(/\s+/).filter(Boolean));
  }

  add(...names) {
    names.forEach((name) => this.values.add(name));
  }

  remove(...names) {
    names.forEach((name) => this.values.delete(name));
  }

  contains(name) {
    return this.values.has(name);
  }

  toggle(name, force) {
    const shouldAdd = force === undefined ? !this.contains(name) : Boolean(force);
    shouldAdd ? this.add(name) : this.remove(name);
    return shouldAdd;
  }

  toString() {
    return [...this.values].join(" ");
  }
}

class FakeElement {
  constructor(ownerDocument, tagName = "div", id = "", className = "") {
    this.ownerDocument = ownerDocument;
    this.tagName = tagName.toUpperCase();
    this.id = id;
    this.attributes = new Map();
    this.children = [];
    this.listeners = new Map();
    this.classList = new FakeClassList(className);
    this.style = {};
    this.dataset = {};
    this.disabled = false;
    this.open = false;
    this.tabIndex = 0;
    this.textContent = "";
    this.type = "";
    this._innerHTML = "";
    this.parentElement = null;
  }

  set className(value) {
    this.classList = new FakeClassList(value);
  }

  get className() {
    return this.classList.toString();
  }

  set innerHTML(value) {
    this._innerHTML = String(value);

    if (value === "") {
      this.children = [];
    }

    if (this.id === "result") {
      for (const match of this._innerHTML.matchAll(/\bid="([^"]+)"/g)) {
        if (!this.ownerDocument.getElementById(match[1])) {
          this.ownerDocument.register(
            new FakeElement(this.ownerDocument, "button", match[1])
          );
        }
      }
    }
  }

  get innerHTML() {
    return this._innerHTML;
  }

  addEventListener(type, listener) {
    const listeners = this.listeners.get(type) ?? [];
    listeners.push(listener);
    this.listeners.set(type, listeners);
  }

  dispatchEvent(event) {
    if (event.type === "click" && this.disabled) {
      return false;
    }

    event.target ??= this;
    event.currentTarget = this;
    event.preventDefault ??= () => {
      event.defaultPrevented = true;
    };

    for (const listener of this.listeners.get(event.type) ?? []) {
      listener.call(this, event);
    }

    return !event.defaultPrevented;
  }

  click() {
    return this.dispatchEvent({ type: "click" });
  }

  keydown(key, options = {}) {
    return this.dispatchEvent({
      type: "keydown",
      key,
      shiftKey: false,
      ...options
    });
  }

  appendChild(child) {
    child.parentElement = this;
    this.children.push(child);
    return child;
  }

  querySelector(selector) {
    if (selector === '[aria-checked="true"]') {
      return (
        this.children.find(
          (child) => child.getAttribute("aria-checked") === "true"
        ) ?? null
      );
    }

    if (selector === "summary") {
      return this.children.find((child) => child.tagName === "SUMMARY") ?? null;
    }

    return null;
  }

  querySelectorAll(selector) {
    if (selector === '[role="radio"]') {
      return this.children.filter(
        (child) => child.getAttribute("role") === "radio"
      );
    }

    if (selector === "a") {
      return this.children.filter((child) => child.tagName === "A");
    }

    return this.children.filter((child) => !child.hasAttribute("hidden"));
  }

  setAttribute(name, value) {
    this.attributes.set(name, String(value));
  }

  getAttribute(name) {
    return this.attributes.get(name) ?? null;
  }

  hasAttribute(name) {
    return this.attributes.has(name);
  }

  focus() {
    this.ownerDocument.activeElement = this;
  }

  scrollIntoView() {}

  contains(target) {
    if (target === this) {
      return true;
    }

    return this.children.some((child) => child.contains(target));
  }
}

class FakeDocument {
  constructor(html) {
    this.elements = new Map();
    this.listeners = new Map();
    this.documentElement = { dataset: {} };
    this.activeElement = null;

    const bodyTag = html.match(/<body\b([^>]*)>/i)?.[1] ?? "";
    const bodyClasses = bodyTag.match(/\bclass="([^"]*)"/i)?.[1] ?? "";
    this.body = new FakeElement(this, "body", "", bodyClasses);

    for (const match of html.matchAll(
      /<([a-z][\w-]*)\b([^>]*\bid="([^"]+)"[^>]*)>/gi
    )) {
      const className = match[2].match(/\bclass="([^"]*)"/i)?.[1] ?? "";
      this.register(new FakeElement(this, match[1], match[3], className));
    }
  }

  register(element) {
    if (element.id) {
      this.elements.set(element.id, element);
    }
    return element;
  }

  getElementById(id) {
    return this.elements.get(id) ?? null;
  }

  createElement(tagName) {
    return new FakeElement(this, tagName);
  }

  querySelector() {
    return null;
  }

  addEventListener(type, listener) {
    const listeners = this.listeners.get(type) ?? [];
    listeners.push(listener);
    this.listeners.set(type, listeners);
  }
}

class FakeStorage {
  constructor(seed = {}) {
    this.values = new Map(
      Object.entries(seed).map(([key, value]) => [key, String(value)])
    );
  }

  getItem(key) {
    return this.values.get(key) ?? null;
  }

  setItem(key, value) {
    this.values.set(key, String(value));
  }

  removeItem(key) {
    this.values.delete(key);
  }

  snapshot() {
    return Object.fromEntries(this.values);
  }
}

function read(relativePath) {
  return fs.readFileSync(path.join(docsRoot, relativePath), "utf8");
}

export function createQuizRuntime({
  type,
  desktop = false,
  storageSeed = {}
}) {
  const isAdult = type === "adult";
  const htmlPath = isAdult
    ? "TDA/Examenes/test-gratuito-de-tdah-para-adultos.html"
    : "TDA/Examenes/test-gratuito-de-tdah-en-niños.html";
  const scriptPath = isAdult
    ? "TDA/Examenes/adultos-tda-tdah.js"
    : "TDA/Examenes/child-tda-tdah.js";
  const document = new FakeDocument(read(htmlPath));
  const localStorage = new FakeStorage(storageSeed);
  const consoleMessages = [];
  const mediaListeners = [];

  const matchMedia = (query) => {
    const media = {
      media: query,
      matches: query.includes("min-width: 1024px") ? desktop : false,
      addEventListener(_type, listener) {
        mediaListeners.push(listener);
      },
      addListener(listener) {
        mediaListeners.push(listener);
      }
    };
    return media;
  };

  const window = {
    SiteNavigation: null,
    TestAccessibility: null,
    TestStorage: null,
    confirm: () => true,
    localStorage,
    location: { href: "" },
    matchMedia,
    scrollTo() {},
    setTimeout,
    clearTimeout
  };
  window.window = window;

  const context = vm.createContext({
    console: {
      log: (...args) => consoleMessages.push(["log", ...args]),
      warn: (...args) => consoleMessages.push(["warn", ...args]),
      error: (...args) => consoleMessages.push(["error", ...args])
    },
    document,
    HTMLElement: FakeElement,
    localStorage,
    requestAnimationFrame: (callback) => callback(),
    setTimeout,
    clearTimeout,
    window
  });

  vm.runInContext(read("JS/shared/navigation.js"), context, {
    filename: "navigation.js"
  });
  vm.runInContext(read("JS/shared/test-accessibility.js"), context, {
    filename: "test-accessibility.js"
  });
  vm.runInContext(read("JS/shared/test-storage.js"), context, {
    filename: "test-storage.js"
  });
  vm.runInContext(read(scriptPath), context, {
    filename: path.basename(scriptPath)
  });

  return {
    context,
    document,
    localStorage,
    consoleMessages,
    elements: Object.fromEntries(document.elements),
    answerCurrent(optionIndex) {
      const options = document.getElementById("options");
      options.children[optionIndex].click();
    },
    next() {
      document.getElementById("nextBtn").click();
    },
    showChildResults() {
      document.getElementById("viewResultsBtn")?.click();
    },
    closeGuardianNotice() {
      document.getElementById("closeGuardianDisclaimer")?.click();
    }
  };
}

export { docsRoot, projectRoot };
