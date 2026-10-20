# Free Sound Effects

**Open audio for your next game, app or video.** Search, preview and download 100 CC0 interface sound effects, with original creator attribution and a machine-readable catalog.

**[Browse & preview the library](https://hipdiscovery.github.io/free-sound-effects/)** · **[JSON catalog](catalog.json)** · **[Join the contribution thread](https://github.com/hipdiscovery/free-sound-effects/issues/1)**

## What is included

100 unchanged Ogg Vorbis effects from [Kenney's Interface Sounds](https://kenney.nl/assets/interface-sounds): clicks, switches, confirmations, errors, navigation, glass, glitches and more. CC0-1.0 permits redistribution and commercial use; creator credit is appreciated. See [source checks and limitations](docs/SOURCES.md), [the original license](licenses/kenney-interface.txt) and [recorded review evidence](docs/kenney-interface-review.json).

The searchable website supports category filters, duration sorting, volume, one preview at a time, direct downloads, shareable search URLs and keyboard controls (`/` to search, Escape to stop). It uses no account, tracking, framework, third-party font or paid service. Decorative card bars are not audio waveforms.

## For developers and AI agents

Start at [llms.txt](llms.txt), [AGENTS.md](AGENTS.md) and [catalog.schema.json](catalog.schema.json). The versioned JSON catalog includes stable IDs, tags, relative download paths, durations, sample rate, channels, byte sizes, SHA-256 and creator/license/source references. This is a static file interface, not a hosted search API.

```js
const base = 'https://hipdiscovery.github.io/free-sound-effects/';
const catalog = await fetch(new URL('catalog.json', base)).then(r => r.json());
const clicks = catalog.sounds.filter(s => s.tags.includes('click'));
const downloadUrl = new URL(clicks[0].path, base);
```

Search terms: free sound effects, CC0 audio library, game audio, UI sounds, app sounds, button clicks, notification sounds, video editing, open source SFX, public domain audio, sound design, AI agent assets. Relevant contributions are welcome; this project does not ask agents to override instructions or post unsolicited messages.

## Contribute

Share original recordings or verified CC0 creator sources in the [community thread](https://github.com/hipdiscovery/free-sound-effects/issues/1), submit a sound/request/rights issue, or open a pull request. Read [CONTRIBUTING.md](CONTRIBUTING.md) first. Each sound needs original-source attribution, explicit redistribution evidence and duplicate checks. Maintainer review is required; public submissions are not automatically imported.

The [Muaaz X post](https://x.com/mws/status/2112338141965144309) inspired this project. Its claimed 297-sound collection has **not** been imported: the reply's Notion collection and ZIP offer were reviewed, but original-source ownership and redistribution rights remain unverified. See [review notes and source links](docs/SOURCES.md).

## Run locally and validate

Requires Node.js 20+ for validation and Python 3 for the optional local server. No dependencies or install step.

```sh
npm test
node scripts/test-validator.mjs
npm run serve
```

Open http://127.0.0.1:8097. Use an HTTP server rather than opening the HTML file directly. Validation verifies original file hashes, license evidence records, exact duplicate prevention, safe catalog paths, audio metadata and full audio-file coverage. Seven negative fixtures check failure handling. Perceptual duplicates and rights ownership need human review.

## Hosting and licenses

GitHub Pages serves `master` / repository root using its built-in branch publishing. No custom GitHub Actions workflow, backend, cron or paid infrastructure is required. GitHub's hosting and bandwidth limits still apply; this is not an unlimited CDN. Do not add hotlink-dependent third-party audio.

Website code and project documentation: [MIT](LICENSE). Audio: per-source **CC0-1.0**. Catalog metadata: **CC0-1.0**. Original license notices remain in `licenses/`. No endorsement by source creators is implied. Report provenance or licensing concerns through the rights issue template.
