# Next.js & Frontend Architecture Conventions

## 1. File and Component Naming Rules
- **PascalCase for Custom Code:** All custom React components, layouts, sections, schemas, stores, providers, and entity definitions MUST use **`PascalCase`**.
  - Components: `Navbar.tsx`, `Footer.tsx`, `HeroSection.tsx`, `LoginForm.tsx`, `BrandLogo.tsx`
  - Dashboard: `DashboardHeader.tsx`, `DashboardStatusBanner.tsx`, `DashboardProfileCard.tsx`
  - Schemas: `UserSchema.ts`, `AuthSchema.ts`, `CurrencySchema.ts`
  - Database: `schema.ts`, `database.ts`, `seed.ts` (inside `db/`)
  - Stores: `AuthStore.ts`, `UiStore.ts`
  - Providers: `ThemeProvider.tsx`, `AppProvider.tsx`, `UserProvider.tsx`
  - Hooks: `useAuth.ts`, `useMounted.ts`
- **Database Layer (`db/` Directory):** All Drizzle ORM schemas, database connection singletons, and seeders MUST live in `db/` (not `lib/`).
- **UI Primitives Exception:** Files inside `components/ui/` follow standard shadcn **`kebab-case`** conventions (`button.tsx`, `dialog.tsx`, `dropdown-menu.tsx`, `skeleton.tsx`, `sheet.tsx`).
- **Next.js App Router Conventions:** Next.js reserved files follow framework standards (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `route.ts`, `proxy.ts`).

## 2. Server Component Priority, Colocation & Component Separation
- **Server Component First (`page.tsx`):** Every Next.js page (`page.tsx`) must default to a **Server Component**.
  - Perform server-side session checks, route protection (`redirect("/login")`), and initial data fetching directly inside `page.tsx`.
  - Export explicit, SEO-friendly `Metadata` on every `page.tsx` without AI buzzwords or slop.
- **Colocated Client Components (`[Feature]Client.tsx`):** When a page requires interactive client state or hooks, place the client wrapper directly side-by-side in the same route folder (e.g. `app/(dashboard)/dashboard/DashboardClient.tsx` directly alongside `page.tsx`).
- **Route-Level `loading.tsx` Over Manual Branches:** Use Next.js's built-in `loading.tsx` in the route directory segment for Suspense boundaries and skeleton loaders rather than mixing messy `if (isLoading) return <Skeleton />` branches inside page components.
- **Isolate Client Components to Leaves:** Push `'use client'` down to the smallest interactive units (e.g. `SignOutButton.tsx`, `ThemeToggle.tsx`, `LoginForm.tsx`).
- **Strict File Length Limit (< 200 Lines):** No file should exceed 200 lines. Split pages into focused, modular subcomponents located in dedicated folders (e.g. `components/dashboard/`, `components/sections/`, `components/auth/`).

## 3. Next.js 16 `proxy.ts` & BFF API Proxy
- **Next.js 16 `proxy.ts` File Convention:** Place `proxy.ts` at the root to export `export function proxy(request: NextRequest)` (the Next.js 16 recommended replacement for `middleware.ts`).
  - Use `proxy.ts` for optimistic session cookie inspection, redirecting unauthorized users before HTML rendering, and custom header rewriting.
  - Export `export const middleware = proxy;` for backwards-compatibility.
- **BFF Route Handler Proxy (`app/api/[...proxy]/route.ts`):** In frontend-only stacks connected to backend services (like Go Fiber), use a catch-all route handler proxy to forward cookies, headers, and request bodies cleanly without CORS issues.

## 4. Pure Zustand Global State & Server Hydration (No Heavy React Context)
- **Zero React Context Overhead:** Avoid heavy React Context wrappers that trigger unnecessary tree re-renders across the app. Use **Zustand v5** as the single source of truth for global client state.
- **Server-to-Zustand Hydration:** In `app/layout.tsx`, pass `initialUser` into `<UserProvider initialUser={session.user}>`. The `UserProvider` initializes `useAuthStore.setState()` directly during initial render without React Context.
- **Atomic Selectors:** Consume state with atomic selectors to guarantee maximum render performance:
  ```typescript
  // In any client component:
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  ```

## 5. Type Safety & Single Source of Truth (Zod Rule)
- **Zero Arbitrary Types:** Never create loose, freehand TypeScript interfaces for core domain entities.
- **Schema-First Inference:** Always define runtime validation schemas with Zod first in `schemas/`, then infer TypeScript types directly via `z.infer`:
  ```typescript
  import { z } from "zod";

  export const UserRoleSchema = z.enum(["USER", "ADMIN", "DEVELOPER"]).default("USER");
  export type UserRole = z.infer<typeof UserRoleSchema>;

  export const UserSchema = z.object({
    id: z.string().min(1),
    username: z.string().min(3),
    name: z.string().min(2),
    email: z.string().email(),
    role: UserRoleSchema,
    createdAt: z.string().optional(),
  });

  export type User = z.infer<typeof UserSchema>;
  ```

## 6. UI/UX Principles & Anti-Slop Standards
- **No Em-Dashes (`—`):** Do not use em-dashes in any text, headline, or copy.
- **No Overused AI Clichés:** Keep copy simple, natural, and humble. Avoid words like "delve", "testament", "unleash", "elevate", "cutting-edge", "game-changer", "tapestry", "seamlessly", "enterprise-grade".
- **Single-Line Desktop Navigation & CTAs:** Ensure primary buttons and navbars fit comfortably in a single line on desktop.
- **Strict WCAG AA:** Contrast ratio minimum 4.5:1 for all text and form fields.
