import { readFileSync, readdirSync, statSync } from "node:fs";
import { resolve, relative, sep } from "node:path";
import { createHash } from "node:crypto";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("..", import.meta.url));
export function inspectOgg(bytes) {
  assert.equal(
    bytes.subarray(0, 4).toString(),
    "OggS",
    "Expected Ogg container",
  );
  const marker = bytes.indexOf(Buffer.from([1, ...Buffer.from("vorbis")]));
  assert(marker >= 0, "Expected Vorbis identification packet");
  const channels = bytes[marker + 11],
    sampleRate = bytes.readUInt32LE(marker + 12);
  assert(sampleRate > 0 && channels > 0);
  let cursor = 0,
    lastGranule = 0n;
  while (cursor < bytes.length) {
    assert.equal(bytes.subarray(cursor, cursor + 4).toString(), "OggS");
    const count = bytes[cursor + 26];
    const end = cursor + 27 + count;
    assert(end <= bytes.length);
    let body = 0;
    for (let i = cursor + 27; i < end; i++) body += bytes[i];
    const g = bytes.readBigUInt64LE(cursor + 6);
    if (g !== 0xffffffffffffffffn) lastGranule = g;
    cursor = end + body;
    assert(cursor <= bytes.length, "Truncated Ogg page");
  }
  assert.equal(cursor, bytes.length);
  return {
    sampleRate,
    channels,
    durationSeconds: Number((Number(lastGranule) / sampleRate).toFixed(6)),
  };
}
export function validate(catalog, base = root) {
  assert.equal(catalog.schemaVersion, 1);
  assert(Array.isArray(catalog.sounds) && catalog.sounds.length > 0);
  const ids = new Set(),
    paths = new Set(),
    hashes = new Set(),
    sources = new Map(catalog.sources.map((s) => [s.id, s]));
  for (const s of catalog.sounds) {
    assert(/^[a-z0-9-]+$/.test(s.id));
    assert(!ids.has(s.id), "Duplicate ID");
    ids.add(s.id);
    assert(!paths.has(s.path), "Duplicate path");
    paths.add(s.path);
    assert(/^audio\/[a-z0-9/_-]+\.ogg$/.test(s.path), "Unsafe audio path");
    assert.equal(
      s.license,
      "CC0-1.0",
      "Only reviewed CC0 audio is currently accepted",
    );
    assert(s.title && s.creator && s.category && s.tags.length > 0);
    assert(s.tags.every((t) => typeof t === "string"));
    const source = sources.get(s.sourceId);
    assert(source, "Missing provenance");
    assert.equal(s.sourceUrl, source.url);
    assert.equal(s.creator, source.creator);
    assert.equal(source.redistributionVerified, true);
    assert.equal(source.license, s.license);
    assert(/^https:\/\//.test(source.url));
    assert(/^https:\/\//.test(source.licenseUrl));
    assert(/^\d{4}-\d{2}-\d{2}$/.test(source.checkedOn));
    assert(/^docs\/[a-z0-9-]+\.json$/.test(source.evidence));
    assert(/^licenses\/[a-z0-9-]+\.txt$/.test(source.bundledLicense));
    assert(/^[a-f0-9]{64}$/.test(source.archiveSha256));
    const evidence = JSON.parse(
      readFileSync(resolve(base, source.evidence), "utf8"),
    );
    assert.equal(evidence.sourceId, source.id);
    assert.equal(evidence.originalPage, source.url);
    assert.equal(evidence.reviewedOn, source.checkedOn);
    assert.equal(evidence.archiveSha256, source.archiveSha256);
    const licenseBytes = readFileSync(resolve(base, source.bundledLicense));
    assert.equal(
      createHash("sha256").update(licenseBytes).digest("hex"),
      evidence.bundledLicenseSha256,
      "License evidence mismatch",
    );
    const bytes = readFileSync(resolve(base, s.path));
    assert.equal(bytes.length, s.bytes);
    const hash = createHash("sha256").update(bytes).digest("hex");
    assert.equal(hash, s.sha256, "Checksum mismatch");
    assert(!hashes.has(hash), "Duplicate audio bytes");
    hashes.add(hash);
    const metadata = inspectOgg(bytes);
    for (const key of Object.keys(metadata))
      assert.equal(s[key], metadata[key], `Incorrect ${key}`);
    assert(s.durationSeconds > 0 && s.durationSeconds < 120);
  }
  const walk = (d) =>
    readdirSync(d).flatMap((n) => {
      const p = resolve(d, n);
      return statSync(p).isDirectory()
        ? walk(p)
        : [relative(base, p).split(sep).join("/")];
    });
  for (const file of walk(resolve(base, "audio")))
    assert(paths.has(file), `Uncataloged audio file: ${file}`);
  return `${ids.size} sounds: provenance, license fields, Ogg metadata, file sizes and SHA-256 uniqueness passed. Audio similarity and legal ownership require human review.`;
}
if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  console.log(
    validate(JSON.parse(readFileSync(resolve(root, "catalog.json"), "utf8"))),
  );
