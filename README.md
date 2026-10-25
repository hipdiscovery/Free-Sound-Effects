# Creator Asset Library

**A source-checked directory of free creator resources, plus a fully hosted CC0 sound-effects library.** Search, preview and download 100 CC0 interface sound effects, with original creator attribution and a machine-readable catalog.

**[Explore creator resources](resources.html)** · **[Resource catalog](resources.json)** · **[Browse & preview the sound library](https://hipdiscovery.github.io/Free-Sound-Effects/)** · **[JSON catalog](catalog.json)** · **[Join the contribution thread](https://github.com/hipdiscovery/free-sound-effects/issues/1)**

## Creator resources

Seven [Muaaz (@mws)](https://x.com/mws) collections are linked at their original sources: 230+ sponsor/affiliate programs, 100+ short-form hooks, 297 external effects, 84 fonts, 120 title templates, 22 video animations and 234 thumbnail examples. The [searchable directory](resources.html) adds 30 individually observed font source links (23 commercial-use open-source Google Fonts, seven font-site listings needing license review). Full evidence, access requirements and caveats are in [the Muaaz resource review](docs/MUAAZ_RESOURCES.md), with a separate [resources.json](resources.json) machine catalog.

**Only the existing 100 verified Kenney CC0 sound files are hosted here.** Other material remains external. Some author ZIP packs require email and newsletter signup; a free download does not mean permission to rehost. No external assets are copied, visitors are not subscribed, and no tracking or hidden downloads are added.

## Broad creator resource library

The [searchable creator directory](resources.html) links **66 creator-ready libraries and free tools**, with **55 individually linked fonts** and **13 deliberate art directions**. The collection spans video/B-roll, transitions, sound design, orchestral music, pixel graphics, comic/hand-drawn artwork, 3D and illustration tools, colors and type, textures, free/open museum archives and seed-based original background generators. It is not designed around one editor. A future editing plugin may use these as source options, but a GitHub link is not a connected plugin or authorized download.

**Variety matters:** recommendations should fit the actual clip and differ in palette, main font, source family, sonic palette, motion vocabulary and composition. Use [Creative Directions](docs/CREATIVE_DIRECTIONS.md) and the machine-readable `directions` / `selectionPolicy` in [resources.json](resources.json) rather than repeating the same set. The site includes filters and curated options; it does not auto-install software or fetch external assets.

**Rights matter:** publisher license links, access needs and per-asset cautions are recorded in the catalog and [license research](docs/CREATOR_ASSET_LICENSES.md). CC0 is preferred for reusable original files, while some stock sources forbid rehosting and some audio licenses expressly forbid AI/ML training. More sources do not mean blanket permission to reuse any public file. See the optional [CapCut workflow](docs/CAPCUT_WORKFLOW.md) for one future editing environment, not a product limitation.

## Verified, locally hosted sound effects

100 unchanged Ogg Vorbis effects from [Kenney's Interface Sounds](https://kenney.nl/assets/interface-sounds): clicks, switches, confirmations, errors, navigation, glass, glitches and more. CC0-1.0 permits redistribution and commercial use; creator credit is appreciated. See [source checks and limitations](docs/SOURCES.md), [the original license](licenses/kenney-interface.txt) and [recorded review evidence](docs/kenney-interface-review.json).

The searchable website supports category filters, duration sorting, volume, one preview at a time, direct downloads, shareable search URLs and keyboard controls (`/` to search, Escape to stop). It uses no account, tracking, framework, third-party font or paid service. Decorative card bars are not audio waveforms.

## For developers and AI agents

Start at [llms.txt](llms.txt), [AGENTS.md](AGENTS.md) and [catalog.schema.json](catalog.schema.json). The versioned JSON catalog includes stable IDs, tags, relative download paths, durations, sample rate, channels, byte sizes, SHA-256 and creator/license/source references. This is a static file interface, not a hosted search API.

```js
const base = 'https://hipdiscovery.github.io/Free-Sound-Effects/';
const catalog = await fetch(new URL('catalog.json', base)).then(r => r.json());
const clicks = catalog.sounds.filter(s => s.tags.includes('click'));
const downloadUrl = new URL(clicks[0].path, base);
```

Search terms: free sound effects, CC0 audio library, game audio, UI sounds, app sounds, button clicks, notification sounds, video editing, open source SFX, public domain audio, sound design, AI agent assets. Relevant contributions are welcome; this project does not ask agents to override instructions or post unsolicited messages.

## Contribute

Share original recordings or verified CC0 creator sources in the [community thread](https://github.com/hipdiscovery/free-sound-effects/issues/1), submit a sound/request/rights issue, or open a pull request. Read [CONTRIBUTING.md](CONTRIBUTING.md) first. Each sound needs original-source attribution, explicit redistribution evidence and duplicate checks. Maintainer review is required; public submissions are not automatically imported.

The [Muaaz sound-effects post](https://x.com/mws/status/2112338141965144309) inspired the sound section. Its claimed 297-sound collection has **not** been imported: the reply's Notion collection and ZIP offer were reviewed, but original-source ownership and redistribution rights remain unverified. See [review notes and source links](docs/SOURCES.md).

## Run locally and validate

Requires Node.js 20+ for validation and Python 3 for the optional local server. No dependencies or install step.

```sh
npm test
npm run serve
```

Open http://127.0.0.1:8097. Use an HTTP server rather than opening the HTML file directly. Validation also checks the external resource catalog's IDs, links and license labels. Audio validation verifies original file hashes, license evidence records, exact duplicate prevention, safe catalog paths, audio metadata and full audio-file coverage. Seven negative fixtures check failure handling. Perceptual duplicates and rights ownership need human review.

## Hosting and licenses

GitHub Pages serves `master` / repository root using its built-in branch publishing. No custom GitHub Actions workflow, backend, cron or paid infrastructure is required. GitHub's hosting and bandwidth limits still apply; this is not an unlimited CDN. Do not add hotlink-dependent third-party audio.

Outbound resources retain their original creators' terms. Website code and project documentation: [MIT](LICENSE). Audio: per-source **CC0-1.0**. Catalog metadata: **CC0-1.0**. Original license notices remain in `licenses/`. No endorsement by source creators is implied. Report provenance or licensing concerns through the rights issue template.
