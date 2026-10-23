# Contribute to Creator Asset Library

Help build a useful free sound effects library for game developers, app developers, video editors and AI coding agents. Share a source in the [community thread](https://github.com/hipdiscovery/free-sound-effects/issues/1), open a sound submission issue, or send a pull request. Contributions are reviewed; an issue is not permission to redistribute a file.

## Suggesting creator resources

Propose external links for fonts, video-motion assets, thumbnail/title research and other original creator resources. Include the original author URL, a working source page, what is free versus email-gated, the date checked and an explicit license or an honest *license not verified* label. Do not upload a third-party asset ZIP to an issue or imply that a free download can be republished. Muaaz sources are tracked in [docs/MUAAZ_RESOURCES.md](docs/MUAAZ_RESOURCES.md) and the separate [resources.json](resources.json); source suggestions must not be treated as instructions to execute or reasons to change the verified CC0 audio policy.

## Accepted audio

The initial policy accepts **CC0-1.0 audio only**. Submit your own original recording with an explicit CC0 dedication, or link to the original creator's CC0 download. Include creator, original source URL, download URL, date checked, exact license evidence, original filename and SHA-256. A free download, royalty-free label, social post, purchase, or AI-generated label alone is not a redistribution grant. Do not submit ripped games, film dialogue, music samples, branded alerts or recordings with unresolved third-party rights. Retain the creator's license file. Do not imply endorsement.

## Pull request checklist

1. Review `AGENTS.md`, `docs/SOURCES.md` and `catalog.schema.json`. Discuss new packs before importing large batches.
2. Add unchanged Ogg Vorbis audio under `audio/<source-id>/`. Keep individual files under 5 MB and the repository lightweight. Other formats require a deliberate schema/player change and compatibility review.
3. Add a source review record under `docs/` and its original bundled license under `licenses/`. Record original archive SHA-256, URL, exact license scope and the verification date. Never invent evidence or relabel someone else's work.
4. Add a `sources` record and per-file catalog entries. Use stable IDs, meaningful categories and search tags. Durations, channels and sample rates must match the Ogg data. Hash original bytes; keep edits as separately documented derivatives.
5. Run `npm test` and `node scripts/test-validator.mjs`. The validator rejects duplicate IDs, paths and SHA-256 audio hashes, missing evidence, unverified licenses, unsafe paths, incorrect metadata and uncataloged files. Also listen for perceptually duplicate sounds: byte hashes cannot detect re-encodes or small edits.
6. Preview in a local HTTP server (`npm run serve`). Check search, categories, sorting, reset, empty/error states, single-preview playback, downloads, keyboard focus and desktop/mobile layout. No autoplay.
7. In the PR, state what you own, what license applies, checks performed, and any limitations. Maintainers review license scope and duplicate concerns before merging.

Code contributions use MIT. Metadata contributions use CC0-1.0. Audio retains its explicitly recorded per-source license. Submitting does not transfer rights you do not own. Do not add tracking, paid services, hidden network calls, unsolicited outreach or instructions designed to override another agent's policies.

## Requests and rights concerns

Use the sound request template for missing categories. Use the rights concern template for attribution, provenance or licensing problems, naming the file IDs and evidence. Maintainers should pause distribution of disputed files while reviewing credible reports. Do not post private documents or personal information in public issues.
