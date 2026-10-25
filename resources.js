const $ = selector => document.querySelector(selector);
const input = $("#res-query"), status = $("#res-status");
const collectionsRoot = $("#res-collections"), fontsRoot = $("#res-fonts"), assetsRoot = $("#res-assets");
const collectionBlock = $("#res-collection-block"), fontBlock = $("#res-font-block"), assetBlock = $("#res-asset-block");
const showAssetsButton = $("#res-show-assets"), showFontsButton = $("#res-show-fonts");
const directionCards = $("#res-direction-cards"), directionNext = $("#res-next-directions");
const directionBanner = $("#res-active-direction"), directionTitle = $("#res-active-title");
const empty = $("#res-empty");
const filterButtons = [...document.querySelectorAll("[data-filter]")];
const categories = new Set(["All", "Audio", "Video", "Motion", "Images", "Graphics", "Fonts", "Tools", "Planning", "Business"]);
let catalog = null, category = "All", activeDirection = null, directionOffset = 0, expandAssets = false, expandFonts = false;

function node(tag, className = "", value) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (value !== undefined) el.textContent = value;
  return el;
}
function link(label, url) {
  const a = node("a", "", label);
  a.href = url; a.target = "_blank"; a.rel = "noopener noreferrer";
  a.setAttribute("aria-label", label.replace(" ↗", "") + " (opens in new tab)");
  return a;
}
function collectionCard(item) {
  const card = node("article", "res-card");
  const top = node("div", "res-card-top");
  top.append(node("span", "", item.category), node("span", "res-count", item.countLabel || item.itemCount + " items"));
  const details = node("div", "res-card-details");
  details.append(node("span", "res-access", item.access), node("span", "res-rights", item.rights));
  const links = node("div", "res-card-links");
  links.append(link("Open original ↗", item.link), link("Creator post ↗", item.creatorPost));
  if (item.downloadPage) links.append(link("ZIP information ↗", item.downloadPage));
  card.append(top, node("h3", "", item.title), node("p", "", item.description), details, links);
  return card;
}
function fontCard(font) {
  const card = node("article", "res-font-card");
  const head = node("div", "res-font-top");
  head.append(node("h3", "", font.name), link("Font page ↗", font.url));
  const meta = node("div", "res-font-meta");
  meta.append(node("span", "", font.style), node("span", "", font.source));
  meta.append(node("span", font.licenseStatus === "Open-source font" ? "" : "res-check", font.licenseStatus));
  card.append(head, meta);
  return card;
}
function rightsLabel(asset) {
  const labels = {
    "cc0":"CC0 source", "cc0-filter":"Only marked CC0 works",
    "cc-by":"Credit required", "open-notice":"Open license · retain notices",
    "media-only":"Finished media only · no AI training", "check-item":"Check individual license",
    "video-commercial":"Finished commercial edits", "free-generated":"Original commercial-use outputs",
    "font-commercial":"Commercial fonts · check EULA", "tool":"Free creation tool"
  };
  return labels[asset.rights] || "Rights require review";
}
function assetCard(asset) {
  const card = node("article", "res-asset-card");
  const topline = node("div", "res-asset-topline");
  topline.append(node("span", "res-asset-group", asset.category), node("span", "res-asset-format", asset.sourceType === "generator" ? "Original generator" : asset.format));
  const info = node("div", "res-asset-info");
  info.append(node("h3", "", asset.title), node("p", "", asset.description));
  const pills = node("div", "res-asset-pills");
  pills.append(node("span", asset.rights === "cc0" ? "res-cc0-label" : "res-rights-label", rightsLabel(asset)));
  pills.append(node("span", "", asset.access));
  const actions = node("div", "res-asset-actions");
  actions.append(link("Visit original ↗", asset.link), link("License / terms ↗", asset.licenseUrl));
  const details = node("details", "res-asset-details");
  details.append(node("summary", "", "Use & restrictions"));
  details.append(node("p", "", asset.workflow || asset.capcut), node("p", "res-asset-caution", asset.caveat), node("p", "res-asset-date", asset.publisher + " · reviewed " + asset.checkedOn));
  card.append(topline, info, pills, actions, details);
  return card;
}
function directionCard(dir) {
  const card = node("article", "res-direction-card");
  const swatches = node("div", "res-direction-swatches");
  swatches.setAttribute("aria-label", "Example palette");
  for (const color of dir.palette) {
    const item = node("span", "res-swatch");
    item.style.backgroundColor = color; item.title = color;
    swatches.append(item);
  }
  const fontNames = dir.fontIds.map(id => catalog.fonts.find(font => font.id === id)?.name).filter(Boolean);
  const label = node("p", "res-direction-tone", dir.tone);
  const usage = node("p", "res-direction-usecase", dir.useCase);
  const fonts = node("p", "res-direction-fonts", fontNames.slice(0, 2).join(" + "));
  const button = node("button", "res-direction-select", "Explore this look ↗");
  button.type = "button";
  button.setAttribute("aria-label", "Explore " + dir.name + " sources");
  button.addEventListener("click", () => {
    activeDirection = dir.id;
    category = "All"; input.value = ""; expandAssets = false; expandFonts = false;
    render();
    $("#directory").scrollIntoView({block:"start", behavior:"auto"});
  });
  card.append(swatches, node("h3", "", dir.name), label, usage, fonts, button);
  return card;
}
function renderDirections() {
  if (!catalog) return;
  const d = catalog.directions, display = [];
  for (let n = 0; n < Math.min(3, d.length); n++) display.push(d[(directionOffset + n) % d.length]);
  directionCards.replaceChildren(...display.map(directionCard));
}
function matches(item, terms) {
  const searchable = [item.title,item.name,item.category,item.style,item.description,item.access,item.source,item.rights,item.license,item.publisher,item.format,item.workflow,item.kind,item.tags?.join(" "),item.styleTags?.join(" ")].filter(Boolean).join(" ").toLowerCase();
  return terms.every(term => searchable.includes(term));
}
function diversify(items, limit, key) {
  const chosen = [];
  const used = new Set();
  const best = [...items].sort((a,b) => (a.priority || 2)-(b.priority || 2) || a.title.localeCompare(b.title));
  for (const kind of [...new Set(best.map(x => x.category || x.style))]) {
    const item = best.find(x => (x.category || x.style) === kind);
    if (item && !used.has(item.id)) { chosen.push(item); used.add(item.id); }
    if (chosen.length >= limit) return chosen;
  }
  // Include less-represented publishers first so a default browse is not a Kenney/Mixkit wall.
  while (chosen.length < limit && used.size < best.length) {
    const counts = new Map();
    for (const item of chosen) counts.set(item[key]||"", (counts.get(item[key]||"")||0)+1);
    const next = best.filter(item => !used.has(item.id)).sort((a,b) => (counts.get(a[key]||"")||0)-(counts.get(b[key]||"")||0) || (a.priority||2)-(b.priority||2))[0];
    chosen.push(next); used.add(next.id);
  }
  return chosen;
}
function render() {
  if (!catalog) return;
  const terms = input.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const active = catalog.directions.find(item => item.id === activeDirection);
  const selectedAssetIds = active ? new Set(active.assetIds) : null;
  const selectedFontIds = active ? new Set(active.fontIds) : null;
  directionBanner.hidden = !active;
  if (active) directionTitle.textContent = active.name + " · " + active.tone;
  const assets = catalog.assets.filter(item =>
    (!selectedAssetIds || selectedAssetIds.has(item.id)) &&
    (category === "All" || item.category === category) && matches(item, terms)
  ).sort((a,b) => active ? active.assetIds.indexOf(a.id)-active.assetIds.indexOf(b.id) : (a.priority||2)-(b.priority||2)||a.title.localeCompare(b.title));
  const collections = catalog.collections.filter(item => !active &&
    (category === "All" || item.category === category) && matches(item, terms));
  const fonts = catalog.fonts.filter(item =>
    (!selectedFontIds || selectedFontIds.has(item.id)) &&
    (category === "All" || category === "Fonts") && matches(item, terms));
  const initial = category === "All" && !terms.length && !active;
  const visibleAssets = initial && !expandAssets ? diversify(assets, 12, "publisher") : assets;
  const visibleFonts = initial && !expandFonts ? diversify(fonts, 12, "source") : fonts;
  assetsRoot.replaceChildren(...visibleAssets.map(assetCard));
  collectionsRoot.replaceChildren(...collections.map(collectionCard));
  fontsRoot.replaceChildren(...visibleFonts.map(fontCard));
  assetBlock.hidden = assets.length === 0; collectionBlock.hidden = collections.length === 0; fontBlock.hidden = fonts.length === 0;
  showAssetsButton.hidden = !(initial && assets.length > 12);
  showAssetsButton.textContent = expandAssets ? "Show curated highlights ↑" : "View all " + assets.length + " creative sources ↓";
  showFontsButton.hidden = !(initial && fonts.length > 12);
  showFontsButton.textContent = expandFonts ? "Show fewer fonts ↑" : "View all " + fonts.length + " font families ↓";
  const total = assets.length + collections.length + fonts.length;
  empty.hidden = total !== 0;
  status.textContent = assets.length + " creative sources · " + collections.length + " creator collections · " + fonts.length + " font links";
  filterButtons.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.filter === category)));
  const params = new URLSearchParams();
  if (input.value.trim()) params.set("q", input.value.trim());
  if (category !== "All") params.set("category", category);
  if (active) params.set("direction", active.id);
  history.replaceState(null, "", location.pathname + (params.size ? "?" + params : "") + location.hash);
}
$("#res-form").addEventListener("submit", event => event.preventDefault());
$("#res-reset").addEventListener("click", () => { input.value = ""; category = "All"; activeDirection = null; expandAssets = false; expandFonts = false; render(); input.focus(); });
$("#res-clear-direction").addEventListener("click", () => { activeDirection = null; render(); });
directionNext.addEventListener("click", () => { if (!catalog) return; directionOffset = (directionOffset+3)%catalog.directions.length; renderDirections(); });
showAssetsButton.addEventListener("click", () => { expandAssets = !expandAssets; render(); if (!expandAssets) assetBlock.scrollIntoView({block:"start"}); });
showFontsButton.addEventListener("click", () => { expandFonts = !expandFonts; render(); if (!expandFonts) fontBlock.scrollIntoView({block:"start"}); });
input.addEventListener("input", render);
filterButtons.forEach(button => button.addEventListener("click", () => { category = button.dataset.filter; render(); }));
document.addEventListener("keydown", event => {
  if (event.key === "/" && !["INPUT","SELECT","TEXTAREA"].includes(document.activeElement.tagName)) {
    event.preventDefault(); input.focus();
  }
});
try {
  const response = await fetch("resources.json?v=20261025-3");
  if (!response.ok) throw Error("HTTP " + response.status);
  const data = await response.json();
  if (data.schemaVersion !== 1 || !Array.isArray(data.assets) || !Array.isArray(data.collections) || !Array.isArray(data.fonts) || !Array.isArray(data.directions)) throw Error("Unsupported catalog");
  catalog = data;
  $("#asset-total").textContent = data.assets.length;
  $("#collection-total").textContent = data.collections.length;
  $("#font-total").textContent = data.fonts.length;
  const params = new URLSearchParams(location.search);
  input.value = params.get("q") || "";
  category = categories.has(params.get("category")) ? params.get("category") : "All";
  const requestedDirection = params.get("direction");
  activeDirection = data.directions.some(item=>item.id===requestedDirection) ? requestedDirection : null;
  renderDirections(); render();
} catch {
  status.textContent = "The resource directory could not load. Refresh or open resources.json directly.";
  assetBlock.hidden = true; fontBlock.hidden = true; collectionBlock.hidden = true;
  $("#res-next-directions").disabled = true;
}
