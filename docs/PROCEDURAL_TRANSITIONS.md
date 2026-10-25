# Procedural transition options — FFmpeg xfade

This optional **offline rendering** approach gives an editing agent more choices without buying project-specific templates. It is not a connected editor or a native CapCut feature. No installation or process is executed on the owner's computer by this repository.

## Built-in source and license

- FFmpeg filter reference: https://ffmpeg.org/ffmpeg-filters.html#xfade
- Open-source software licensing: https://ffmpeg.org/legal.html
- Machine-readable 40 curated built-in choices: [transition-presets.json](../transition-presets.json)
- Recorded check: `ffmpeg -hide_banner -h filter=xfade` on FFmpeg 7.1.5 in the independent test environment; both clips must be normalized.

## Practical example (no user content)

For two properly normalized streams of 2 seconds each, a 0.5-second overlap begins at 1.5 seconds:

```bash
ffmpeg -i first.mp4 -i second.mp4 \
  -filter_complex "[0:v][1:v]xfade=transition=wipeleft:duration=0.5:offset=1.5[v]" \
  -map "[v]" -an output.mp4
```

The example assumes matching inputs and intentionally omits audio. Real videos may need explicit scale, fps, pixel format, SAR and time-base normalization first; their audio must be processed separately. An actual output must be decoded and visually/audibly inspected. Never assume this one-line example will work for arbitrary recordings.

## Useful families

| Family | How it differs | Examples |
| --- | --- | --- |
| Subtle | Carefully paced unobtrusive transitions | fade, fadefast, smoothleft |
| Cinematic | Slow emotional and lighting changes | fadeslow, fadeblack, hblur, zoomin |
| Texture | Grain, brightness or blending | dissolve, fadegrays |
| Retro | Visual grammar of old displays and games | pixelize, circleopen, circleclose |
| Geometric | Distinct wipes, crops and panels | wipeleft, rectcrop, radial, diagbr |
| Action | Motion-driven change matched to footage | slideleft, coverup, squeezeh |
| Glitch | Intentionally fractured strips or winds | hlslice, v­uslice, hlwind |
| Experimental | Nonstandard distance reveals | distance |

### Audio

FFmpeg's `acrossfade` (https://ffmpeg.org/ffmpeg-filters.html#acrossfade) supports audio crossfading, independent of video transitions. Using it on music still requires a valid synchronized-use license for each target platform. Do not use copyrighted stream music as a source just because it is easily crossfaded.

### How to keep edits distinctive

First decide if a transition is even needed; a hard cut is often clearer. Choose distinct families across consecutive clips only when the subject supports it. Prefer continuity with actual camera movement and sound effects rather than random flash/wipe spam.

This is a procedural *option*, not proof that the future editing plugin can execute FFmpeg. An agent must check runtime capabilities before generating a result.