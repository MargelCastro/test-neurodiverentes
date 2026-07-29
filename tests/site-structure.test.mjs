import assert from "node:assert/strict";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";
import { spawnSync } from "node:child_process";
import { docsRoot } from "./helpers/quiz-runtime.mjs";

function walk(directory, extension) {
  const files = [];

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(absolute, extension));
    } else if (!extension || entry.name.endsWith(extension)) {
      files.push(absolute);
    }
  }

  return files;
}

const htmlFiles = walk(docsRoot, ".html");
const jsFiles = walk(docsRoot, ".js");

test("todos los JavaScript tienen sintaxis válida", () => {
  for (const file of jsFiles) {
    const result = spawnSync(process.execPath, ["--check", file], {
      encoding: "utf8"
    });
    assert.equal(
      result.status,
      0,
      `${path.relative(docsRoot, file)}: ${result.stderr}`
    );
  }
});

test("todos los enlaces y recursos locales existen, incluidas sus anclas", () => {
  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, "utf8");

    for (const match of html.matchAll(
      /(?:href|src)=["']([^"'#?]+)(#[^"']+)?["']/gi
    )) {
      const reference = match[1];
      if (/^(?:https?:|mailto:|tel:|data:|javascript:|\/\/)/i.test(reference)) {
        continue;
      }

      const target = path.resolve(path.dirname(file), decodeURIComponent(reference));
      assert.ok(
        fs.existsSync(target),
        `${path.relative(docsRoot, file)} -> ${reference}`
      );

      if (match[2] && target.endsWith(".html")) {
        const targetHtml = fs.readFileSync(target, "utf8");
        const id = decodeURIComponent(match[2].slice(1));
        assert.match(
          targetHtml,
          new RegExp(`\\bid=["']${id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`),
          `${path.relative(docsRoot, file)} -> #${id}`
        );
      }
    }
  }
});

test("los scripts no se cargan dos veces y las dependencias compartidas cargan primero", () => {
  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, "utf8");
    const scripts = [...html.matchAll(/<script[^>]+src=["']([^"']+)/gi)].map(
      (match) => match[1]
    );
    assert.equal(
      new Set(scripts).size,
      scripts.length,
      `${path.relative(docsRoot, file)} contiene scripts duplicados`
    );
  }

  const quizPages = [
    [
      "TDA/Examenes/test-gratuito-de-tdah-para-adultos.html",
      "./adultos-tda-tdah.js"
    ],
    [
      "TDA/Examenes/test-gratuito-de-tdah-en-niños.html",
      "./child-tda-tdah.js"
    ]
  ];

  for (const [relativePath, quizScript] of quizPages) {
    const html = fs.readFileSync(path.join(docsRoot, relativePath), "utf8");
    assert.ok(
      html.indexOf("../../JS/shared/navigation.js") <
        html.indexOf(quizScript)
    );
    assert.ok(
      html.indexOf("../../JS/shared/test-accessibility.js") <
        html.indexOf(quizScript)
    );
    assert.ok(
      html.indexOf("../../JS/shared/test-storage.js") <
        html.indexOf(quizScript)
    );
  }
});

test("la navegación compartida es idempotente en ejecución", () => {
  const source = fs.readFileSync(
    path.join(docsRoot, "JS/shared/navigation.js"),
    "utf8"
  );
  let listenerCount = 0;
  const summary = {
    setAttribute() {}
  };
  const mobileMenu = {
    open: false,
    querySelector: () => summary,
    querySelectorAll: () => [],
    addEventListener: () => {
      listenerCount += 1;
    }
  };
  const context = vm.createContext({
    document: {
      documentElement: { dataset: {} },
      body: { classList: { toggle() {} } },
      querySelector(selector) {
        return selector === ".mobile-menu" ? mobileMenu : null;
      },
      addEventListener() {
        listenerCount += 1;
      }
    },
    window: {
      clearTimeout() {},
      matchMedia: () => ({
        matches: false,
        addEventListener() {
          listenerCount += 1;
        }
      })
    }
  });
  context.window.window = context.window;
  vm.runInContext(source, context);

  context.window.SiteNavigation.init();
  const firstInitializationListeners = listenerCount;
  context.window.SiteNavigation.init();

  assert.equal(listenerCount, firstInitializationListeners);
  assert.equal(
    context.document.documentElement.dataset.siteNavigationReady,
    "true"
  );
});

