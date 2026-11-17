# Free-Sound-Effects — agent guide

Purpose: a public, dependency-free static site with a catalog of creator-verified CC0 Ogg Vorbis sound effects and a directory of outbound links to free creator resources ("Creator Asset Library"). Status: active, last changed October 2026; its future is Troy's open decision. Machine: either. This repository is public: keep private details, credentials and local evidence out of it.
Branch: master. Commit and push directly; no force-push; no Co-Authored-By trailer; no GitHub Actions.

Read `CONTRIBUTING.md`, `catalog.schema.json` and `docs/SOURCES.md` before adding or changing a sound.

## Run, test, deploy
- Run locally: `npm run serve` (Python HTTP server on 127.0.0.1:8097; on Windows `py -3 -m http.server 8097 --bind 127.0.0.1` if `python` is missing).
- Required gate before every commit: `npm test`, which runs eight checks (catalog validator and its fixtures, resource validator and its fixtures, transition-preset validator and its fixtures, player and resource-count tests), then `git diff --check`.
- Deploy: **automatic on push to master** via GitHub Pages (legacy build from `/`) to https://hipdiscovery.github.io/Free-Sound-Effects/.
- Confirm a deploy by: fetching the changed file from the Pages URL and comparing its bytes with the commit.

## Production and destructive jobs
None.

## Cross-repo contracts (do not break)
- Inbound: `catalog.json` and `llms.txt` are the documented public machine interface for outside tools and agents. Keep IDs and paths stable.
- Outbound: none.

## Metered resources
- GitHub Pages only. No backend, trackers, paid infrastructure, hidden network calls or background crawlers.

## Secrets (names only)
None.

## Do not touch
- Original audio bytes and filenames under `audio/<source-id>/`, their SHA-256 hashes, and the evidence in `licenses/` and `docs/<source>-review.json`.
- Stable sound IDs, the 13 creative-direction IDs in `resources.json`, and relative Pages paths.

## Landmines
- Import only creator-verified CC0-1.0 audio, 5 MB per file at most. "Free", "royalty-free" or a social post does not establish redistribution rights; `scripts/validate.mjs` checks structure and hashes, not rights.
- `resources.json` lists outbound links, not mirrored assets or a redistribution grant. Do not host or fetch third-party binaries; the Sonniss GDC library is never for AI training.
- Preserve `playToken` fencing in `app.js`: one shared `Audio`, no autoplay, no simultaneous previews. The Pause button stops and clears the source; it does not resume.
- Exact-byte checks cannot catch re-encoded duplicates; listen before adding sounds.
- Licensing status per source lives in `docs/CREATOR_ASSET_LICENSES.md`. Only list entries whose licence is verified: `npm test` rejects reference collections, non-Google-Fonts font listings and the `check-item` rights class (retired 2026-11-16 with the Muaaz content).

Shared contract: hipdiscovery/claude-instructions/shared/AGENT-CONTRACT.md @ 2026-11-16
System map and shared ceilings: hipdiscovery/claude-instructions/SYSTEM.md
