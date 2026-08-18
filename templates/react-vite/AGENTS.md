# Agent Instructions & Guidelines

This project was scaffolded with `create-vy-project`.

## Active Stacks
- `react-vite`

## Agent Workflow & Skill Guidelines
Before modifying, generating, or refactoring code in this repository, agents MUST consult the local skills located in `.agents/skills/`:

- **UI/UX Design Intelligence:** Check `.agents/skills/ui-ux-pro-max/` and `.agents/skills/design-taste-frontend/`.
- **React Patterns:** Check `.agents/skills/react-patterns/`.
- **Form Validation:** Use `react-hook-form` with `@hookform/resolvers/zod`.
- **State Management:** Check `.agents/skills/zustand-store-ts/`.
- **Client API Integration:** Use `src/lib/ApiClient.ts` (Axios instance configured with `baseURL: import.meta.env.VITE_API_URL` and `withCredentials: true`).

## Core Directives & Standards

### 1. File & Component Naming Conventions
- **PascalCase by Default:** All custom React components, layouts, sections, schemas, stores, and providers MUST be named in **`PascalCase`** (e.g., `Navbar.tsx`, `HeroSection.tsx`, `LoginForm.tsx`, `UserSchema.ts`, `AuthStore.ts`).
- **UI Primitives Exception:** Files located inside `src/components/ui/` follow standard shadcn `kebab-case` conventions (e.g., `button.tsx`, `dropdown-menu.tsx`, `sheet.tsx`).

### 2. Vite Client Architecture
- **Environment Variables:** Use `import.meta.env.VITE_*` (not `process.env`).
- **Path Alias:** Use `@/*` mapped to `./src/*`.
- **External Backend Integration:** All API calls route through `src/lib/ApiClient.ts` to the backend server (e.g., Go Fiber at `http://localhost:8080/api/v1`).

### 3. Type Safety & Single Source of Truth (Zod Rule)
- **Zero Arbitrary Types:** Never create loose, unvalidated TypeScript interfaces for core domain entities.
- **Schema-First Inference:** Always define runtime Zod schemas in `schemas/` and infer types using:
  ```typescript
  export const UserSchema = z.object({ ... });
  export type User = z.infer<typeof UserSchema>;
  ```

### 4. UI/UX Craft & Anti-Slop Principles
- **No Em-Dashes (`—`):** Never use em-dashes in user-facing copy or labels.
- **Single-Line Desktop Actions:** Navbar, primary CTA buttons, and header action rows must remain single-line without awkward wrapping.
- **Strict WCAG AA:** All text, badges, and form controls must maintain high contrast (minimum 4.5:1).
