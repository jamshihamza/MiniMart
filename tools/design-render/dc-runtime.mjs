// Runs inside the Playwright page. Keep all helpers inside this function so
// Playwright can serialize it without relying on Node-side closures.
export async function renderClaudeDesignSource({ screen }) {
  const document = globalThis.document;
  const Node = globalThis.Node;
  const customElements = globalThis.customElements;

  // Claude Design primitives this adapter understands. `image-slot` has no
  // real local implementation available anywhere in this repository (the
  // upstream `image-slot.js` was never exported) and is therefore emulated
  // below rather than reproduced faithfully -- see RENDER-FIDELITY-REPORT.md.
  const KNOWN_PRIMITIVES = new Set(["x-dc", "sc-if", "sc-for", "helmet", "image-slot"]);

  class DCLogic {
    constructor(props) {
      this.props = props;
    }

    setState(update) {
      const next = typeof update === "function" ? update(this.state) : update;
      this.state = { ...this.state, ...next };
    }
  }

  const React = {
    createElement(type, props, ...children) {
      return { type, props: props ?? {}, children };
    },
  };

  function evaluate(expression, scope) {
    try {
      return Function("scope", `with (scope) { return (${expression}); }`)(scope);
    } catch (error) {
      throw new Error(
        `Invalid Claude Design template expression "${expression}": ${error.message}`,
        {
          cause: error,
        },
      );
    }
  }

  function templateValue(raw, scope) {
    const expressions = [...raw.matchAll(/\{\{([\s\S]*?)\}\}/g)];
    if (expressions.length === 1 && expressions[0][0].trim() === raw.trim()) {
      return evaluate(expressions[0][1].trim(), scope);
    }
    return raw.replace(/\{\{([\s\S]*?)\}\}/g, (_match, expression) => {
      const value = evaluate(expression.trim(), scope);
      return value == null ? "" : String(value);
    });
  }

  function virtualNode(value) {
    if (value == null || value === false || value === true)
      return document.createDocumentFragment();
    if (Array.isArray(value)) {
      const fragment = document.createDocumentFragment();
      for (const child of value.flat(Infinity)) fragment.append(virtualNode(child));
      return fragment;
    }
    if (typeof value !== "object" || !value.type) return document.createTextNode(String(value));

    const element = document.createElement(value.type);
    for (const [name, propertyValue] of Object.entries(value.props ?? {})) {
      if (name.startsWith("on") || propertyValue == null || propertyValue === false) continue;
      if (name === "className") element.setAttribute("class", propertyValue);
      else if (name === "style" && typeof propertyValue === "object") {
        Object.assign(element.style, propertyValue);
      } else if (propertyValue === true) element.setAttribute(name, "");
      else element.setAttribute(name, String(propertyValue));
    }
    for (const child of value.children.flat(Infinity)) element.append(virtualNode(child));
    return element;
  }

  function processNode(node, scope) {
    if (node.nodeType === Node.TEXT_NODE) {
      if (!node.nodeValue.includes("{{")) return;
      const value = templateValue(node.nodeValue, scope);
      if (typeof value === "object" && value !== null) node.replaceWith(virtualNode(value));
      else node.nodeValue = value == null ? "" : String(value);
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;

    const tag = node.tagName.toLowerCase();
    if (tag === "sc-if") {
      const visible = Boolean(templateValue(node.getAttribute("value") ?? "false", scope));
      if (!visible) {
        node.remove();
        return;
      }
      const children = [...node.childNodes];
      node.replaceWith(...children);
      for (const child of children) processNode(child, scope);
      return;
    }

    if (tag === "sc-for") {
      const list = templateValue(node.getAttribute("list") ?? "[]", scope);
      const variable = node.getAttribute("as");
      if (!Array.isArray(list) || !variable) throw new Error("Invalid sc-for render contract");
      const templates = [...node.childNodes];
      const fragment = document.createDocumentFragment();
      list.forEach((item, index) => {
        const childScope = { ...scope, i: index, [variable]: item };
        const itemFragment = document.createDocumentFragment();
        const children = [];
        for (const template of templates) {
          const child = template.cloneNode(true);
          children.push(child);
          itemFragment.append(child);
        }
        for (const child of children) processNode(child, childScope);
        fragment.append(itemFragment);
      });
      node.replaceWith(fragment);
      return;
    }

    for (const attribute of [...node.attributes]) {
      if (attribute.name.toLowerCase().startsWith("on")) {
        node.removeAttribute(attribute.name);
        continue;
      }
      if (!attribute.value.includes("{{")) continue;
      const value = templateValue(attribute.value, scope);
      if (value == null || value === false) node.removeAttribute(attribute.name);
      else if (value === true) node.setAttribute(attribute.name, "");
      else node.setAttribute(attribute.name, String(value));
    }
    for (const child of [...node.childNodes]) processNode(child, scope);
  }

  const sourceScript = document.querySelector("script[data-dc-script]");
  const root = document.querySelector("x-dc");
  if (!sourceScript || !root)
    throw new Error("Claude Design source is missing x-dc or data-dc-script");

  const Component = Function(
    "DCLogic",
    "React",
    `${sourceScript.textContent}\nreturn Component;`,
  )(DCLogic, React);
  const component = new Component({ screen, embedded: false });
  const scope = component.renderVals();

  // `helmet` carries real stylesheet <link>s (Google Fonts, the real Lucide
  // icon font CSS) as well as inline <style>. Relocating only <style> and
  // dropping the <link> elements would silently unlink those stylesheets
  // the moment `helmet.remove()` runs below -- the browser only keeps an
  // external stylesheet applied while its <link> element stays in the
  // document, so the icon font's `.icon-*::before { content }` rules (and
  // the IBM Plex @font-face declarations) would vanish right before the
  // screenshot despite having already loaded successfully. Relocate both,
  // and wait for the relocated stylesheets to finish applying.
  const helmet = root.querySelector(":scope > helmet");
  const relocatedStylesheetsReady = [];
  if (helmet) {
    for (const child of [...helmet.children]) {
      if (child.tagName === "STYLE") {
        document.head.append(child.cloneNode(true));
      } else if (child.tagName === "LINK" && child.getAttribute("rel") === "stylesheet") {
        const clone = child.cloneNode(true);
        relocatedStylesheetsReady.push(
          new Promise((resolveLink) => {
            clone.addEventListener("load", () => resolveLink(), { once: true });
            clone.addEventListener("error", () => resolveLink(), { once: true });
          }),
        );
        document.head.append(clone);
      }
      // <script> children (e.g. image-slot.js) already ran during the
      // initial page parse; they are not re-inserted here.
    }
    helmet.remove();
  }
  await Promise.all(relocatedStylesheetsReady);

  // `image-slot` is a real Claude Design primitive, but its runtime
  // (`image-slot.js`) has no real local implementation anywhere in this
  // repository or its Mockups export -- it was never exported alongside
  // the design source. There is nothing real to load, so it is emulated
  // here with a faithful static placeholder instead of being reproduced.
  // This is a documented KNOWN-DIFFERENCE, not a silent drop: see
  // RENDER-FIDELITY-REPORT.md.
  const HTMLElementCtor = globalThis.HTMLElement;
  let imageSlotsEmulated = 0;
  if (customElements && !customElements.get("image-slot")) {
    class ImageSlotElement extends HTMLElementCtor {
      connectedCallback() {
        imageSlotsEmulated += 1;
        const shape = this.getAttribute("shape") ?? "rect";
        const placeholder = this.getAttribute("placeholder") ?? "Image";
        Object.assign(this.style, {
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "4px",
          color: "#8c98ad",
          fontSize: "11px",
          textAlign: "center",
          borderRadius: shape === "circle" ? "50%" : "0",
        });
        this.innerHTML = `<i class="icon-image" style="font-size:20px"></i><span>${placeholder}</span>`;
      }
    }
    customElements.define("image-slot", ImageSlotElement);
  }

  processNode(root, scope);
  const fragment = document.createDocumentFragment();
  for (const child of [...root.childNodes]) fragment.append(child);
  root.replaceWith(fragment);
  sourceScript.hidden = true;
  if (document.querySelector("sc-if, sc-for")) {
    throw new Error("Claude Design render left an unprocessed conditional or loop");
  }

  // Fail fast on any Claude Design primitive this adapter does not
  // understand -- statically authored or produced dynamically via
  // React.createElement -- rather than letting it render away silently.
  const primitivesEncountered = new Set();
  for (const element of document.body.querySelectorAll("*")) {
    const tag = element.tagName.toLowerCase();
    if (!tag.includes("-")) continue;
    primitivesEncountered.add(tag);
    if (!KNOWN_PRIMITIVES.has(tag)) {
      throw new Error(`Unsupported Claude Design primitive: <${tag}>`);
    }
  }

  document.body.dataset.designRenderReady = "true";
  return { primitivesEncountered: [...primitivesEncountered], imageSlotsEmulated };
}
