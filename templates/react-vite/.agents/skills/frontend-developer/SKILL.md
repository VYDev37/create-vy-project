---
name: frontend-developer
description: "Expert in building modular, accessible, high-performance user interfaces in React, Vite, and TypeScript."
category: granular-workflow-bundle
risk: safe
source: personal
date_added: "2026-02-27"
---

# Frontend Developer Guide & Best Practices

Expert standards for building accessible, maintainable, and high-performance user interfaces in React, Vite, and TypeScript.

## 1. Core Principles
- **Component Single Responsibility**: A component should focus on doing one thing well.
- **Props Down, Events Up**: Pass clean data down to child components via typed props; notify parent components via callback handlers (`onSuccess`, `onChange`, `onSelect`).
- **Composition Over Inheritance**: Use compound component patterns and children slots.
- **File Length Limit (< 200 Lines)**: Keep files focused. Extract subcomponents if exceeding 200 lines.

## 2. Component Design & Hierarchy
| Type | Role | State Allowed? | Example |
|---|---|---|---|
| **Page Component** | Route entrypoint | Routing & layout wiring | `src/pages/home/index.tsx` |
| **Section Component** | Landing page block | Local UI / async state | `CurrencySection.tsx`, `HeroSection.tsx` |
| **Presentational** | Visual rendering, styling | Props only | `BrandLogo.tsx`, `ThemeToggle.tsx` |
| **UI Primitive** | Design system element | Unstyled / accessible state | `button.tsx`, `dialog.tsx` |

## 3. Accessibility & UX Quality (WCAG 2.1 AA)
- **Semantic HTML**: Use proper elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<button>`, `<a>`).
- **Focus Rings**: Ensure interactive elements have visible `:focus-visible` states.
- **Contrast**: Maintain minimum 4.5:1 text contrast ratio in both dark and light modes.
- **Aria Labels**: Provide descriptive `aria-label` for icon-only buttons.

## 4. Re-render Optimization & Clean State
- **Atomic Selectors in Zustand**: Extract only needed state slices (`useStore(state => state.user)`).
- **Derived State**: Compute values on the fly during render rather than syncing them to extra `useState` and `useEffect`.
- **Form Ref Forwarding**: Inputs connected to React Hook Form must forward refs using `React.forwardRef`.
