# Agent Instructions & Guidelines

This project was scaffolded with `create-vy-project`.

## Active Stacks
- `nextjs-fullstack`

## Agent Workflow & Skill Guidelines
Before modifying, generating, or refactoring code in this repository, agents MUST consult the local skills located in `.agents/skills/`:

- **UI/UX Design Intelligence:** Check `.agents/skills/ui-ux-pro-max/` and `.agents/skills/design-taste-frontend/`.
- **Next.js & React Patterns:** Check `.agents/skills/react-nextjs-development/` and `.agents/skills/react-patterns/`.
- **Drizzle ORM & Database:** Check `.agents/skills/backend/` and `skills/backend/drizzle-patterns.md`.
- **Validation & Type Safety:** Check `.agents/skills/zod-validation-expert/`.
- **State Management:** Check `.agents/skills/zustand-store-ts/`.
- **Security & Hardening:** Check `.agents/skills/007/`.
- **Backend Architecture:** Check `.agents/skills/cc-skill-backend-patterns/`.

## Core Directives & Standards

### 1. File & Component Naming Conventions
- **PascalCase by Default:** All custom React components, layouts, sections, schemas, stores, database files, and providers MUST be named in **`PascalCase`** (e.g., `Navbar.tsx`, `HeroSection.tsx`, `LoginForm.tsx`, `UserSchema.ts`, `AuthStore.ts`, `Schema.ts`, `UserRepository.ts`).
- **Database Layer in `db/`:** All Drizzle ORM schemas, database connection singletons, and repositories MUST live in the `db/` directory.
- **UI Primitives Exception:** Files located inside `components/ui/` follow standard shadcn `kebab-case` conventions (e.g., `button.tsx`, `dropdown-menu.tsx`, `sheet.tsx`).
- **Next.js App Router Special Files:** Routing convention files retain Next.js standards (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `route.ts`).

### 2. Drizzle ORM Standards
- **Schema Single Source of Truth:** Tables declared in `db/Schema.ts` with explicit insert/select types.
- **Connection Singleton:** Use `db/Database.ts` singleton pattern to prevent connection leaks during Turbopack HMR.
- **Data Access:** All database queries must be encapsulated within repository classes in `db/`.
- **CLI Commands:**
  - `pnpm db:generate` (Generate SQL migrations)
  - `pnpm db:push` (Direct schema push for local rapid prototyping)
  - `pnpm db:studio` (Launch visual database GUI)
  - `pnpm db:migrate` (Run migrations)

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
