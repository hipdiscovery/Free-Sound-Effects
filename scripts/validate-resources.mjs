import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const c = JSON.parse(readFileSync(new URL("../resources.json", import.meta.url), "utf8"));
assert.equal(c.schemaVersion, 1);
assert(/^\d{4}-\d{2}-\d{2}$/.test(c.updated));
assert(Array.isArray(c.collections) && c.collections.length > 0);
assert(Array.isArray(c.fonts) && c.fonts.length > 0);
const ids = new Set();
const urls = new Set();
const categories = new Set(["Audio", "Fonts", "Motion", "Planning", "Business"]);
const urlCheck = value => {
  assert(typeof value === "string" && /^https:\/\//.test(value));
  const parsed = new URL(value);
  assert(!parsed.username && !parsed.password);
};
for (const item of [...c.collections, ...c.fonts]) {
  assert(/^[a-z0-9-]+$/.test(item.id));
  assert(!ids.has(item.id), "Duplicate resource ID");
  ids.add(item.id);
  const link = item.link || item.url;
  urlCheck(link);
  assert(!urls.has(link), "Duplicate resource link");
  urls.add(link);
}
for (const item of c.collections) {
  assert(categories.has(item.category));
  assert(Number.isSafeInteger(item.itemCount) && item.itemCount > 0);
  if (item.countLabel !== undefined) assert(typeof item.countLabel === "string" && item.countLabel.length > 0);
  for (const key of ["title", "access", "rights", "description"]) assert(typeof item[key] === "string" && item[key].trim());
  urlCheck(item.creatorPost);
  if (item.downloadPage) urlCheck(item.downloadPage);
}
for (const font of c.fonts) {
  assert(["Playful", "Bold", "Clean", "Tech", "Retro", "Handwritten"].includes(font.style));
  assert(font.name && font.source && font.licenseStatus);
  if (font.licenseStatus === "Open-source font") {
    assert.equal(font.source, "Google Fonts");
    assert(new URL(font.url).hostname === "fonts.google.com" && new URL(font.url).pathname.startsWith("/specimen/"));
  } else assert.equal(font.licenseStatus, "Check creator license");
}
console.log(c.collections.length + " creator collections and " + c.fonts.length + " individual font links validated.");
