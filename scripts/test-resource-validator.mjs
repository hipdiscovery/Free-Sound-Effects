import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import { validateResources } from "./validate-resources.mjs";
const catalog = JSON.parse(readFileSync(new URL("../resources.json", import.meta.url), "utf8"));
assert.match(validateResources(catalog), /creative sources/);
const mutations = [
  c => c.assets[0].id = c.assets[1].id,
  c => c.assets[0].link = c.assets[1].link,
  c => c.assets[0].licenseUrl = "http://unsafe.example",
  c => c.assets[0].license = "",
  c => c.assets[0].rights = "unrestricted",
  c => { const a = c.assets.find(x => x.rights === "cc0"); a.publisher = "Random Uploader"; },
  c => c.assets[0].tags = [],
  c => c.assets[0].styleTags = [],
  c => c.directions[0].assetIds = ["missing-source", ...c.directions[0].assetIds],
  c => c.directions[0].fontIds = ["missing-font", ...c.directions[0].fontIds],
  c => c.directions[0].palette[0] = "red",
  c => c.directions[1].id = c.directions[0].id,
  c => c.fonts[0].licenseStatus = "commercial-safe without evidence",
  c => c.assets[0].checkedOn = "never"
];
for (const alter of mutations) {
  const candidate = structuredClone(catalog);
  alter(candidate);
  assert.throws(() => validateResources(candidate));
}
console.log(mutations.length + " invalid resource fixtures rejected.");
