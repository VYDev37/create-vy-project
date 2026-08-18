# Next.js & Frontend Architecture Conventions

## 1. File and Component Naming Rules
- **PascalCase for Custom Code:** All custom React components, layouts, sections, schemas, stores, providers, and entity definitions MUST use **`PascalCase`**.
  - Components: `Navbar.tsx`, `Footer.tsx`, `HeroSection.tsx`, `LoginForm.tsx`, `BrandLogo.tsx`
  - Schemas: `UserSchema.ts`, `AuthSchema.ts`
  - Database: `schema.ts`, `database.ts`, `userRepository.ts` (inside `db/`)
  - Stores: `AuthStore.ts`, `UiStore.ts`
  - Providers: `ThemeProvider.tsx`, `AppProvider.tsx`
  - Hooks: `useAuth.ts`, `useLogin.ts`
- **Database Layer (`db/` Directory):** All Drizzle ORM schemas, database connection singletons, and repositories MUST live in `db/` (not `lib/`).
- **UI Primitives Exception:** Files inside `components/ui/` follow standard shadcn **`kebab-case`** conventions (`button.tsx`, `dialog.tsx`, `dropdown-menu.tsx`, `sheet.tsx`).
- **Next.js App Router Conventions:** Next.js reserved files follow framework standards (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `route.ts`).

## 2. Type Safety & Single Source of Truth (Zod Rule)
- **Zero Arbitrary Types:** Never create loose, freehand TypeScript interfaces for core domain entities (such as `User`, `SessionData`, `LoginInput`, `RegisterInput`).
- **Schema-First Inference:** Always define runtime validation schemas with Zod first in `schemas/`, then infer TypeScript types directly via `z.infer`:
  ```typescript
  import { z } from "zod";

  export const UserRoleSchema = z.enum(["USER", "ADMIN", "DEVELOPER"]).default("USER");
  export type UserRole = z.infer<typeof UserRoleSchema>;

  export const UserSchema = z.object({
    id: z.string().min(1),
    name: z.string().min(2),
    email: z.string().email(),
    role: UserRoleSchema,
    createdAt: z.string().optional(),
  });

  export type User = z.infer<typeof UserSchema>;
  ```
- **Type Aggregation:** Re-export inferred types from `types/index.ts` so application code imports clean types with guaranteed schema alignment.

## 3. UI/UX Principles
- **No Em-Dashes (`—`):** Do not use em-dashes in any text, headline, or copy.
- **Single-Line Desktop Navigation & CTAs:** Ensure primary buttons and navbars fit comfortably in a single line on desktop.
- **Strict WCAG AA:** Contrast ratio minimum 4.5:1 for all text and form fields.
