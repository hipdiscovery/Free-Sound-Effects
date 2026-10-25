import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const categories = new Set(["subtle","cinematic","texture","retro","geometric","action","glitch","experimental"]);
// Names confirmed by ffmpeg -hide_banner -h filter=xfade in the test environment (FFmpeg 7.1.5).
const supported = new Set(("fade wipeleft wiperight wipeup wipedown slideleft slideright slideup slidedown circlecrop rectcrop distance fadeblack fadewhite radial smoothleft smoothright smoothup smoothdown circleopen circleclose vertopen vertclose horzopen horzclose dissolve pixelize diagtl diagtr diagbl diagbr hlslice hrslice vuslice vdslice hblur fadegrays wipetl wipetr wipebl wipebr squeezeh squeezev zoomin fadefast fadeslow hlwind hrwind vuwind vdwind coverleft coverright coverup coverdown revealleft revealright revealup revealdown").split(" "));
function https(url) {
  assert(typeof url === "string" && url.startsWith("https://"), "Require HTTPS source URL");
  const parsed = new URL(url);
  assert(parsed.hostname && !parsed.username && !parsed.password, "Unsafe source URL");
}
export function validateTransitions(data) {
  assert.equal(data.schemaVersion, 1);
  assert(/^\d{4}-\d{2}-\d{2}$/.test(data.updated), "Review date required");
  assert.equal(data.engine, "FFmpeg xfade");
  for (const key of ["filterDocs","licenseUrl"]) https(data[key]);
  assert(typeof data.verifiedAgainst === "string" && data.verifiedAgainst.length > 12);
  assert(typeof data.intendedUse === "string" && data.intendedUse.length > 20);
  assert(Array.isArray(data.limitations) && data.limitations.length >= 5);
  assert(data.limitations.every(s => typeof s === "string" && s.length > 12), "Missing caveats");
  assert(Array.isArray(data.families) && data.families.length === categories.size);
  assert.equal(new Set(data.families).size, categories.size);
  assert(data.families.every(s => categories.has(s)));
  assert(Array.isArray(data.presets) && data.presets.length >= 20, "Unexpected preset count");
  const names = new Set();
  for (const p of data.presets) {
    assert(supported.has(p.id), "Unknown xfade transition: " + p.id);
    assert(!names.has(p.id), "Duplicate transition: " + p.id);
    names.add(p.id);
    assert.equal(p.filter, "xfade");
    assert.equal(p.requiresAudioTreatment, true, "Audio treatment must be explicit");
    assert(categories.has(p.family), "Unrecognized family");
    assert(typeof p.title === "string" && p.title.length >= 6);
    assert(typeof p.bestFor === "string" && p.bestFor.length >= 20);
    assert(typeof p.avoid === "string" && p.avoid.length >= 20);
    assert(typeof p.durationSeconds === "number" && p.durationSeconds >= 0.1 && p.durationSeconds <= 1.5);
  }
  return data.presets.length + " unique FFmpeg xfade transitions validated against a recorded 7.1.5 allowlist.";
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const catalog = JSON.parse(readFileSync(new URL("../transition-presets.json", import.meta.url), "utf8"));
  console.log(validateTransitions(catalog));
}