test("las utilidades accesibles controlan foco, Escape y movimiento reducido", () => {
  const source = fs.readFileSync(
    path.join(docsRoot, "JS/shared/test-accessibility.js"),
    "utf8"
  );
  const context = vm.createContext({
    document: { activeElement: null },
    window: {}
  });
  context.window.window = context.window;
  vm.runInContext(source, context);
  const accessibility = context.window.TestAccessibility;

  assert.equal(accessibility.getScrollBehavior({ matches: true }), "auto");
  assert.equal(accessibility.getScrollBehavior({ matches: false }), "smooth");

  let focusOptions;
  accessibility.focusElement({
    focus(options) {
      focusOptions = options;
    }
  });
  assert.equal(focusOptions.preventScroll, true);

  const first = {
    hasAttribute: () => false,
    focus: () => {
      context.document.activeElement = first;
    }
  };
  const last = {
    hasAttribute: () => false,
    focus: () => {
      context.document.activeElement = last;
    }
  };
  const dialog = { querySelectorAll: () => [first, last] };

  context.document.activeElement = last;
  let prevented = false;
  accessibility.handleDialogKeydown(
    {
      key: "Tab",
      shiftKey: false,
      preventDefault: () => {
        prevented = true;
      }
    },
    dialog,
    () => {}
  );
  assert.equal(prevented, true);
  assert.equal(context.document.activeElement, first);

  let closed = false;
  accessibility.handleDialogKeydown(
    { key: "Escape", preventDefault() {} },
    dialog,
    () => {
      closed = true;
    }
  );
  assert.equal(closed, true);
});

test("las páginas conservan requisitos responsive y de accesibilidad", () => {
  const css = fs.readFileSync(
    path.join(docsRoot, "styles/sistema-visual.css"),
    "utf8"
  );
  assert.match(css, /@media \(min-width: 1100px\)/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(css, /\.quiz-mobile-menu\[open\]/);
  assert.match(css, /max-height: calc\(100svh - var\(--quiz-site-header-height\)\)/);

  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, "utf8");
    assert.match(
      html,
      /<meta[^>]+name=["']viewport["']/i,
      path.relative(docsRoot, file)
    );
    assert.equal(
      (html.match(/<h1\b/gi) ?? []).length,
      1,
      `${path.relative(docsRoot, file)} debe tener un H1`
    );
  }

  for (const relativePath of [
    "TDA/Examenes/test-gratuito-de-tdah-para-adultos.html",
    "TDA/Examenes/test-gratuito-de-tdah-en-niños.html"
  ]) {
    const html = fs.readFileSync(path.join(docsRoot, relativePath), "utf8");
    assert.match(html, /role="progressbar"/);
    assert.match(html, /aria-live="polite"/);
    assert.match(html, /role="dialog"/);
    assert.match(html, /aria-modal="true"/);
    assert.match(html, /class="mobile-menu quiz-mobile-menu"/);
    assert.match(html, /class="quiz-desktop-nav"/);
  }
});

test("todos los recursos locales responden sin 404 por HTTP", async (t) => {
  const server = http.createServer((request, response) => {
    const requestPath = decodeURIComponent(
      new URL(request.url, "http://127.0.0.1").pathname
    );
    const relative = requestPath === "/" ? "index.html" : requestPath.slice(1);
    const target = path.resolve(docsRoot, relative);

    if (
      !target.startsWith(`${docsRoot}${path.sep}`) ||
      !fs.existsSync(target) ||
      !fs.statSync(target).isFile()
    ) {
      response.writeHead(404).end("Not found");
      return;
    }

    response.writeHead(200).end(fs.readFileSync(target));
  });

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => server.close());

  const { port } = server.address();
  const requested = new Set(["/"]);

  for (const file of htmlFiles) {
    const relativeHtml = path
      .relative(docsRoot, file)
      .split(path.sep)
      .join("/");
    requested.add(`/${encodeURI(relativeHtml)}`);
    const html = fs.readFileSync(file, "utf8");

    for (const match of html.matchAll(/(?:href|src)=["']([^"'#?]+)["']/gi)) {
      if (/^(?:https?:|mailto:|tel:|data:|javascript:|\/\/)/i.test(match[1])) {
        continue;
      }

      const target = path.resolve(path.dirname(file), decodeURIComponent(match[1]));
      if (target.startsWith(`${docsRoot}${path.sep}`) && fs.statSync(target).isFile()) {
        const relative = path.relative(docsRoot, target).split(path.sep).join("/");
        requested.add(`/${encodeURI(relative)}`);
      }
    }
  }

  for (const requestPath of requested) {
    const response = await fetch(`http://127.0.0.1:${port}${requestPath}`);
    assert.equal(response.status, 200, requestPath);
  }
});
