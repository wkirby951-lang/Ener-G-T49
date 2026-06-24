# Ener-G-T-49 — Brand Identity & UI Design Documentation

## Overview

This document catalogs all design assets produced for the Ener-G-T-49 wellness app, including brand identity, color palette, typography, UI mockups, and design rationale.

---

## 1. Logo Concepts

### Primary Logo — `ener-g-t-49-logo-main.png`
A circular mandala-wave hybrid icon with "Ener-G-T-49" wordmark below. The icon combines:
- A **calming circular mandala** ring representing mindfulness, meditation, and wholeness
- A **flowing energy wave** through the center representing vitality, healing energy, and bilateral stimulation (core to EMDR / EFT)
- Gradient from deep navy blue → soft teal → sage green

**Rationale:** The circle grounds the brand in calm and safety. The wave injects dynamism without breaking the peace — conveying that this app is about *active healing*, not passive relaxation only.

### Alternative Logo — `ener-g-t-49-logo-alt.png`
A more abstract geometric icon: a circle divided into a brain-hemisphere shape on one side and a breath/wave flow on the other.

**Use case:** Favicon, avatar, watermark, or when the wordmark is shown separately.

---

## 2. App Icon — `ener-g-t-49-app-icon.png`
Simplified circular icon with energy wave flowing through center.
- **Background:** Deep navy blue (#1A2A3A)
- **Foreground:** Teal-to-sage gradient wave
- **Style:** Minimal, high contrast, recognizable at small sizes
- **Use:** iOS/Android home screen, favicon base, social media profile

---

## 3. Color Palette & Style Tile

| Color Name | Hex Code | Role |
|---|---|---|
| **Deep Navy Blue** | `#1A2A3A` | Primary brand color, dark mode background, headings |
| **Ocean Blue** | `#2C6E9C` | Secondary, CTAs, interactive elements, links |
| **Soft Teal** | `#4A9E8E` | Accent, progress indicators, "active" states |
| **Sage Green** | `#7CA982` | Accent, healing/growth associations, badges |
| **Warm Sand** | `#E8D5C4` | Light mode backgrounds, card surfaces |
| **Soft Ivory** | `#F5F0EB` | Page background, lightest background tone |
| **Charcoal** | `#2D2D2D` | Primary text color |
| **Warm Gray** | `#6B6B6B` | Secondary text, meta information |
| **White** | `#FFFFFF` | Cards, overlays, contrast elements |

### Color Psychology
- **Deep blues** → Trust, professionalism, science-backed credibility
- **Teals & greens** → Healing, growth, emotional balance
- **Warm neutrals** → Comfort, approachability, age-inclusivity

---

## 4. Typography

| Use | Font | Weight | Size Range |
|---|---|---|---|
| **Headings (H1-H3)** | Montserrat | Bold (700), Semi-Bold (600) | 24px–48px |
| **Subheadings** | Montserrat | Medium (500) | 18px–22px |
| **Body text** | Inter | Regular (400) | 14px–18px |
| **Small / Caption** | Inter | Regular (400) | 11px–13px |
| **Buttons / CTAs** | Montserrat | Semi-Bold (600) | 14px–18px |

**Rationale:** Montserrat conveys professionalism and modernity. Inter is highly readable at small sizes across devices. Pairing them gives clear visual hierarchy.

### Spacing System
- Base unit: 4px (4/8/12/16/20/24/32/40/48/64/80)
- Section padding: 80px (desktop), 40px (mobile)
- Card padding: 24px
- Border radius: 12px (cards), 20px (buttons), 8px (inputs)

---

## 5. Landing Page Mockups

### Hero Section — `mockups/landing-page-hero.png`
- Full-width hero with gradient background (navy → teal)
- Headline: "Your All-in-One Wellness Toolkit"
- Subheadline listing all 7 modalities: EMDR, EFT Tapping, Faster EFT, TFT, Silva Mind Control, Havening, Deep Breathing
- Three age segment callout boxes (14–18, 19–36, 37–65+)
- CTA: "Start Your Free 30-Day Trial"
- Logo top-left, minimal nav (Features, Pricing, About)

### Features Section — `mockups/features-section.png`
- 3×2 grid of feature cards
- Each card has a simple icon + technique name + 1-line description
- Icons represent: eye movement (EMDR), finger points (EFT), brain waves (Silva), hands (Havening), lungs (Breathing), meridian dots (TFT)
- Warm sand background for contrast with white cards

### Pricing Cards — `mockups/pricing-cards.png`
- Four plan tiers in a row: Monthly ($9.99), 3-Month ($23), 6-Month ($42), Annual ($69.99)
- "Best Value" badge on Annual plan
- Lifetime option ($99.99) as a highlighted callout below
- A la carte ($5/session) as small text note
- 30-day free trial banner across top
- Dark text on white cards, soft teal CTAs

---

## 6. Session Player UI — `mockups/session-player-ui.png`
Mobile screen (phone frame) showing a guided session in progress:
- **Dark mode** — navy background reduces eye strain during sessions
- **Central pulsing circle** — represents bilateral stimulation (EMDR visual cue)
- **Session info** — "Guided EFT Tapping - Anxiety Relief" at top
- **Progress** — 4:32 / 12:00 circular timer
- **Controls** — Play/pause, skip, rewind, volume at bottom
- **Accent glow** — Soft teal pulsing animation around the circle

**Key UX decisions:**
- Dark mode as default for sessions (calming, less sensory overload)
- Large, touch-friendly controls (accessible for all ages)
- Minimal UI — no distracting elements during a session
- The pulsing circle doubles as a visual anchor for focused attention

---

## 7. Dashboard Concept — `mockups/dashboard-concept.png`
Mobile screen showing user progress:
- **Greeting** — "Good morning, Alex" with personalization
- **Streak counter** — "12-day streak" (motivational gamification)
- **Mood tracker** — Weekly row of emoji-based mood entries
- **Progress ring** — "24 sessions this month" donut chart
- **Quick-launch cards** — EMDR, EFT Tapping, Deep Breathing, Havening shortcuts
- **Resume banner** — "Continue where you left off"
- **Bottom nav** — Home, Explore, Sessions, Profile

**Key UX decisions:**
- Emoji mood tracker is low-friction (teens and adults alike)
- Streak counter builds habit formation (behavioral psychology)
- Quick-launch reduces cognitive load for anxious users
- Progress ring provides visual sense of accomplishment

---

## 8. File Inventory

```
ener-g-t-49/design/
├── index.md                           ← This file
├── ener-g-t-49-logo-main.png          ← Primary logo (1024×1024)
├── ener-g-t-49-logo-alt.png           ← Alternative logo (1024×1024)
├── ener-g-t-49-app-icon.png           ← App icon (1024×1024)
├── style-tile.md                      ← Color palette & typography reference
│
└── mockups/
    ├── landing-page-hero.png          ← Hero section (1536×1024)
    ├── features-section.png           ← Features grid (1536×1024)
    ├── pricing-cards.png              ← Pricing tiers (1536×1024)
    ├── session-player-ui.png          ← Session player (1024×1536)
    └── dashboard-concept.png          ← User dashboard (1024×1536)
```

---

## 9. Design Principles Applied

1. **Calm over flashy** — The app serves anxious users; every visual decision reduces cognitive load
2. **Science-backed aesthetic** — Clean, professional, not "woo-woo" — builds trust
3. **Age-inclusive** — Not too youthful (avoids alienating 37–65+), not too clinical (avoids intimidating teens)
4. **Accessible** — High contrast text, large touch targets, clear hierarchy
5. **Dark-mode native** — Sessions use dark mode; light mode for browsing content
6. **Consistent spacing** — 4px grid system ensures visual rhythm across all screens

---

## 10. Next Steps / Handoff Notes for Lead Engineer

The lead-engineer should reference these mockups for implementing the public website on port 3000. Key specs:

- **Primary brand color:** `#1A2A3A` (navy)
- **Primary CTA color:** `#2C6E9C` (ocean blue)
- **Font stack:** `'Montserrat', sans-serif` (headings), `'Inter', sans-serif` (body)
- **CSS can use:** Google Fonts for Montserrat + Inter
- **Landing page sections to build:** Hero → Features → Age Segments → Pricing → CTA
- **Mobile-first responsive design** (all mockups emphasize mobile as primary)
- **App icon as favicon** — can use `ener-g-t-49-app-icon.png` (resize to 32×32 / 16×16)