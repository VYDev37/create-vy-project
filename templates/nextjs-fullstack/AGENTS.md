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

### 4. Shadcn Component Reusability & Shared Design Primitives
- **Never Duplicate Styled Primitives:** Reusable and identical UI elements (buttons with brand accents/gradients, status badges, form inputs, dialog modals, sheet drawers, tooltips, cards) MUST reuse and extend shadcn UI primitives in `components/ui/`.
- **Accent & Variant Extension:** Add dedicated variants inside `buttonVariants` or component props (e.g. `variant="accent"`, `variant="glow"`, `size="sm"`) rather than writing ad-hoc inline Tailwind strings across multiple pages.
- **Sidebar Navigation:** Use the provided responsive, collapsible `Sidebar` component (`components/layout/Sidebar.tsx`) for dashboard layouts with active route highlighting.

### 5. Database Indexing Strategy (When to Index vs When NOT to Index)
- **When to Index (High Value):**
  - **Foreign keys & JOIN columns:** Always index references (`userId`, `tenantId`, `orderId`) to avoid full table scans during joins.
  - **High-cardinality lookup filters:** Unique columns frequently filtered in `WHERE` clauses (`email`, `username`, `slug`, `apiKey`).
  - **Sorting & Range Queries:** Frequently sorted timestamps in pagination (`createdAt DESC`).
  - **Composite Indexes:** Multiple columns queried together following the leftmost prefix rule.
- **When NOT to Index (Avoid Bloat & Slow Writes):**
  - **Low-cardinality boolean flags alone:** Standalone `isActive` or `isVerified` where full table scan is faster.
  - **Small / Static Tables:** Tables with < 500 rows.
  - **High-Throughput Counter Columns:** Rapidly mutated columns (`viewCount`, `lastSeenAt`) where B-tree index rebalancing degrades write throughput.
  - **Unbounded Text/JSON:** Avoid indexing raw long text without prefix or GIN/GiST.

### 6. Security & Error Leakage Prevention
- **Zero Internal Error Leakage:** Server Actions and Route Handlers MUST NEVER expose raw database error messages, SQL syntax strings, internal file paths, or stack traces in responses to the client.
- **Server-Side Logging:** Log raw errors exclusively to the server console (`console.error("[ERROR] ...", error)`).
- **Sanitized Client Feedback:** Return clean, user-friendly, sanitized messages to the frontend (e.g., `"Invalid credentials"`, `"Resource not found"`).

### 7. UI/UX Craft & Anti-Slop Principles
- **No Em-Dashes (`—`):** Never use em-dashes in user-facing copy or labels.
- **Single-Line Desktop Actions:** Navbar, primary CTA buttons, and header action rows must remain single-line without awkward wrapping.
- **Strict WCAG AA:** All text, badges, and form controls must maintain high contrast (minimum 4.5:1).

