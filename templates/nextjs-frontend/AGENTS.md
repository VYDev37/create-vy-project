# Agent Instructions & Guidelines

This project was scaffolded with `create-vy-project`.

## Active Stacks
- `nextjs-frontend`

## Agent Workflow & Skill Guidelines
Before modifying, generating, or refactoring code in this repository, agents MUST consult the local skills located in `.agents/skills/`:

- **UI/UX Design Intelligence:** Check `.agents/skills/ui-ux-pro-max/` and `.agents/skills/design-taste-frontend/`.
- **Next.js & React Patterns:** Check `.agents/skills/react-nextjs-development/` and `.agents/skills/react-patterns/`.
- **Validation & Type Safety:** Check `.agents/skills/zod-validation-expert/`.
- **State Management:** Check `.agents/skills/zustand-store-ts/`.
- **Client API Integration:** Use `lib/ApiClient.ts` (Axios instance configured with `baseURL: process.env.NEXT_PUBLIC_API_URL` and `withCredentials: true`).

## Core Directives & Standards

### 1. File & Component Naming Conventions
- **PascalCase by Default:** All custom React components, layouts, sections, schemas, stores, and providers MUST be named in **`PascalCase`** (e.g., `Navbar.tsx`, `HeroSection.tsx`, `LoginForm.tsx`, `UserSchema.ts`, `AuthStore.ts`).
- **UI Primitives Exception:** Files located inside `components/ui/` follow standard shadcn `kebab-case` conventions (e.g., `button.tsx`, `dropdown-menu.tsx`, `sheet.tsx`).
- **Next.js App Router Special Files:** Routing convention files retain Next.js standards (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`).

### 2. Client-Only Architecture
- **External Backend Integration:** All API calls route through `lib/ApiClient.ts` to the backend server (e.g., Go Fiber at `http://localhost:8080/api/v1`).
- **Auth Cookies:** Cookies are sent/received automatically via `withCredentials: true`.

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
