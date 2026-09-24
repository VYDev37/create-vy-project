# Agent Instructions & Guidelines

This project is the monorepo for `create-vy-project`.

## Active Stacks
- `react-vite`
- `nextjs-fullstack`
- `nextjs-frontend`
- `go-fiber`
- `discord-bot`

## Agent Workflow & Skill Guidelines
Before modifying, generating, or refactoring code in this repository, agents MUST consult the local skills located in `skills/`:

- **General & Anti-Slop:** Read `skills/general/stop-slop.md` for clean, human, humble writing without AI buzzwords or em-dashes.
- **React Patterns & Vite Architecture:** Read `skills/frontend/react-patterns.md` and `skills/frontend/frontend-developer.md` for Vite client SPA architecture, hooks, and modular components.
- **State Management:** Read `skills/frontend/react-state-management.md` for Zustand atomic selectors and client stores.
- **UI/UX Design Intelligence:** Consult `skills/frontend/ui-ux-pro-max.md` and `skills/frontend/taste-skill.md`.
- **Backend Architecture & GORM:** Read `skills/backend/go-fiber-convention.md` and `skills/backend/gorm-patterns.md`.
- **Drizzle Patterns:** Read `skills/backend/drizzle-patterns.md`.

---

## Core Directives & Standards

### 1. File & Component Naming Conventions
- **PascalCase by Default (Frontend & React):** All custom React components, layouts, sections, schemas, stores, and frontend providers MUST be named in **`PascalCase`** (e.g., `Navbar.tsx`, `HeroSection.tsx`, `LoginForm.tsx`, `UserSchema.ts`, `AuthStore.ts`, `UserProvider.tsx`).
- **Hook Naming Convention:** Custom hooks MUST be named in **`camelCase`** prefixed with `use` (e.g., `useTaskCard.ts`, `useKanbanColumn.ts`, `useDebounce.ts`, `useAuth.ts`) and located in `src/hooks/`.
- **UI Primitives Exception:** Files located inside `src/components/ui/` follow standard shadcn `kebab-case` conventions (e.g., `button.tsx`, `dropdown-menu.tsx`, `skeleton.tsx`, `sheet.tsx`).
- **Golang Files (Strict Lowercase & snake_case):** All Golang source files (`.go`) MUST use **`lowercase`** and **`snake_case`** format (e.g., `user_handler.go`, `user_repository.go`, `user_service.go`, `auto_migrate.go`, `read_env.go`).

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
- **Never Duplicate Styled Primitives:** Reusable and identical UI elements (buttons with brand accents/gradients, status badges, form inputs, dialog modals, sheet drawers, tooltips, cards) MUST reuse and extend shadcn UI primitives in `components/ui/` (or `src/components/ui/`).
- **Accent & Variant Extension:** Add dedicated variants inside `buttonVariants` or component props (e.g. `variant="accent"`, `variant="glow"`, `size="sm"`) rather than writing ad-hoc inline Tailwind strings across multiple pages.
- **Sidebar Navigation:** Use the provided responsive, collapsible `Sidebar` component for dashboard layouts with active route highlighting.

### 5. Database Indexing Strategy (When to Index vs When NOT to Index)
- **When to Index (High Value):**
  - **Foreign keys & JOIN columns:** Always index references (`user_id`, `tenant_id`, `order_id`) to avoid full table scans during joins.
  - **High-cardinality lookup filters:** Unique columns frequently filtered in `WHERE` clauses (`email`, `username`, `slug`, `api_key`).
  - **Sorting & Range Queries:** Frequently sorted timestamps in pagination (`created_at DESC`, `deleted_at`).
  - **Composite Indexes:** Multiple columns queried together (e.g., `WHERE tenant_id = ? AND status = ?`) following the leftmost prefix rule.
- **When NOT to Index (Avoid Bloat & Slow Writes):**
  - **Low-cardinality boolean flags alone:** Standalone `is_active` or `is_verified` where the planner skips index anyway.
  - **Small / Static Tables:** Tables with < 500 rows.
  - **High-Throughput Counter Columns:** Rapidly mutated columns (`view_count`, `last_active_at`) where B-tree index rebalancing degrades write throughput.
  - **Unbounded Text/JSON:** Avoid indexing raw long text without prefix or GIN/GiST.

### 6. Security, Input Sanitization & Magic Bytes File Validation
- **Zero Internal Error Leakage:** API handlers MUST NEVER expose raw database error messages, SQL syntax strings, internal file paths, or stack traces in HTTP JSON responses.
- **Server-Side Logging:** Log raw errors exclusively to the server console or structured logger (`log.Printf("[ERROR] ...: %v", err)`).
- **Sanitized Client Responses:** Return clear, sanitized, user-friendly messages to the frontend (e.g., `"Invalid username or password"`, `"User not found"`, `"Invalid request payload"`).
- **Input Sanitization:** Always sanitize untrusted text inputs (e.g., `pkg.SanitizeString(input)`) to strip HTML/script tags and trim whitespace.
- **Magic Bytes File Upload Validation:** Never trust client-provided `Content-Type` headers or file extensions. Always inspect initial magic bytes using `http.DetectContentType` (`pkg.ValidateUploadedFile`), enforce payload size limits, and store files with cryptographically random filenames.

### 7. UI/UX Craft & Anti-Slop Principles
- **No Em-Dashes (`—`):** Never use em-dashes in user-facing copy or labels.
- **No AI Buzzwords:** Keep copy simple, natural, and humble. Avoid words like "delve", "testament", "unleash", "elevate", "cutting-edge", "game-changer", "tapestry", "seamlessly", "enterprise-grade".
- **Single-Line Desktop Actions:** Navbar, primary CTA buttons, and header action rows must remain single-line without awkward wrapping.
- **Strict WCAG AA:** All text, badges, and form controls must maintain high contrast (minimum 4.5:1).
