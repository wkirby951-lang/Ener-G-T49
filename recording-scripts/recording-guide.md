# Ener-G-T-49 Recording Master Guide

## Overview

This document provides technical specifications, tone guidelines, and file management conventions for recording all 35 guided session scripts. These recordings will be used in the Ener-G-T-49 app's session player for audio playback across 7 wellness modalities.

---

## File Naming Convention

All audio files follow this format:
```
{modality}-{segment}-{version}.{ext}
```

| Part | Values |
|------|--------|
| **modality** | `emdr`, `eft-tapping`, `faster-eft`, `tft-tapping`, `silva-mind-control`, `havening`, `deep-breathing` |
| **segment** | `teens`, `young-adults`, `adults`, `introduction`, `cheatsheet` |
| **version** | `v1` (increment for re-records) |
| **ext** | `.wav` (archive), `.mp3` (app delivery, 192 kbps), `.ogg` (optional fallback) |

**Example:** `emdr-teens-v1.mp3`

Recording script files (Markdown) use `{modality}-{segment}-recording.md`.

---

## Technical Specifications

| Parameter | Specification |
|-----------|-------------|
| **Sample rate** | 44.1 kHz (CD quality) |
| **Bit depth** | 16-bit (WAV archival), 192 kbps (MP3 delivery) |
| **Channels** | Mono (voice only) |
| **Format** | WAV for master archive, MP3 for app delivery |
| **Headroom** | -3dB peak maximum |
| **Noise floor** | Below -60dB (silent recording space) |
| **File naming** | See convention above |
| **Silence before/after** | 500ms silence at start, 1000ms at end |

### AI Voice Generation (ElevenLabs) Settings

| Parameter | Recommendation |
|-----------|---------------|
| **Stability** | 35–50% (allows natural inflection) |
| **Clarity + Similarity** | 60–75% |
| **Style Exaggeration** | 20–30% (keeps it natural, not theatrical) |
| **Speaker boost** | On |

---

## Tone & Voice Direction by Modality

| Modality | Voice Tone | Pace | Emotional Quality |
|----------|-----------|------|-------------------|
| **EMDR** | Warm, clinical, steady | Slow-moderate | Grounded, safe, professional |
| **EFT Tapping** | Encouraging, accessible | Moderate | Supportive, like a coach |
| **Faster EFT** | Conversational, curious | Moderate | Inquisitive, gentle-guide |
| **TFT Tapping** | Clear, structured | Moderate-crisp | Authoritative but kind |
| **Silva Mind Control** | Soothing, evocative | Slow | Hypnotic, spacious, trustworthy |
| **Havening** | Gentle, comforting | Slow | Nurturing, soft, safe |
| **Deep Breathing** | Calm, grounding | Slow-very slow | Meditative, warm, present |

---

## Voice Tone by Age Segment

| Age Group | Voice Energy | Speed | Language Register |
|-----------|-------------|-------|-------------------|
| **Teens (14–18)** | Warm, slightly upbeat; not "trying too hard to be cool" | Moderate-faster | Conversational, plain English, minimal jargon |
| **Young Adults (19–36)** | Professional warmth; peer-level respect | Moderate | Adult but not clinical; relatable |
| **Adults (37–65+)** | Deeply compassionate; unhurried gravitas | Slow-moderate | Respectful, spacious, wise |

---

## Pause & Timing Conventions

Use these annotations in scripts (kept in `[square brackets]` inline):

| Annotation | Meaning | Typical Duration |
|------------|---------|-----------------|
| `[pause 2s]` | Short pause for reflection | 2 seconds |
| `[pause 4s]` | Medium pause — let it land | 4 seconds |
| `[pause 6s]` | Long pause — spacious silence | 6 seconds |
| `[pause 8s+]` | Extended pause — deep processing | 8–15 seconds |
| `[breath]` | Audible breath or breathing cue | As natural |
| `[slow, calming tone]` | Pacing/energy instruction | N/A |
| `[empathetic]` | Emotional tone direction | N/A |
| `[firm but kind]` | Mild authority | N/A |
| `[conversational]` | Casual, natural delivery | N/A |
| `[rhythmic]` | Steady, paced delivery for tapping/breathing | N/A |
| `[guide through silently]` | Narration pauses while user does an action | Action-dependent |

---

## Pronunciation Guide (Common Terms)

| Term | Phonetic | Notes |
|------|----------|-------|
| Amygdala | uh-MIG-duh-luh | Brain's fear center |
| Depotentiation | dee-po-TEN-shee-AY-shun | "Unlocking" a memory's charge |
| Desensitization | dee-SEN-si-tie-ZAY-shun | EMDR phase |
| Bilateral | bye-LAT-er-ul | Both sides |
| Parasympathetic | PAIR-uh-sim-puh-THET-ik | Calming nervous system |
| Vagus nerve | VAY-gus nuv | Main parasympathetic nerve |
| Meridian | muh-RID-ee-un | Energy pathway |
| Acupressure | AK-yoo-PRESH-ur | Point stimulation |
| Algorithm | AL-guh-rith-um | TFT tapping sequence |
| Gamut | GAM-ut | TFT point on back of hand |
| Prānāyāma | prah-NAH-yah-mah | Yogic breathing |
| Ujjayi | oo-JAH-yee | Ocean breath |
| Diaphragmatic | DYE-uh-frag-MAT-ik | Belly breathing |
| Cortisol | KOR-tih-sol | Stress hormone |
| Neuroplasticity | NYUR-oh-plas-TIS-ih-tee | Brain's ability to change |
| Auto-regulation | AW-toh-reg-yoo-LAY-shun | The body's self-balancing |

---

## Runtime Estimation Method

Estimate runtime for each script using:
1. **Narrated words:** Average speaking rate of 150 words/min for guided sessions (allowing for slower delivery)
2. **Pauses:** Sum all timed pauses
3. **Breaths:** Count ~2 seconds each
4. **Actions:** Segments where user is doing actions silently (e.g., tapping a point) — add 80% of the narration pause

**Formula:** `Runtime = (word_count / 150) + pause_total + breath_total + action_time`

For the app UI, runtime estimates appear as: `~8 min`, `~16 min`, `~25 min` etc.

---

## Session Structure (All Guided Sessions)

Each recording script follows this structure:

1. **Header** — Modality, segment, runtime, file name
2. **Pronunciation notes** — Terms specific to this session
3. **Clean narration text** — Spoken word only, with `[annotation]` direction
4. **Runtime calculation** — At the bottom

---

## Quality Checklist

Before finalizing any recording:

- [ ] No markdown formatting, stage directions, or instructional asides in spoken text
- [ ] All timing annotations are accurate and complete
- [ ] Pronunciation guide covers all technical terms
- [ ] Emotional tone is specified for each section
- [ ] Runtime estimate is within ±30 seconds of actual spoken duration
- [ ] File named per convention above
- [ ] Intro/outro silence buffers accounted for

---

## Delivery Notes

- **Master WAV files**: Store as permanent archive (large, uncompressed)
- **MP3 delivery files**: 192 kbps, 44.1 kHz, mono — for app integration
- **Recording order priority**: EFT Tapping, Deep Breathing → EMDR → Faster EFT → TFT Tapping → Silva Mind Control → Havening  
- **Each recording should begin with 0.5s silence and end with 1.0s silence** for clean crossfading

---

*Version 1.0 — Prepared for Ener-G-T-49 content recording pipeline.*