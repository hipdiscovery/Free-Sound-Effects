# Using Creator Asset Library with editing agents

This document describes the **current public static files**. It does not assert that any third-party editing plugin is installed, connected or permitted to import these source files automatically.

## Entry points

- [Creator resources page](https://hipdiscovery.github.io/Free-Sound-Effects/resources.html): human search and 13 selectable directions, each with a copyable source-backed creative brief.
- [Resource metadata](https://hipdiscovery.github.io/Free-Sound-Effects/resources.json): static version 1 JSON file with 74 provider/resource links, 55 font links, seven reference collections and 13 art directions as of 2026-10-25.
- [Resource schema](https://hipdiscovery.github.io/Free-Sound-Effects/resources.schema.json): JSON Schema draft 2020-12 for the file shape. The schema documents structure; additional checks for rights policies and direction reference integrity are implemented in `scripts/validate-resources.mjs`.
- [Audio files](https://hipdiscovery.github.io/Free-Sound-Effects/catalog.json): a **different** versioned catalog of the existing 100 imported Kenney CC0 OGG files. Do not infer all external sources in `resources.json` are local audio files.

- [Procedural xfade options](https://hipdiscovery.github.io/Free-Sound-Effects/transition-presets.json): optional FFmpeg built-in transitions, checked against a test installation; apply only on a compatible local build with normalized footage.

## How an agent should use the catalog

1. **Read metadata**, not binary asset packs. Parse the JSON file, validate expected `schemaVersion`, and check a selected record's `link`, `licenseUrl`, `rights`, `access`, `format`, `caveat`, `attribution`, and `checkedOn`.
2. **Choose appropriate directions**, not a forced random styling. Match the actual footage, audience, format and desired mood, then recommend 2–3 genuinely distinct approaches when concept is undecided.
3. **Resolve source references.** Each `directions[].assetIds` points to `assets[].id`; `fontIds` point to `fonts[].id`. Avoid assuming external assets have already been downloaded, installed, rendered, or imported.
4. **Check usage rights at the exact item page.** The `rights` field is a conservative classification of the publisher or collection, not a legal guarantee for every file. Stock collections and archives may contain third-party work or paid results.
5. **Obtain or generate only what is needed**, using an actual supported connected editor/tool with the user's approved scope. Do not use hosted paid APIs or subscribe visitors automatically.
6. **Keep variation accountable.** Track the last direction, primary font pair, sound palette and signature transition within the active project. Avoid repeating them when an equally good alternative suits the next piece; do not persist private editing history to this public repository.
7. **Deliver verifiable output.** Verify actual exported video/audio, not just a static preview or a successful asset lookup.

## Example source resolution

```js
const base = 'https://hipdiscovery.github.io/Free-Sound-Effects/';
const catalog = await fetch(new URL('resources.json', base)).then(res => {
  if (!res.ok) throw Error('Resource index unavailable');
  return res.json();
});
if (catalog.schemaVersion !== 1) throw Error('Unexpected catalog version');
const direction = catalog.directions.find(item => item.id === 'pixel-arcade');
if (!direction) throw Error('Direction no longer available');
const choices = direction.assetIds.map(id => catalog.assets.find(a => a.id === id));
if (choices.some(item => !item)) throw Error('Catalog reference missing');
// Each choice is an external link to review; not downloaded assets.
const sources = choices.map(({title, link, licenseUrl, caveat}) => ({title, link, licenseUrl, caveat}));
```

**Rights summary:** Kenney and Open Peeps originals are explicitly marked CC0; museums require per-item rights checks; Scott Buckley music and Game-icons.net require credit; Sonniss audio permits synchronization but expressly prohibits AI training and standalone repackaging; Pixelarticons offers 1,036 free MIT icons, while the full set is paid. See [license research](CREATOR_ASSET_LICENSES.md).

## No-service dependency

The current site uses static HTML, CSS, JavaScript and JSON. It does not require an account, API key, hosted model, telemetry system, asset mirror, scheduled crawler, or local always-on machine.

Last audited: 2026-10-25.

## Publishing handoff

For platform-specific copy, URL placement, X source-code evidence, Threads topics and Snapchat destination/retention choices, read [Social publishing research](SOCIAL_PUBLISHING.md). Keep this as the shared source rather than duplicating dated advice in downstream app repositories.
