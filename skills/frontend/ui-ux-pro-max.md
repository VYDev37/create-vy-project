---
name: ui-ux-pro-max
description: "UI/UX design intelligence for web, mobile, and desktop. Use when designing, building, reviewing, or fixing interfaces, design systems, accessibility, interaction, responsive layout, typography, color, charts, and stack-specific UI."
---

# UI/UX Pro Max - Design Intelligence

Design intelligence and system generation across 84 UI styles, 192 color palettes, 74 font pairings, 119 UX guidelines, and 25 chart types.

## When to Apply
Use this skill whenever the task involves **UI structure, visual design decisions, component design, interaction patterns, or UX quality control**:
- Designing new pages and dashboards
- Creating or refactoring UI components
- Choosing color, typography, spacing, and layout systems
- Reviewing UI for UX, accessibility, and consistency
- Implementing navigation, animations, and responsive behavior

## Rule Categories by Priority

| Priority | Category | Impact | Key Checks (Must Have) | Anti-Patterns (Avoid) |
|---|---|---|---|---|
| 1 | **Accessibility** | CRITICAL | Contrast 4.5:1, Alt text, Keyboard nav, Focus rings visible | Removing focus rings, Icon-only buttons without aria-labels |
| 2 | **Touch & Interaction** | CRITICAL | Min target 44×44px, 8px+ spacing, Immediate tactile feedback | Reliance on hover only, 0ms instant state transitions |
| 3 | **Performance** | HIGH | WebP/AVIF, Lazy loading, Reserve space (CLS < 0.1) | Layout thrashing, Cumulative layout shifts |
| 4 | **Style Selection** | HIGH | Match product type, Consistency, SVG icons (no emojis) | Mixing flat & skeuomorphic randomly, Emojis as icons |
| 5 | **Layout & Responsive** | HIGH | Mobile-first breakpoints, Viewport meta, `min-h-[100dvh]` | Horizontal scroll, Fixed px container widths, `h-screen` |
| 6 | **Typography & Color** | MEDIUM | Base 16px, Line-height 1.5, Semantic tokens, Max 1 accent | Text < 12px body, Gray-on-gray, AI-purple gradients |
| 7 | **Animation** | MEDIUM | Context-aware timing (150-300ms), Spatial continuity | Animating width/height (use transform/opacity), No reduced-motion |
| 8 | **Forms & Feedback** | MEDIUM | Labels ABOVE inputs, Inline field errors, Loading states | Placeholder-as-label, Errors only at top of page |
| 9 | **Navigation Patterns** | HIGH | Single-line desktop nav, Height ≤ 80px, Responsive drawer | Overloaded 2-line navs, Missing mobile menu |
| 10 | **Data & Visuals** | MEDIUM | Real photography/icons, No fake screenshot divs | Raw text lists without visual cards or rhythm |

---

## Design System Generation Directives

### 1. Color System
- **Neutral Base:** Neutral slate, zinc, or stone scale.
- **Accents:** 1 primary accent color (saturation < 80%) + contextual semantics (success, error, warning).
- **Anti-Pattern:** Banned AI purple/cyan gradient glow buttons unless explicitly requested.
- **Consistency Lock:** Once an accent color is chosen, apply it consistently across all sections.

### 2. Typography Pairings
- **Sans Default:** `Geist`, `Inter`, `Outfit`, `Cabinet Grotesk`, `Satoshi`.
- **Display/Headlines:** `text-4xl md:text-6xl tracking-tighter leading-tight`.
- **Body:** `text-base text-muted-foreground leading-relaxed max-w-[65ch]`.
- **Italic Descender Clearance:** When using italic display font, use `leading-[1.1]` min and `pb-1` to prevent clipping descenders (`g`, `y`, `j`, `p`, `q`).

### 3. Component & Layout Rules
- **Viewport Stability:** Use `min-h-[100dvh]` rather than `h-screen`.
- **Grid Layouts:** Use CSS Grid (`grid grid-cols-1 md:grid-cols-3 gap-6`) instead of complex flex percentage calculations.
- **Shape Scale Lock:** Maintain unified border radius across buttons (`rounded-lg` or `rounded-full`), inputs (`rounded-md`), and cards (`rounded-xl`).
- **Tactile Feedback:** Apply `:active` micro-states (`active:scale-[0.98]` or `active:translate-y-[1px]`).

---

## Pre-Delivery Checklist
- [ ] No emojis as icons (use SVG: Lucide/Phosphor/Radix).
- [ ] `cursor-pointer` on all interactive buttons and links.
- [ ] Light/Dark mode contrast ratio meets WCAG AA 4.5:1 minimum.
- [ ] Form labels placed above inputs (never placeholder as sole label).
- [ ] Focus rings visible for keyboard navigation (`focus-visible:ring-2`).
- [ ] `prefers-reduced-motion` respected in animations.
- [ ] Responsive across standard viewports: 375px, 768px, 1024px, 1440px.
- [ ] No horizontal scrolling on mobile viewports.
