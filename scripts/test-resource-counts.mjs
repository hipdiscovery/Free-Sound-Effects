import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const catalog = JSON.parse(read("resources.json"));
const documents = Object.fromEntries(
  ["resources.html", "README.md", "docs/CREATIVE_DIRECTIONS.md"].map(path => [path, read(path)]),
);

// These are current, user-visible catalog totals, not dated verification records.
// Derive the expected count from the catalog so adding/removing a source also
// requires updating its static/no-JavaScript and documentation claims.
const claims = [
  ["resources.html", /<meta\b[^>]*name="description"[^>]*content="[^"\d]*(\d+) free creative resource sources\b/, "description"],
  ["resources.html", /<strong\b[^>]*id="asset-total"[^>]*>\s*(\d+)\s*<\/strong>/, "fallback total"],
  ["README.md", /\*\*(\d+) creator-ready libraries and free tools\*\*/, "directory summary"],
  ["docs/CREATIVE_DIRECTIONS.md", /catalog now has (\d+) source entries\b/, "current source total"],
];
function assertCounts(data, files) {
  for (const [path, pattern, label] of claims) {
    const match = files[path].match(pattern);
    assert.ok(match, `${path}: missing ${label} count`);
    assert.equal(Number(match[1]), data.assets.length, `${path}: stale ${label} count`);
  }
}

test("current resource metadata, fallback and documentation agree with the catalog", () => {
  assertCounts(catalog, documents);
});
for (const [path, pattern, label] of claims) {
  test(`rejects a stale ${path} ${label}`, () => {
    const stale = { ...documents };
    stale[path] = stale[path].replace(pattern, (claim, count) =>
      claim.replace(count, String(catalog.assets.length - 1)));
    assert.throws(() => assertCounts(catalog, stale), /stale .* count/);
  });
}
test("adding a catalog source requires refreshing visible count claims", () => {
  const expanded = { ...catalog, assets: [...catalog.assets, { id: "count-test-only" }] };
  assert.throws(() => assertCounts(expanded, documents), /stale .* count/);
});
