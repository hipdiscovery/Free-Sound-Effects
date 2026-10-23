const query = document.querySelector("#res-query");
const status = document.querySelector("#res-status");
const collectionsRoot = document.querySelector("#res-collections");
const fontsRoot = document.querySelector("#res-fonts");
const fontBlock = document.querySelector("#res-font-block");
const empty = document.querySelector("#res-empty");
const buttons = [...document.querySelectorAll("[data-filter]")];
let catalog = null;
let category = "All";
const categories = new Set(["All", "Fonts", "Audio", "Motion", "Planning", "Business"]);
function node(tag, className, value) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (value !== undefined) el.textContent = value;
  return el;
}
function sourceLink(title, url) {
  const a = node("a", "", title);
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.setAttribute("aria-label", title.replace(" ↗", "") + " (opens in a new tab)");
  return a;
}
function collectionCard(item) {
  const card = node("article", "res-card");
  const top = node("div", "res-card-top");
  top.append(node("span", "", item.category), node("span", "res-count", item.countLabel || item.itemCount + " items"));
  const details = node("div", "res-card-details");
  details.append(node("span", "res-access", item.access), node("span", "res-rights", item.rights));
  const links = node("div", "res-card-links");
  links.append(sourceLink("Open original ↗", item.link), sourceLink("Creator post ↗", item.creatorPost));
  if (item.downloadPage) links.append(sourceLink("ZIP info ↗", item.downloadPage));
  card.append(top, node("h3", "", item.title), node("p", "", item.description), details, links);
  return card;
}
function fontCard(item) {
  const card = node("article", "res-font-card");
  const header = node("div", "res-font-top");
  header.append(node("h3", "", item.name), sourceLink("Font page ↗", item.url));
  const meta = node("div", "res-font-meta");
  meta.append(node("span", "", item.style), node("span", "", item.source));
  meta.append(node("span", item.licenseStatus === "Open-source font" ? "" : "res-check", item.licenseStatus));
  card.append(header, meta);
  return card;
}
function matches(item, terms) {
  const haystack = [item.title, item.name, item.category, item.style, item.description, item.access, item.source, item.rights].filter(Boolean).join(" ").toLowerCase();
  return terms.every(term => haystack.includes(term));
}
function render() {
  if (!catalog) return;
  const terms = query.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const collections = catalog.collections.filter(item => (category === "All" || item.category === category) && matches(item, terms));
  const fonts = catalog.fonts.filter(item => (category === "All" || category === "Fonts") && matches(item, terms));
  collectionsRoot.replaceChildren(...collections.map(collectionCard));
  fontsRoot.replaceChildren(...fonts.map(fontCard));
  fontBlock.hidden = fonts.length === 0;
  empty.hidden = collections.length + fonts.length !== 0;
  status.textContent = collections.length + " collections · " + fonts.length + " individual fonts";
  buttons.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.filter === category)));
  const params = new URLSearchParams();
  if (query.value.trim()) params.set("q", query.value.trim());
  if (category !== "All") params.set("category", category);
  history.replaceState(null, "", location.pathname + (params.size ? "?" + params : "") + location.hash);
}
document.querySelector("#res-form").addEventListener("submit", event => event.preventDefault());
document.querySelector("#res-reset").addEventListener("click", () => { query.value = ""; category = "All"; render(); query.focus(); });
query.addEventListener("input", render);
buttons.forEach(button => button.addEventListener("click", () => { category = button.dataset.filter; render(); }));
document.addEventListener("keydown", event => {
  if (event.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) {
    event.preventDefault(); query.focus();
  }
});
try {
  const response = await fetch("resources.json");
  if (!response.ok) throw new Error("HTTP " + response.status);
  const parsed = await response.json();
  if (parsed.schemaVersion !== 1 || !Array.isArray(parsed.collections) || !Array.isArray(parsed.fonts)) throw new Error("Invalid catalog");
  catalog = parsed;
  document.querySelector("#collection-total").textContent = parsed.collections.length;
  document.querySelector("#font-total").textContent = parsed.fonts.length;
  const params = new URLSearchParams(location.search);
  query.value = params.get("q") || "";
  category = categories.has(params.get("category")) ? params.get("category") : "All";
  render();
} catch (error) {
  status.textContent = "Resource directory unavailable. Try again, or open resources.json directly.";
  fontBlock.hidden = true;
}
