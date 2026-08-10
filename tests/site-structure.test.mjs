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

function getAttribute(tag, attribute) {
  return tag.match(new RegExp(`\\b${attribute}=["']([^"']*)["']`, "i"))?.[1] ?? "";
}

test("las páginas indexables tienen metadatos únicos y coinciden con el sitemap", () => {
  const indexableCanonicals = [];

  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, "utf8");
    const relativePath = path.relative(docsRoot, file);
    const robotsTag = html.match(/<meta\b[^>]*\bname=["']robots["'][^>]*>/i)?.[0] ?? "";
    const isIndexable = !/noindex/i.test(getAttribute(robotsTag, "content"));

    assert.match(html, /<title>\s*[^<]+\s*<\/title>/i, `${relativePath}: title`);
    assert.equal(
      (html.match(/<h1\b/gi) ?? []).length,
      1,
      `${relativePath}: debe tener un único H1`
    );

    if (!isIndexable) continue;

    const descriptionTag =
      html.match(/<meta\b[^>]*\bname=["']description["'][^>]*>/i)?.[0] ?? "";
    const canonicalTag =
      html.match(/<link\b[^>]*\brel=["']canonical["'][^>]*>/i)?.[0] ?? "";
    const description = getAttribute(descriptionTag, "content").trim();
    const canonical = getAttribute(canonicalTag, "href").trim();

    assert.ok(description, `${relativePath}: meta description`);
    assert.match(
      canonical,
      /^https:\/\/testneurodivergentes\.com\//,
      `${relativePath}: canonical absoluto`
    );
    indexableCanonicals.push(canonical);
  }

  assert.equal(
    new Set(indexableCanonicals).size,
    indexableCanonicals.length,
    "los canonicals indexables deben ser únicos"
  );

  const sitemap = fs.readFileSync(path.join(docsRoot, "sitemap.xml"), "utf8");
  const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (match) => match[1].trim()
  );

  assert.deepEqual(
    [...sitemapUrls].sort(),
    [...indexableCanonicals].sort(),
    "el sitemap debe contener exactamente las páginas indexables"
  );
});

test("las imágenes y elementos interactivos conservan requisitos básicos de accesibilidad", () => {
  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, "utf8");
    const relativePath = path.relative(docsRoot, file);
    const ids = [...html.matchAll(/\bid=["']([^"']+)["']/gi)].map(
      (match) => match[1]
    );

    assert.equal(new Set(ids).size, ids.length, `${relativePath}: ids duplicados`);

    for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
      const image = match[0];
      assert.match(image, /\balt=["'][^"']*["']/i, `${relativePath}: imagen sin alt`);
      assert.match(image, /\bwidth=["']\d+["']/i, `${relativePath}: imagen sin width`);
      assert.match(image, /\bheight=["']\d+["']/i, `${relativePath}: imagen sin height`);
    }

    for (const match of html.matchAll(/<a\b[^>]*\btarget=["']_blank["'][^>]*>/gi)) {
      const rel = getAttribute(match[0], "rel");
      assert.match(rel, /\b(?:noopener|noreferrer)\b/i, `${relativePath}: enlace externo inseguro`);
    }
  }
});

test("todos los HTML enlazan las páginas de confianza desde el footer", () => {
  const requiredInformationPages = [
    "quienes-somos.html",
    "metodologia-de-los-cuestionarios.html",
    "contacto.html",
    "politica-de-privacidad.html"
  ];

  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, "utf8");
    const footer = html.match(/<footer\b[\s\S]*?<\/footer>/i)?.[0] ?? "";

    for (const informationPage of requiredInformationPages) {
      assert.match(
        footer,
        new RegExp(`href=["'][^"']*${informationPage.replaceAll(".", "\\.")}["']`, "i"),
        `${path.relative(docsRoot, file)} -> ${informationPage}`
      );
    }
  }
});

test("las páginas editoriales identifican autoría, fechas y metodología", () => {
  for (const relativePath of ["index.html", "TDA/que-es-el-tdah.html"]) {
    const html = fs.readFileSync(path.join(docsRoot, relativePath), "utf8");
    assert.match(html, /Margel Gabriel Castro/);
    assert.match(html, /desarrollador full stack/i);
    assert.match(html, /Publicado:/);
    assert.match(html, /Actualizado:/);
    assert.match(html, /rel="author"/);
    assert.match(html, /metodologia-de-los-cuestionarios\.html/);
  }
});

test("la metodología documenta el cálculo real y sus límites", () => {
  const html = fs.readFileSync(
    path.join(docsRoot, "metodologia-de-los-cuestionarios.html"),
    "utf8"
  );

  assert.match(html, /100 preguntas/);
  assert.match(html, /60 preguntas/);
  assert.match(html, /400 puntos/);
  assert.match(html, /240/);
  assert.match(html, /0 a 35/);
  assert.match(html, /36 a 45/);
  assert.match(html, /46 a 60/);
  assert.match(html, /61 a 100/);
  assert.match(html, /no cuentan con validación clínica publicada/i);
  assert.match(html, /No son puntos\s+de corte clínicos/i);
});

test("el sitemap incluye las páginas de confianza indexables", () => {
  const sitemap = fs.readFileSync(path.join(docsRoot, "sitemap.xml"), "utf8");

  for (const relativePath of [
    "quienes-somos.html",
    "metodologia-de-los-cuestionarios.html",
    "contacto.html"
  ]) {
    assert.match(
      sitemap,
      new RegExp(`https://testneurodivergentes\\.com/${relativePath.replaceAll(".", "\\.")}`)
    );
  }
});

test("las guías de la fase 4 son completas, transparentes y están integradas", () => {
  const guides = [
    "TDA/senales-de-tdah-en-adultos.html",
    "TDA/senales-de-tdah-en-ninos-y-cuando-consultar.html",
    "TDA/como-interpretar-un-resultado-orientativo-de-tdah.html"
  ];
  const sitemap = fs.readFileSync(path.join(docsRoot, "sitemap.xml"), "utf8");

  for (const relativePath of guides) {
    const html = fs.readFileSync(path.join(docsRoot, relativePath), "utf8");
    const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

    assert.ok(text.split(" ").length >= 650, `${relativePath}: contenido insuficiente`);
    assert.match(html, /Margel Gabriel Castro/);
    assert.match(html, /desarrollador full stack/i);
    assert.match(html, /Publicado y actualizado: 10 de agosto de 2026/);
    assert.match(html, /rel="author"/);
    assert.match(html, /no (?:diagnostica|diagnóstico|son puntos de corte)/i);
    assert.match(html, /https:\/\/www\.cdc\.gov\/adhd\//);
    assert.match(html, /https:\/\/www\.nimh\.nih\.gov\/health\//);
    assert.match(html, /que-es-el-tdah\.html/);
    assert.match(html, /(?:formulario-de-acceso-a-tests|test-psicologicos-gratis)\.html/);

    const publicPath = relativePath.replaceAll("ñ", "%C3%B1");
    assert.match(
      sitemap,
      new RegExp(`https://testneurodivergentes\\.com/${publicPath.replaceAll(".", "\\.")}`)
    );

    for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      assert.doesNotThrow(() => JSON.parse(match[1]), `${relativePath}: JSON-LD`);
    }
  }

  for (const relativePath of [
    "index.html",
    "test-psicologicos-gratis.html",
    "TDA/que-es-el-tdah.html"
  ]) {
    const html = fs.readFileSync(path.join(docsRoot, relativePath), "utf8");
    for (const guide of guides) {
      assert.match(html, new RegExp(guide.split("/").at(-1).replaceAll(".", "\\.")));
    }
  }
});

test("AdSense solo se carga en páginas editoriales completas", () => {
  const pagesWithAds = new Set([
    "index.html",
    "TDA/que-es-el-tdah.html"
  ]);

  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, "utf8");
    const relativePath = path.relative(docsRoot, file).split(path.sep).join("/");
    const hasAdSense = /pagead2\.googlesyndication\.com/i.test(html);

    assert.equal(
      hasAdSense,
      pagesWithAds.has(relativePath),
      `${relativePath}: ubicación de AdSense no permitida`
    );
  }
});

test("el catálogo y la navegación solo anuncian evaluaciones disponibles", () => {
  const unavailableTargets =
    /#(?:tea-adultos|tea-infantil|ansiedad|ansiedad-social|estado-animo|burnout|estres|funciones-ejecutivas|procrastinacion|deficit-ejecutivo|impulsividad|perfeccionismo|sueno|autoestima|dependencia-emocional)\b/i;

  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, "utf8");
    const relativePath = path.relative(docsRoot, file);

    assert.doesNotMatch(html, /\b(?:is-coming|Próximamente)\b/i, relativePath);
    assert.doesNotMatch(html, unavailableTargets, relativePath);
  }

  const catalog = fs.readFileSync(
    path.join(docsRoot, "test-psicologicos-gratis.html"),
    "utf8"
  );
  assert.doesNotMatch(
    catalog,
    /\b(?:TEA|ansiedad|depresión|burnout|estrés|autoestima|perfeccionismo)\b/i
  );
});

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

test("la portada y la guía evitan lenguaje SEO y estadísticas médicas sin respaldo", () => {
  const home = fs.readFileSync(path.join(docsRoot, "index.html"), "utf8");
  const guide = fs.readFileSync(
    path.join(docsRoot, "TDA/que-es-el-tdah.html"),
    "utf8"
  );

  for (const phrase of [
    "Pillar page",
    "Guía pilar",
    "autoridad central",
    "enlazado interno",
    "futuras páginas",
    "People Also Ask",
    "EEAT",
    "seo-local"
  ]) {
    assert.doesNotMatch(home, new RegExp(phrase, "i"), phrase);
  }

  assert.equal((home.match(/<details class="faq-item">/g) ?? []).length, 10);
  assert.match(home, /no existe una única prueba para diagnosticar TDAH/i);
  assert.match(home, /no son puntos de corte clínicos validados/i);
  assert.match(home, /https:\/\/www\.cdc\.gov\/adhd\/signs-symptoms\/index\.html/);
  assert.match(home, /https:\/\/www\.nimh\.nih\.gov\/health\/topics\/attention-deficit-hyperactivity-disorder-adhd/);

  for (const phrase of [
    "El TDAH en 100 casos",
    "De cada 100 casos",
    "52 %",
    "48 %",
    "36 %",
    "16 %",
    "26 %",
    "22 %"
  ]) {
    assert.doesNotMatch(guide, new RegExp(phrase, "i"), phrase);
  }

  assert.match(guide, /Los síntomas comienzan en la infancia y pueden continuar en la adultez/i);
  assert.match(guide, /Fuente: CDC, síntomas del TDAH/i);
  assert.match(guide, /Fuente: NIMH, descripción general/i);
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
