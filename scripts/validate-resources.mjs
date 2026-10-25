import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const mediaTypes = new Set(["Audio", "Video", "Motion", "Images", "Graphics", "Fonts", "Tools"]);
const collectionTypes = new Set([...mediaTypes, "Planning", "Business"]);
const rights = new Set(["cc0", "cc0-filter", "video-commercial", "open-notice", "check-item", "tool", "media-only", "cc-by", "free-generated", "font-commercial"]);
const att = new Set(["none", "notice", "per-item", "credit"]);
const sourceTypes = new Set(["library", "archive", "licensed-search", "generator", "editor", "reference"]);
function urlCheck(str) {
  assert(typeof str === "string" && str.startsWith("https://"), "URLs must use HTTPS");
  const parsed = new URL(str);
  assert(parsed.hostname && !parsed.username && !parsed.password, "Invalid or credentialed URL");
}
function filled(obj, keys) {
  for (const key of keys) assert(typeof obj[key] === "string" && obj[key].trim(), "Missing " + key);
}
export function validateResources(c) {
  assert.equal(c.schemaVersion, 1);
  assert(/^\d{4}-\d{2}-\d{2}$/.test(c.updated));
  for (const group of ["collections", "fonts", "assets", "directions"])
    assert(Array.isArray(c[group]) && c[group].length > 0, "Missing group: " + group);
  const ids = new Set(), destinations = new Set();
  for (const obj of [...c.collections, ...c.fonts, ...c.assets]) {
    assert(/^[a-z0-9-]+$/.test(obj.id), "Invalid ID");
    assert(!ids.has(obj.id), "Duplicate ID: " + obj.id);
    ids.add(obj.id);
    const destination = obj.link || obj.url;
    urlCheck(destination);
    assert(!destinations.has(destination), "Duplicate destination: " + destination);
    destinations.add(destination);
  }
  for (const item of c.collections) {
    assert(collectionTypes.has(item.category), "Unrecognized collection category");
    assert(Number.isSafeInteger(item.itemCount) && item.itemCount > 0);
    filled(item, ["title", "description", "rights", "access"]);
    urlCheck(item.creatorPost);
    if (item.downloadPage) urlCheck(item.downloadPage);
    if (item.countLabel !== undefined) filled(item, ["countLabel"]);
  }
  for (const font of c.fonts) {
    assert(["Playful","Bold","Clean","Tech","Retro","Handwritten"].includes(font.style));
    filled(font, ["name", "style", "source", "licenseStatus"]);
    if (font.licenseStatus === "Open-source font") {
      assert.equal(font.source, "Google Fonts");
      const uri = new URL(font.url);
      assert(uri.hostname === "fonts.google.com" && uri.pathname.startsWith("/specimen/"));
    } else assert.equal(font.licenseStatus, "Check creator license");
  }
  const idToAsset = new Set(c.assets.map(a => a.id));
  const idToFont = new Set(c.fonts.map(f => f.id));
  for (const item of c.assets) {
    assert(mediaTypes.has(item.category), "Unsupported asset category");
    assert(rights.has(item.rights), "Unknown rights class");
    assert(att.has(item.attribution), "Unknown attribution class");
    assert(sourceTypes.has(item.sourceType), "Unknown source type");
    filled(item, ["title", "kind", "format", "description", "workflow", "license", "licenseUrl", "publisher", "access", "caveat", "checkedOn"]);
    urlCheck(item.licenseUrl);
    assert(/^\d{4}-\d{2}-\d{2}$/.test(item.checkedOn));
    assert(item.description.length >= 18 && item.caveat.length >= 20, "Insufficient detail");
    assert(Number.isSafeInteger(item.priority) && item.priority >= 1 && item.priority <= 3);
    assert(Array.isArray(item.tags) && item.tags.length > 0 && item.tags.every(x => typeof x === "string" && x.trim()));
    assert(Array.isArray(item.styleTags) && item.styleTags.length > 0 && item.styleTags.every(x => /^[a-z-]+$/.test(x)));
    assert(new Set(item.tags).size === item.tags.length && new Set(item.styleTags).size === item.styleTags.length);
    if (item.rights === "cc0") {
      assert.equal(item.attribution, "none");
      assert(["Kenney", "Poly Haven", "ambientCG", "Open Peeps"].includes(item.publisher), "CC0 must be proven original-source level");
    }
    if (item.rights === "cc0-filter") {
      assert.equal(item.attribution, "none");
      assert(["Smithsonian", "The Met", "National Gallery of Art", "Art Institute of Chicago"].includes(item.publisher));
    }
    if (item.rights === "cc-by") {
      assert.equal(item.attribution, "credit");
      assert(["Scott Buckley", "Game-icons.net"].includes(item.publisher));
    }
    if (item.rights === "media-only") {
      assert.equal(item.publisher, "Sonniss");
      assert(/AI/i.test(item.caveat), "Media-only license must flag AI-training exclusion");
    }
    if (item.rights === "free-generated") {
      assert(["Creatica", "Haikei"].includes(item.publisher));
      assert.equal(item.sourceType, "generator");
    }
    if (item.rights === "open-notice") assert.equal(item.attribution, "notice");
    if (item.rights === "font-commercial") assert.equal(item.publisher, "Fontshare");
    if (item.rights === "check-item") assert(["none", "per-item"].includes(item.attribution), "Item-level licensing does not necessarily mandate attribution");
  }
  const directions = new Set();
  for (const d of c.directions) {
    assert(/^[a-z0-9-]+$/.test(d.id));
    assert(!directions.has(d.id), "Duplicate direction");
    directions.add(d.id);
    filled(d, ["name", "tone", "useCase", "motion", "sound", "avoid"]);
    assert(Array.isArray(d.assetIds) && d.assetIds.length >= 4);
    assert(Array.isArray(d.fontIds) && d.fontIds.length >= 3);
    assert(new Set(d.assetIds).size === d.assetIds.length);
    assert(new Set(d.fontIds).size === d.fontIds.length);
    assert(d.assetIds.every(id => idToAsset.has(id)), "Unresolved asset reference: " + d.id);
    assert(d.fontIds.every(id => idToFont.has(id)), "Unresolved font reference: " + d.id);
    assert(Array.isArray(d.palette) && d.palette.length === 3 && d.palette.every(color => /^#[0-9A-Fa-f]{6}$/.test(color)));
  }
  assert(c.selectionPolicy?.version === 1 && c.selectionPolicy.steps?.length >= 6);
  return c.assets.length + " creative sources, " + c.fonts.length + " fonts, " + c.directions.length + " directions, " + c.collections.length + " reference collections: metadata, source identities, licenses, uniqueness and references validated.";
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const catalog = JSON.parse(readFileSync(new URL("../resources.json", import.meta.url), "utf8"));
  console.log(validateResources(catalog));
}
