export function generateAgentsMd(stacks: string[]): string {
  const stackList = stacks.map((s) => `- \`${s}\``).join("\n");
  const hasGo = stacks.includes("go-fiber");
  const hasFrontend = stacks.some((s) => s.startsWith("nextjs") || s === "react-vite");

  const skillGuidelines: string[] = [
    "- **General & Anti-Slop:** Read `.agents/skills/general/stop-slop.md` for clean, human, humble writing without AI buzzwords or em-dashes.",
  ];

  if (hasGo) {
    skillGuidelines.push(
      "- **Go Fiber Architecture & Conventions:** Read `.agents/skills/backend/go-fiber-convention.md` for layer separation, Fiber v3 handlers, and response shapes.",
      "- **GORM Database Patterns:** Read `.agents/skills/backend/gorm-patterns.md` for database models, migrations, and repositories.",
      "- **JWT Authentication:** Read `.agents/skills/backend/jwt-auth.md` for cookie-based authentication, token validation, and password hashing.",
      "- **Golang Best Practices:** Consult the specialized Go skills in `.agents/skills/` (`golang-code-style`, `golang-naming`, `golang-error-handling`, `golang-security`, `golang-database`)."
    );
  }

  if (hasFrontend) {
    skillGuidelines.push(
      "- **Next.js & Frontend Conventions:** Read `.agents/skills/frontend/nextjs-conventions.md` for Server Component first rules, colocated client components, and PascalCase.",
      "- **State Management:** Read `.agents/skills/frontend/react-state-management.md` for Zustand atomic selectors and `UserProvider` context.",
      "- **Frontend UI Quality:** Read `.agents/skills/frontend/frontend-developer.md` for accessible, modular component architecture."
    );
  }

  const sections: string[] = [];

  // Section 1: Naming Conventions
  const namingItems: string[] = [];
  if (hasGo) {
    namingItems.push(
      "- **Golang Files (Strict Lowercase & snake_case):** Specifically for all Golang source files (`.go`), file names **MUST** use **`lowercase`** and **`snake_case`** format (e.g., `user_handler.go`, `user_repository.go`, `user_service.go`, `auto_migrate.go`, `read_env.go`, `auth.go`, `main.go`). NEVER use PascalCase (e.g., `UserHandler.go`), camelCase (e.g., `userHandler.go`), or kebab-case for any Go file names. All Go directories MUST also use lowercase (`cmd/`, `internal/handlers/`, etc.)."
    );
  }
  if (hasFrontend || !hasGo) {
    namingItems.push(
      "- **PascalCase by Default (Frontend & React):** All custom React components, layouts, sections, schemas, stores, and frontend providers MUST be named in **`PascalCase`** (e.g., `Navbar.tsx`, `HeroSection.tsx`, `LoginForm.tsx`, `UserSchema.ts`, `AuthStore.ts`, `UserProvider.tsx`).",
      "- **Database Layer:** All Drizzle ORM schemas live in the `db/` directory. For Go Fiber, GORM models and repositories live in `internal/models/` and `internal/repositories/`.",
      "- **UI Primitives Exception:** Files located inside `components/ui/` follow standard shadcn `kebab-case` conventions (e.g., `button.tsx`, `dropdown-menu.tsx`, `skeleton.tsx`, `sheet.tsx`).",
      "- **Next.js App Router Special Files:** Routing convention files retain Next.js standards (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `route.ts`)."
    );
  }

  sections.push(`### 1. File & Component Naming Conventions\n${namingItems.join("\n")}`);

  // Section 2: Go Architecture (if Go present)
  if (hasGo) {
    sections.push(`### 2. Go Fiber Architecture & Layer Responsibilities
This backend stack is built with **Go (Golang) 1.23+**, **Fiber v3**, **GORM**, and **JWT + Argon2id**. Each directory has strictly isolated architectural responsibilities:

- **\`internal/repositories/\` (Direct Database Access Layer):**
  - **ALL** logic interacting directly with the database (\`*gorm.DB\`) **MUST** reside exclusively in this layer.
  - Prohibited from executing database queries directly inside services or handlers.
  - File naming: \`snake_case.go\` (e.g., \`user_repository.go\`).
  - Struct naming: Interface \`[Domain]Repository\`, struct \`[domain]Repository{ db *gorm.DB }\`, constructor \`New[Domain]Repository(db *gorm.DB)\`.

- **\`internal/services/\` (Business Logic Layer):**
  - Handles pure business logic, domain validation, password hashing (Argon2), JWT token generation, and orchestration between repositories.
  - File naming: \`snake_case.go\` (e.g., \`user_service.go\`).
  - Struct naming: Interface \`[Domain]Service\`, struct \`[domain]Service{ ... }\`, constructor \`New[Domain]Service(...)\`.

- **\`internal/handlers/\` (REST API Handlers):**
  - Dedicated to Fiber v3 HTTP handler functions. Responsible for parsing request payloads (\`c.Bind().Body(&req)\`), determining HTTP status codes, and formatting JSON responses.
  - No database queries or heavy business logic permitted here.
  - File naming: \`snake_case.go\` (e.g., \`user_handler.go\`).
  - Struct naming: Struct \`[Domain]Handler\`, constructor \`New[Domain]Handler(svc ...)\`, receiver methods \`func (h *[Domain]Handler) Action(c fiber.Ctx) error\`.

- **\`internal/routes/\` (Route Registration & Accessible Route Mapping):**
  - Registers handler functions into accessible HTTP routes (\`app.Group\`, \`api.Post\`, \`api.Get\`).
  - Handles dependency injection wiring (\`db\` -> \`repo\` -> \`service\` -> \`handler\`) and attaches route authentication middlewares.
  - File naming: \`routes.go\`, function: \`func SetupRoutes(app *fiber.App, cfg *config.Config, db *gorm.DB)\`.

- **\`internal/middlewares/\` (HTTP Middlewares):**
  - Fiber middlewares (JWT authentication guard, CORS, logging, rate limiting).
  - File naming: \`snake_case.go\` (e.g., \`auth.go\`, \`cors.go\`), function: \`PascalCase(...) fiber.Handler\`.

- **\`internal/pkg/\` (Utility Functions):**
  - Collection of domain-agnostic, reusable utility and helper functions (e.g., \`argon2.go\`, \`read_env.go\`).
  - File naming: \`snake_case.go\`.

- **\`internal/scripts/\` (Standalone Utility Scripts):**
  - Standalone utility scripts such as database schema auto-migrations (\`auto_migrate.go\`).
  - File naming: \`snake_case.go\`.

- **\`internal/models/\` (Database Table Definitions):**
  - Struct model definitions representing GORM database tables along with JSON and GORM tags.
  - File naming: \`snake_case.go\` (e.g., \`user.go\`), struct: \`PascalCase\` (\`type User struct\`).

- **\`cmd/main.go\` (Entry Point):**
  - Application entry point for configuration loading, database connection initialization, Fiber app setup, and calling \`routes.SetupRoutes\`.

### 3. Protected Files: Database & Config (DO NOT MODIFY)
> [!IMPORTANT]
> The files \`internal/database/database.go\` and \`internal/config/config.go\` **MUST NOT BE MODIFIED** unless new environment variables or database connection configurations need to be explicitly added or changed.

### 4. Struct-Based Pattern (MUST Use Structs, NOT Global Variables / Loose Functions)
- **Dependency Injection via Structs:** All repositories, services, and handlers **MUST** be implemented as methods on a **\`struct\`** with constructor functions \`New...()\`.
- **NEVER use global variables or package-level mutable state:** Do not store database instances (\`*gorm.DB\`), authentication state, or dependencies in global variables. All dependencies must be injected via struct fields during initialization in \`routes.SetupRoutes\`.
- **Method Receivers:**
  - Repositories: \`func (r *userRepository) FindByID(id uint) (*models.User, error)\`
  - Services: \`func (s *userService) Register(req RegisterRequest) (*AuthResponse, error)\`
  - Handlers: \`func (h *UserHandler) Register(c fiber.Ctx) error\`

### 5. Naming Conventions per Layer
| Layer | Folder Location | File Naming Convention | Struct / Interface Convention | Constructor / Function |
|---|---|---|---|---|
| **Models** | \`internal/models/\` | \`snake_case.go\` (\`user.go\`) | \`PascalCase\` (\`type User struct\`) | - |
| **Repositories** | \`internal/repositories/\` | \`[domain]_repository.go\` | Interface: \`[Domain]Repository\`<br>Struct: \`[domain]Repository\` | \`New[Domain]Repository(db *gorm.DB)\` |
| **Services** | \`internal/services/\` | \`[domain]_service.go\` | Interface: \`[Domain]Service\`<br>Struct: \`[domain]Service\` | \`New[Domain]Service(repo ...)\` |
| **Handlers** | \`internal/handlers/\` | \`[domain]_handler.go\` | Struct: \`[Domain]Handler\` | \`New[Domain]Handler(svc ...)\` |
| **Middlewares** | \`internal/middlewares/\` | \`snake_case.go\` (\`auth.go\`) | - | \`PascalCase(...) fiber.Handler\` |
| **Routes** | \`internal/routes/\` | \`routes.go\` | - | \`SetupRoutes(app, cfg, db)\` |
| **Utilities** | \`internal/pkg/\` | \`snake_case.go\` (\`argon2.go\`) | Helper structs if needed | \`PascalCase\` functions |
| **Scripts** | \`internal/scripts/\` | \`snake_case.go\` (\`auto_migrate.go\`) | - | \`main()\` |

### 6. Standard JSON Response Shape
All HTTP handlers must return responses matching the standard format:
\`\`\`json
{
  "success": true,
  "message": "Human readable message",
  "data": {}
}
\`\`\`
In error cases:
\`\`\`json
{
  "success": false,
  "message": "Error details",
  "data": null
}
\`\`\``);
  }

  // Frontend Directives (if Frontend present)
  if (hasFrontend) {
    const feIndex = hasGo ? 7 : 2;
    sections.push(`### ${feIndex}. Server Component Priority, Colocation & File Size Limit
- **Server Component First (\`page.tsx\`):** All Next.js pages MUST be Server Components for SSR, server-side route guards (\`redirect("/login")\`), and explicit \`Metadata\`.
- **Colocated Client Components (\`[Feature]Client.tsx\`):** Place interactive client wrappers directly in the route folder alongside \`page.tsx\` (e.g., \`app/(dashboard)/dashboard/DashboardClient.tsx\`).
- **Route-Level \`loading.tsx\`:** Place dedicated loading skeletons in route folders instead of messy \`if (isLoading)\` state branches in components.
- **Strict File Length Limit (< 200 Lines):** Keep all files concise and modular under 200 lines. Extract subcomponents into dedicated files.

### ${feIndex + 1}. Type Safety & Single Source of Truth (Zod Rule)
- **Zero Arbitrary Types:** Never create loose, unvalidated TypeScript interfaces for core domain entities.
- **Schema-First Inference:** Always define runtime Zod schemas in \`schemas/\` and infer types using \`export type User = z.infer<typeof UserSchema>;\`.`);
  }

  // Final Section: UI/UX Craft & Anti-Slop
  const craftNumber = hasGo && hasFrontend ? 9 : hasGo ? 7 : 4;
  sections.push(`### ${craftNumber}. UI/UX Craft & Anti-Slop Principles
- **No Em-Dashes (\`—\`):** Never use em-dashes in user-facing copy or labels.
- **No AI Buzzwords:** Keep copy simple, natural, and humble. Avoid words like "delve", "testament", "unleash", "elevate", "cutting-edge", "game-changer", "tapestry", "seamlessly", "enterprise-grade".
- **Single-Line Desktop Actions:** Navbar, primary CTA buttons, and header action rows must remain single-line without awkward wrapping.
- **Strict WCAG AA:** All text, badges, and form controls must maintain high contrast (minimum 4.5:1).`);

  return `# Agent Instructions & Guidelines

This project was scaffolded with \`create-vy-project\`.

## Active Stacks
${stackList}

## Agent Workflow & Skill Guidelines
Before modifying, generating, or refactoring code in this repository, agents MUST consult the local skills located in \`.agents/skills/\`:

${skillGuidelines.join("\n")}

---

## Core Directives & Standards

${sections.join("\n\n")}
`;
}
