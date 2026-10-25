import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { validateTransitions } from "./validate-transition-presets.mjs";

const original = JSON.parse(readFileSync(new URL("../transition-presets.json", import.meta.url), "utf8"));
assert.match(validateTransitions(original), /FFmpeg xfade/);
const bad = [
  t => t.presets[1].id = t.presets[0].id,
  t => t.presets[0].id = "not-a-transition",
  t => t.presets[0].family = "none",
  t => t.presets[0].durationSeconds = 10,
  t => t.presets[0].bestFor = "",
  t => t.presets[0].avoid = "",
  t => t.presets[0].filter = "unknown",
  t => t.presets[0].requiresAudioTreatment = false,
  t => t.filterDocs = "http://not-secure.example",
  t => t.licenseUrl = "javascript:alert(1)",
  t => t.limitations = []
];
for (const mutate of bad) {
  const copy = structuredClone(original);
  mutate(copy);
  assert.throws(() => validateTransitions(copy));
}
console.log(bad.length + " invalid transition catalog fixtures rejected.");
