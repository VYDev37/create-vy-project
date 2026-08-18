---
name: design-taste-frontend
description: Anti-slop frontend skill for landing pages, portfolios, and web apps. The agent reads the brief, infers the right design direction, and ships interfaces that do not look templated.
---

# Taste Skill: Anti-Slop Frontend Directives

> Professional UI design intelligence to stop AI from generating generic, templated, and boring interfaces.

---

## 0. Brief Inference & Anti-Default Discipline

Before generating UI or layout:
1. **Infer the page kind & audience:** SaaS, consumer app, developer tool, luxury brand, agency, or dashboard.
2. **Anti-Default Rules:**
   - NEVER default to centered hero over generic dark mesh gradient.
   - NEVER default to 3 equal feature cards with icons in colored circles.
   - NEVER default to random neon purple/cyan button glow.
   - Reach past clichés to create tailored visual rhythm.

---

## 1. The Three Dials

* **`DESIGN_VARIANCE: 7`** (1 = Strict Symmetry, 10 = Asymmetric Creative)
* **`MOTION_INTENSITY: 5`** (1 = Static, 10 = Cinematic Physics)
* **`VISUAL_DENSITY: 4`** (1 = Spacious/Airy, 10 = Dense Dashboard)

---

## 2. Layout & Rhythm Directives

1. **Hero Viewport Fitting:**
   - Hero must fit cleanly in initial viewport (`min-h-[100dvh]`).
   - Headline maximum 2 lines on desktop.
   - Subtext maximum 20 words and 3-4 lines.
   - CTAs immediately visible without scrolling.

2. **Hero Text Budget (Max 4 Text Elements):**
   - 1. Optional Eyebrow / badge
   - 2. Headline
   - 3. Subtext
   - 4. Primary CTA + max 1 Secondary CTA
   - *Logo walls and feature bullet lists belong in separate sections directly below hero.*

3. **Navigation Constraints:**
   - Desktop navigation renders on a **single line** (height 64px - 72px, max 80px).
   - Clean mobile sheet/drawer on `< 768px`.

4. **Section Layout Variation:**
   - Never repeat the same layout family across adjacent sections (e.g. avoid stacking multiple alternating zigzag image/text blocks).
   - Vary with bento grids, full-width focus blocks, vertical stat lists, and asymmetric columns.

5. **Eyebrow Restraint:**
   - Maximum 1 uppercase tracking eyebrow per 3 sections.
   - Let clear headlines speak for themselves.

6. **Buttons & CTAs:**
   - Button labels must fit on **one single line** at desktop (no wrapped multi-line buttons).
   - Use 1-3 words max for primary CTAs ("Get Started", "Book Demo", "Sign In").
   - Ensure WCAG AA contrast against button background (no white text on light buttons).

---

## 3. Visual Assets & Realism

1. **Real Images over Fake Divs:**
   - Never use fake `<div>` mock screenshots or hand-drawn CSS task lists.
   - Use real photography, high-res mockups, or clean component previews.
2. **Icons:**
   - Standardize on one icon family (Lucide, Radix, Phosphor).
   - Standardize `strokeWidth` globally (e.g. `1.75` or `2`).
   - Never use raw emojis as UI icons.
3. **Typography:**
   - Pair clean modern sans fonts (`Geist`, `Inter`, `Outfit`, `Cabinet Grotesk`).
   - If using serifs, use only for editorial/luxury branding with intentional descender clearance (`leading-[1.1]` min).
