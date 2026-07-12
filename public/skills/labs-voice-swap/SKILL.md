---
name: labs-voice-swap
description: >-
  Replace a generated clip's voice with a chosen ElevenLabs ("labs") library voice via
  speech-to-speech (STS), preserving the clip's exact timing so lip-sync still holds. STS
  (not TTS) keeps the original delivery/cadence and only changes the timbre, so the new
  voice still matches the on-screen mouth. Works on ANY model's output that carries a voice
  — Kling (the Max the Dog case), Veo, etc. Use when an editor says "labs voice swap",
  "swap the voice", "run it through ElevenLabs / labs", "change Max's voice", "fix the voice
  on these clips", "re-voice". FLAGSHIP LOCKED CASE — Max the Dog: EVERY Max the Dog creative
  gets its clips re-voiced to the "Max the DOG" ElevenLabs voice (Kling animates him + gives
  him a voice, but the voice is never right, so it always goes through labs). Generalizes to
  any character with an ElevenLabs voice (DJ Clutch, etc.). Runs as a POST step after
  generation (and after audio-qc). NOT for: generating clips (hvg-flow / Kling fires),
  writing scripts (veo-script-writing), or first-pass audio defects (audio-qc).
---

# Labs Voice Swap — re-voice clips through ElevenLabs (lip-sync preserved)

Generated video sometimes nails a character's look/animation but misses the **voice**. The fix: take the clip's existing audio and re-voice it through a chosen ElevenLabs library voice with **speech-to-speech** — which preserves the timing, cadence, and emphasis (so it still matches the mouth) and only swaps the timbre. Then mux the new voice back onto the video. Model-agnostic — works on Kling clips (Max), Veo clips, anything that comes out with a voice.

Built 2026-06-13 (Max the Dog Best State Podcast). Proven end-to-end on a Max Houston clip — original 8.03s → swapped 8.03s, lip-sync intact.

## 🐕 Max the Dog — the locked default (ALWAYS swap)

**Every Max the Dog creative gets the voice swap — not optional.** Max's talking clips are generated on **Kling 3.0** (`kling3_0`, `sound on`) — Kling animates his Pixar face AND gives him a voice, but the voice is never right, so PFM always re-voices him through labs. Surface it on any Max creative and run it after his clips generate.

- **Voice:** `Max the DOG` · ElevenLabs voice id **`aS994IA3oAOJnVePk4nA`**
- Swap **only Max's talking clips** (the dog speaking) — leave human-character clips on their original audio unless the editor flags them. Filter by the Max clip naming (e.g. `--filter max_`) and spot-check the filtered set.

## The helper (does the whole pipeline)

`voice_swap.py` runs extract → STS (ElevenLabs API) → mux → duration-guard, per clip, batched (model-agnostic — feed it Kling or Veo mp4s):

```bash
# one clip
python3 ~/.claude/skills/labs-voice-swap/voice_swap.py --clip <clip.mp4> --voice-id aS994IA3oAOJnVePk4nA
# a folder, only matching clips
python3 ~/.claude/skills/labs-voice-swap/voice_swap.py --folder <video dir> --filter max_ --voice-id aS994IA3oAOJnVePk4nA
```

- Output → `<dir>/VoiceSwapped/<name>_vs.mp4` (NO overwrite of the originals).
- Key auto-read from `$ELEVENLABS_API_KEY` or the elevenlabs MCP entry in the Claude config.
- Model default `eleven_multilingual_sts_v2`. Parallel `--workers 4` (STS is rate-limited; keep modest).
- **Duration guard:** flags `⚠DURDRIFT` if a swapped clip's length drifts >0.2s from the original (lip-sync risk) — re-run or check that clip.
- Needs `ffmpeg` (uses it for extract+mux and duration; `ffprobe` not required).

**One-off / interactive single clip?** The `elevenlabs` MCP `speech_to_speech` tool (voice_name="Max the DOG") + a manual ffmpeg mux works too — but for any batch use the helper (direct API, one pass, no per-clip tool calls).

## Workflow

1. **Identify the clips + the voice.** Which clips re-voice (for Max: his talking clips), and the target ElevenLabs voice. Find the voice id with the elevenlabs MCP `search_voices` if needed (Max = `aS994IA3oAOJnVePk4nA`).
2. **Prove one clip first** (new character / first run): swap one, deliver the before/after pair the instant it lands (Rule 5) — 📲 tappable CloudFront links for BOTH clips via `higgsfield upload create "<file>" --json` + render them in the Higgsfield widget (`show_medias` on the uploads) — and get the editor's ear on it before the batch. Never hold the proof clip for your own QC listen first.
3. **Batch** via the helper over the clip folder with the right `--filter`.
4. **QC:** scan the run output for `⚠DURDRIFT` or `STS_FAIL`; spot-listen a couple. Re-run failures.
5. **Deliver:** Lucid handoff (📁/🔗/🦊) for the `VoiceSwapped/` folder. The swapped clips are what go into the edit (originals stay as backup).

## Where it sits in the pipeline

Generation (Kling fire for Max / hvg-flow Veo for others) → download → `audio-qc` / `visual-qc` → **labs-voice-swap (this skill)** → edit. Final voice step on the raw clips, before assembly.

## House rules

- **STS, never TTS** — TTS loses the timing and breaks lip-sync; STS preserves it.
- **No overwrite** — swapped clips go to `VoiceSwapped/`, originals untouched.
- **Swap only the right character's clips** — filter, and verify the filtered set.
- **Prove-one-first** for any new character/voice before batching.
- Lucid handoff (📁/🔗/🦊) on the delivered folder.

## Cross-references

- elevenlabs MCP — `speech_to_speech`, `search_voices` ("Max the DOG" lives here).
- Kling 3.0 (`kling3_0`) / `hvg-flow` — generate the clips this re-voices; bake this in as the post-gen voice step for Max.
- `audio-qc` — runs before this; the swap is the timbre fix after.
- Memory: `feedback_max_the_dog_voice_swap`, `project_max_best_state_podcast_queue`, `feedback_veo_lite_audio_ceiling_ugc` ("post is the only ceiling-breaker").
