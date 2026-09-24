# Agent Instructions & Guidelines

This project was scaffolded with `create-vy-project`.

## Active Stacks
- `react-vite`

## Agent Workflow & Skill Guidelines
Before modifying, generating, or refactoring code in this repository, agents MUST consult the local skills located in `.agents/skills/`:

- **General & Anti-Slop:** Read `.agents/skills/general/stop-slop.md` for clean, human, humble writing without AI buzzwords or em-dashes.
- **React Patterns & Vite Architecture:** Read `.agents/skills/frontend/react-patterns.md` and `.agents/skills/frontend/frontend-developer.md` for Vite client SPA architecture, hooks, and modular components.
- **State Management:** Read `.agents/skills/frontend/react-state-management.md` or `.agents/skills/zustand-store-ts/` for Zustand atomic selectors and client stores.
- **UI/UX Design Intelligence:** Consult `.agents/skills/frontend/ui-ux-pro-max.md` and `.agents/skills/frontend/taste-skill.md`.
- **Client API Integration:** Use `src/lib/ApiClient.ts` (Axios instance configured with `baseURL: import.meta.env.VITE_API_URL` and `withCredentials: true`).

---

## Core Directives & Standards

### 1. File & Component Naming Conventions
- **PascalCase by Default (Frontend & React):** All custom React components, layouts, sections, schemas, stores, and frontend providers MUST be named in **`PascalCase`** (e.g., `Navbar.tsx`, `HeroSection.tsx`, `LoginForm.tsx`, `UserSchema.ts`, `AuthStore.ts`, `UserProvider.tsx`).
- **Hook Naming Convention:** Custom hooks MUST be named in **`camelCase`** prefixed with `use` (e.g., `useTaskCard.ts`, `useKanbanColumn.ts`, `useDebounce.ts`, `useAuth.ts`) and located in `src/hooks/`.
- **UI Primitives Exception:** Files located inside `src/components/ui/` follow standard shadcn `kebab-case` conventions (e.g., `button.tsx`, `dropdown-menu.tsx`, `skeleton.tsx`, `sheet.tsx`).

### 2. React + Vite Client Architecture
- **Environment Variables:** Use `import.meta.env.VITE_*` (never `process.env`).
- **Path Alias:** Use `@/*` mapped to `./src/*`.
- **Client API Integration:** All API calls route through `src/lib/ApiClient.ts` (Axios instance configured with `baseURL: import.meta.env.VITE_API_URL` and `withCredentials: true`).
- **Hook-Driven Logic Separation:**
  - Components MUST remain clean, declarative presentation layers focused on JSX layout and styling.
  - Component business logic, handlers (drag-and-drop, inline editing, mutation triggers, dropdown action handlers), and complex local states MUST be abstracted into custom hooks in `src/hooks/`.
- **Strict File Length Limit (< 200 Lines):** Keep all component and hook files concise and modular under 200 lines. Extract subcomponents and hooks into dedicated files.

### 3. Type Safety & Single Source of Truth (Zod Rule)
- **Zero Arbitrary Types:** Never create loose, unvalidated TypeScript interfaces for core domain entities.
- **Schema-First Inference:** Always define runtime Zod schemas in `schemas/` (or `src/schemas/`) and infer types using `export type User = z.infer<typeof UserSchema>;`.

### 4. Shadcn Component Reusability & Shared Design Primitives
- **Never Duplicate Styled Primitives:** Reusable and identical UI elements (buttons with brand accents/gradients, status badges, form inputs, dialog modals, sheet drawers, tooltips, cards) MUST reuse and extend shadcn UI primitives in `src/components/ui/`.
- **Accent & Variant Extension:** Add dedicated variants inside `buttonVariants` or component props (e.g. `variant="accent"`, `variant="glow"`, `size="sm"`) rather than writing ad-hoc inline Tailwind strings across multiple pages.
- **Sidebar Navigation:** Use the provided responsive, collapsible `Sidebar` component (`src/components/layout/Sidebar.tsx`) for dashboard layouts with active route highlighting.

### 5. Client Error Handling & Sanitization
- **Clean User Notifications:** Display sanitized, friendly error messages from API responses using Toast/Alert components.
- **Console-Only Debugging:** Log detailed error objects to browser console only during development (`console.error`), never leaking stack traces or unhandled raw errors to user-facing modal screens.

### 6. UI/UX Craft & Anti-Slop Principles
- **No Em-Dashes (`—`):** Never use em-dashes in user-facing copy or labels.
- **No AI Buzzwords:** Keep copy simple, natural, and humble. Avoid words like "delve", "testament", "unleash", "elevate", "cutting-edge", "game-changer", "tapestry", "seamlessly", "enterprise-grade".
- **Single-Line Desktop Actions:** Navbar, primary CTA buttons, and header action rows must remain single-line without awkward wrapping.
- **Strict WCAG AA:** All text, badges, and form controls must maintain high contrast (minimum 4.5:1).


