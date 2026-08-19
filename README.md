# create-vy-project

A personal collection of clean, well-structured starter templates for web projects. Free and open for anyone to use.

The goal of this project is simple: eliminate repetitive setup work by providing tidy boilerplate code with sensible conventions, clear organization, and straightforward type safety.

---

## What is Included

- **Simple & Organized**: Clean folder structures, clear naming, and no unnecessary abstractions.
- **Modern Stacks**: Next.js 16 (App Router), Go (Fiber v3), React 19 (Vite), and Tailwind CSS v4.
- **Flexible Database Choice**: Choose between **SQLite** (embedded, zero-config local prototyping) or **PostgreSQL** (production-ready, Supabase, Neon, Docker) for both Next.js Fullstack and Go Fiber backends.
- **Working Authentication**: Sensible auth setups with Argon2 password hashing, secure sessions, and HTTP-only cookies.
- **Type-Safe Validation**: Schema-first forms and requests powered by Zod and React Hook Form.
- **AI-Agent Ready**: Includes local `.agents/skills/` and `AGENTS.md` to help AI coding assistants follow project rules.

---

## Quick Start

Run the interactive CLI to create a new project:

```bash
# Using pnpm (recommended)
pnpm dlx create-vy-project

# Using npm
npx create-vy-project

# Using bun
bunx create-vy-project
```

You can also scaffold directly into your current directory:
```bash
pnpm dlx create-vy-project .
```

---

## Available Templates & Database Options

### 1. Next.js 16 Fullstack (`fullstack`)
A complete Next.js starter with Drizzle ORM, local authentication, and selectable database:
* **Framework**: Next.js 16 with React 19
* **Database Options**:
  - **SQLite**: Drizzle ORM with LibSQL (zero-config local embedded database)
  - **PostgreSQL**: Drizzle ORM with Postgres.js (`postgres` driver)
* **Auth**: Argon2id password hashing and Iron Session cookie storage
* **Commands**:
  - `pnpm dev`: Start the development server
  - `pnpm db:seed`: Create the default demo user
  - `pnpm db:push`: Apply schema changes to the database
  - `pnpm db:studio`: Open the visual database viewer

### 2. Go Fiber + Frontend Combo (`frontend+backend`)
Separate backend and frontend folders for projects that need a Go API:
* **Backend (`backend/`)**: Go Fiber v3 with GORM and cookie-based JWT authentication
  - **SQLite Option**: Pure Go SQLite driver (`github.com/glebarez/sqlite`, zero-CGO required)
  - **PostgreSQL Option**: Standard GORM PostgreSQL driver (`gorm.io/driver/postgres`)
* **Frontend (`frontend/`)**: Your choice of **Next.js 16 Client** or **React 19 Vite**
* **Usage**:
  ```bash
  # 1. Run backend
  cd backend && go run ./internal/scripts/auto_migrate.go && go run ./cmd/main.go

  # 2. Run frontend
  cd frontend && pnpm install && pnpm dev
  ```

### 3. React Vite SPA (`frontend`)
A lightweight React single-page application:
* **Framework**: React 19 with Vite 6 and TypeScript
* **Styling**: Tailwind CSS v4 and shadcn UI components
* **State & Forms**: Zustand store, React Hook Form, and Zod
* **API Client**: Configured Axios instance ready to connect to a backend

---

## Project Conventions

### 1. PascalCase File Naming
Custom components, schemas, stores, and pages use `PascalCase`:
* Examples: `Navbar.tsx`, `HeroSection.tsx`, `LoginForm.tsx`, `UserSchema.ts`, `AuthStore.ts`
* Exception: Generic UI primitives in `@/components/ui/` keep standard shadcn `kebab-case` (`button.tsx`, `dialog.tsx`).

### 2. Zod as Single Source of Truth
Types are inferred directly from Zod schemas instead of maintaining separate TypeScript interfaces:
```typescript
export const UserSchema = z.object({
  id: z.string(),
  username: z.string().min(3),
  name: z.string().min(2),
  email: z.string().email(),
  role: z.number().int().default(1),
});

export type User = z.infer<typeof UserSchema>;
```

### 3. Numeric Role Levels
Roles use integer levels (`1` for standard users, `2` for administrators) for lightweight permission checking across all layers.

---

## License

MIT (c) VYDev37. Feel free to use, modify, and share.
