# Art directions and reusable creator assets

Reviewed 2026-10-25. This repository aims to help a human or future creative agent find **different appropriate looks** rather than repeatedly applying the same preset. The source library is editor-agnostic: each resource is an outbound pointer with license and format notes, not a downloaded template or connected action.

## Selection contract

1. Identify the actual scene, subject, audience, platform(s), emotional goal and available source footage before choosing any asset.
2. Propose **two or three genuinely different directions**, not one composition with three accent colors. Compare illustration vs photography, ambient vs impact-driven sound, caption hierarchy, and movement vocabulary.
3. Use `resources.json.directions[].assetIds` to shortlist providers, with `fontIds` as possible typography rather than mandatory. Check each actual item's license, technical format and publishing platform before importing.
4. Across consecutive pieces in the same project, avoid repeating the primary font pair, recurring impact sound, characteristic wipe and source composition when an equally good fit exists. Do not force novelty where simplicity is best.
5. For background generators, vary generator, palette and seed. Record deterministic settings in the working project for reproducible renders. Do not call paid hosted APIs or remote MCP plans automatically.
6. For audio, match type and intensity to the original scene. Keep copyrighted music from streams out of republished clips. Commercial video usage is not equivalent to permission for training a sound-generation model.
7. Export and inspect at actual viewing sizes. A license link, template file, rendered frame or passed build is not proof that audio/video editing and final playback work.
8. Machine-readable art directions are suggestions, not enforceable randomness or a claim that a future CapCut/ChatGPT plugin already supports external media ingestion.

## Available distinct looks

| Direction | Tone / use | Font options | Palette |
| --- | --- | --- | --- |
| Minimal editorial | Measured typography and real context; Explainer or readable guide | Inter, Newsreader, Space Grotesk | #F5F3EB · #16232D · #6D7E80 |
| Pixel arcade | Sharp 8-bit HUD and playful cues; Gaming, chat challenges or retro mood | Press Start 2P, Pixelify Sans, VT323 | #111827 · #69FFB1 · #F5CB48 |
| Sci-fi HUD | Futuristic interfaces and restrained glow; Tech and gaming tutorials | Orbitron, Oxanium, Space Grotesk | #09141F · #52E2E5 · #E6F7FF |
| Handmade notes | Sketchbook pen and imperfect marks; Commentary or personal storytelling | Permanent Marker, Caveat, Kalam | #FAF0DE · #22252D · #D77852 |
| Cinematic documentary | Natural footage, textured score and intentional pacing; Stories and emotional reveals | Fraunces, Newsreader, Space Grotesk | #191B1D · #C3B49C · #EFE5D7 |
| Analog VHS | Grain, light leaks and aged type; Retro recaps, nostalgia | Special Elite, Rubik Glitch, VT323 | #111218 · #F17AB1 · #D5CE92 |
| Bauhaus geometry | Bold custom shapes and contrast; Modern product or announcement | Syne, Bricolage Grotesque, Unbounded | #1B1C21 · #F3CD3E · #D94A45 |
| Quiet natural | Soft focus, sincere color and spacious pacing; Gentle tutorials, lifestyle | DM Sans, Fraunces, Caveat | #F6F2E8 · #81A294 · #4D605F |
| High-energy highlights | Decisive cuts, readable punchlines; Gameplay wins and competitive highlights | Black Ops One, Anton, Archivo Black | #18181C · #E9633C · #EEEEEE |
| Historical collage | Paper textures and unusual archival visuals; History and editorial formats | Cinzel, Fraunces, Newsreader | #2E2628 · #C6A66B · #EEE0C9 |
| Comic pop | Characterful stickers and playful block colors; Reactions and fun explainers | Luckiest Guy, Bungee, Righteous | #28233D · #EE5D86 · #F1E361 |
| Original 3D | Unique perspective and authored lighting; Original product or tech stage | Space Grotesk, Unbounded, DM Sans | #14212D · #92A8B1 · #EFC18A |
| Fantasy storybook | Warm parchment and decorative borders; Game lore or whimsical narrative | Cinzel, Uncial Antiqua, Fraunces | #342C2B · #C0A37F · #F1E4CC |

## Rights and software distinctions

- CC0 original-source art/audio may be flexible, but trademark, publicity and third-party rights are not waived automatically.
- CC0-filtered museums and Creative Commons search engines include assets that are **not** cleared. Select and verify the specific CC0-marked original work.
- Creative Commons BY music/icons need attribution; the source's actual wording and attribution placement must be respected.
- Sonniss free GDC bundles are media synchronization assets. Their license explicitly prohibits AI/ML training and standalone redistribution; their existence in the directory never authorizes training.
- MIT/GPL creative editors are tools for making assets, not licenses for files imported into those editors.
- Some free stock platforms include restricted-use/premium items; filters and per-item rights matter.
- The optional local Creatica CLI/MCP can produce deterministic backgrounds, but node/npm package retrieval needs network once and the *hosted* API/remote MCP can incur charges. Do not install or spend without authorization.

## Audit markers

- `assets[]`: publisher URL, license URL, kind, format, workflow note, original checked date, rights class, attribution and cautions.
- `fonts[]`: original font specimen/destination, stylistic classification, source-specific license note.
- `directions[]`: exactly named source/font IDs, a palette, recommended movement/audio language and an anti-pattern to avoid.
- `selectionPolicy`: explicit project-scoped avoidance of repeating visual formulas.
- Source references live in [CREATOR_ASSET_LICENSES.md](CREATOR_ASSET_LICENSES.md). Do not convert link counts into claims of downloaded pack/file counts.
