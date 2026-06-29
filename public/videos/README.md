# Video assets

The site renders **without any video files** — every `<SmartVideo>` falls back to
an animated cinematic gradient if its source is missing or fails to load. To
upgrade to real footage, drop MP4 (H.264) files here using these exact names:

| File              | Used in            | Suggested content              |
| ----------------- | ------------------ | ------------------------------ |
| `hero.mp4`        | Hero background    | Sweeping cinematic FPV flight  |
| `showcase.mp4`    | Drone Showcase     | Hero airframe orbit / flight   |
| `gallery-1..5.mp4`| Video Gallery      | Mission footage clips          |
| `fleet-1..6.mp4`  | Drone Fleet grid   | Short per-airframe loops        |

Optional posters go in `public/videos/posters/` (`hero.jpg`, `showcase.jpg`).

## Turning videos on

By default the site **does not request any media** (so the Network tab stays
clean with no 404s). Once you've added the files above, enable playback:

```bash
# .env.local
NEXT_PUBLIC_ENABLE_VIDEO=true
```

Then restart the dev/build server.

**Optimization tips**

- Keep clips short (6–12s) and loopable; they are `muted` + `loop` + `playsInline`.
- Target ≤ 1080p and compress aggressively (e.g. `ffmpeg -crf 26 -preset slow`).
- Provide a poster image so the first frame paints instantly.
