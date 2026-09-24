export function generateAgentsMd(stacks: string[], architecture?: string): string {
  const isCleanArch = architecture === "clean";
  const stackList = stacks
    .map((s) => {
      if (s === "go-fiber") {
        return `- \`go-fiber\` (${isCleanArch ? "Clean Architecture" : "Layered Architecture"})`;
      }
      return `- \`${s}\``;
    })
    .join("\n");
  const hasGo = stacks.includes("go-fiber");
  const hasNextjs = stacks.some((s) => s.startsWith("nextjs"));
  const isReactVite = stacks.includes("react-vite");
  const hasFrontend = hasNextjs || isReactVite;
  const hasLaravel = stacks.includes("laravel");
  const hasDiscordBot = stacks.includes("discord-bot") || stacks.includes("discord-bot-template");

  const skillGuidelines: string[] = [
    "- **General & Anti-Slop:** Read `.agents/skills/general/stop-slop.md` for clean, human, humble writing without AI buzzwords or em-dashes.",
  ];

  if (hasGo) {
    if (isCleanArch) {
      skillGuidelines.push(
        "- **Go Fiber Architecture & Conventions:** Read `.agents/skills/backend/go-fiber-convention.md` for clean domain separation, Fiber v3 handlers, and response shapes.",
        "- **GORM Database Patterns:** Read `.agents/skills/backend/gorm-patterns.md` for database models, migrations, and repositories.",
        "- **JWT Authentication:** Read `.agents/skills/backend/jwt-auth.md` for cookie-based authentication, token validation, and password hashing.",
        "- **Golang Best Practices:** Consult the specialized Go skills in `.agents/skills/` (`golang-code-style`, `golang-naming`, `golang-error-handling`, `golang-security`, `golang-database`)."
      );
    } else {
      skillGuidelines.push(
        "- **Go Fiber Architecture & Conventions:** Read `.agents/skills/backend/go-fiber-convention.md` for layer separation, Fiber v3 handlers, and response shapes.",
        "- **GORM Database Patterns:** Read `.agents/skills/backend/gorm-patterns.md` for database models, migrations, and repositories.",
        "- **JWT Authentication:** Read `.agents/skills/backend/jwt-auth.md` for cookie-based authentication, token validation, and password hashing.",
        "- **Golang Best Practices:** Consult the specialized Go skills in `.agents/skills/` (`golang-code-style`, `golang-naming`, `golang-error-handling`, `golang-security`, `golang-database`)."
      );
    }
  }

  if (hasLaravel) {
    skillGuidelines.push(
      "- **Laravel Architecture & Conventions:** Read `.agents/skills/backend/laravel-convention.md` for modern Laravel best practices and standard structures."
    );
  }

  if (hasDiscordBot) {
    skillGuidelines.push(
      "- **Discord Bot Architecture & Conventions:** Read `.agents/skills/bot/discord-bot-convention.md` for discord.js v14 handlers, ICommand interfaces, slash command registration, and interaction handling."
    );
  }

  if (hasNextjs) {
    skillGuidelines.push(
      "- **Next.js & Frontend Conventions:** Read `.agents/skills/frontend/nextjs-conventions.md` for Server Component first rules, colocated client components, and PascalCase.",
      "- **State Management:** Read `.agents/skills/frontend/react-state-management.md` for Zustand atomic selectors and `UserProvider` context.",
      "- **Frontend UI Quality:** Read `.agents/skills/frontend/frontend-developer.md` for accessible, modular component architecture.",
      "- **UI/UX Craft & Design:** Consult `.agents/skills/frontend/ui-ux-pro-max.md` and `.agents/skills/frontend/taste-skill.md`."
    );
  }

  if (isReactVite) {
    skillGuidelines.push(
      "- **React Patterns & Vite Architecture:** Read `.agents/skills/frontend/react-patterns.md` and `.agents/skills/frontend/frontend-developer.md` for Vite client SPA architecture, hooks, and modular components.",
      "- **State Management:** Read `.agents/skills/frontend/react-state-management.md` or `.agents/skills/zustand-store-ts/` for Zustand atomic selectors and client stores.",
      "- **UI/UX Design Intelligence:** Consult `.agents/skills/frontend/ui-ux-pro-max.md` and `.agents/skills/frontend/taste-skill.md`.",
      "- **Client API Integration:** Use `src/lib/ApiClient.ts` (Axios instance configured with `baseURL: import.meta.env.VITE_API_URL` and `withCredentials: true`)."
    );
  }

  const sections: string[] = [];
  let sectionIndex = 1;

  // Section 1: Naming Conventions
  const namingItems: string[] = [];
  if (hasGo) {
    if (isCleanArch) {
      namingItems.push(
        "- **Golang Files (Strict Lowercase & snake_case):** Specifically for all Golang source files (`.go`), file names **MUST** use **`lowercase`** and **`snake_case`** format (e.g., `models.go`, `dto.go`, `repository.go`, `service.go`, `handler.go`, `routes.go`, `auto_migrate.go`, `read_env.go`, `auth.go`, `main.go`). NEVER use PascalCase (e.g., `UserHandler.go`), camelCase (e.g., `userHandler.go`), or kebab-case for any Go file names. All Go directories MUST also use lowercase (`cmd/`, `internal/user/`, `internal/middlewares/`, etc.)."
      );
    } else {
      namingItems.push(
        "- **Golang Files (Strict Lowercase & snake_case):** Specifically for all Golang source files (`.go`), file names **MUST** use **`lowercase`** and **`snake_case`** format (e.g., `user_handler.go`, `user_repository.go`, `user_service.go`, `auto_migrate.go`, `read_env.go`, `auth.go`, `main.go`). NEVER use PascalCase (e.g., `UserHandler.go`), camelCase (e.g., `userHandler.go`), or kebab-case for any Go file names. All Go directories MUST also use lowercase (`cmd/`, `internal/handlers/`, etc.)."
      );
    }
  }
  if (hasDiscordBot) {
    namingItems.push(
      "- **Path Alias (`@/*`):** Use `@/*` mapped to `./src/*` for all internal project imports (e.g., `@/commands`, `@/listeners`, `@/interfaces/command`, `@/config`). NEVER use messy relative paths (`../../`).",
      "- **Slash Command Files (Exact Match with Command Name):** File names in `src/commands/` **MUST** match the exact slash command name in `lowercase`/`kebab-case` (e.g., slash command `/ping` -> `ping.ts`, `/help` -> `help.ts`, `/serverinfo` -> `serverinfo.ts`).",
      "- **Event Listener Files (Exact Match with Event Name):** File names in `src/listeners/` **MUST** match the exact Discord.js event name in `camelCase` (e.g., event `clientReady` -> `clientReady.ts`, event `interactionCreate` -> `interactionCreate.ts`, event `guildMemberAdd` -> `guildMemberAdd.ts`, event `messageCreate` -> `messageCreate.ts`)."
    );
  }
  if (hasFrontend) {
    namingItems.push(
      "- **PascalCase by Default (Frontend & React):** All custom React components, layouts, sections, schemas, stores, and frontend providers MUST be named in **`PascalCase`** (e.g., `Navbar.tsx`, `HeroSection.tsx`, `LoginForm.tsx`, `UserSchema.ts`, `AuthStore.ts`, `UserProvider.tsx`)."
    );

    if (stacks.includes("nextjs-fullstack")) {
      namingItems.push(
        "- **Database Layer:** All Drizzle ORM schemas live in the `db/` directory."
      );
    } else if (hasGo) {
      if (isCleanArch) {
        namingItems.push(
          "- **Database Layer:** For Go Fiber, GORM models and repositories live in domain packages under `internal/<domain>/` (e.g., `internal/user/`)."
        );
      } else {
        namingItems.push(
          "- **Database Layer:** For Go Fiber, GORM models and repositories live in `internal/models/` and `internal/repositories/`."
        );
      }
    }

    if (isReactVite) {
      namingItems.push(
        "- **Hook Naming Convention:** Custom hooks MUST be named in **`camelCase`** prefixed with `use` (e.g., `useTaskCard.ts`, `useKanbanColumn.ts`, `useDebounce.ts`, `useAuth.ts`) and located in `src/hooks/`.",
        "- **UI Primitives Exception:** Files located inside `src/components/ui/` follow standard shadcn `kebab-case` conventions (e.g., `button.tsx`, `dropdown-menu.tsx`, `skeleton.tsx`, `sheet.tsx`)."
      );
    } else {
      namingItems.push(
        "- **Hook Naming Convention:** Custom hooks MUST be named in **`camelCase`** prefixed with `use` (e.g., `useDebounce.ts`, `useAuth.ts`) and located in `hooks/`.",
        "- **UI Primitives Exception:** Files located inside `components/ui/` follow standard shadcn `kebab-case` conventions (e.g., `button.tsx`, `dropdown-menu.tsx`, `skeleton.tsx`, `sheet.tsx`)."
      );
    }

    if (hasNextjs) {
      namingItems.push(
        "- **Next.js App Router Special Files:** Routing convention files retain Next.js standards (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `route.ts`)."
      );
    }
  }

  sections.push(`### ${sectionIndex++}. File & Component Naming Conventions\n${namingItems.join("\n")}`);

  // Section: Go Architecture (if Go present)
  if (hasGo) {
    if (isCleanArch) {
      sections.push(`### ${sectionIndex++}. Clean Architecture & Domain Responsibilities
This backend stack follows **Clean / Feature-Driven Architecture**. Each domain/feature module encapsulates its complete lifecycle in \`internal/<domain>/\`:

\`\`\`
internal/
├── user/
│   ├── models.go       # GORM table definitions & struct tags
│   ├── dto.go          # Request & Response DTOs, ApiResponse[T]
│   ├── repository.go   # Direct DB access layer (*gorm.DB)
│   ├── service.go      # Business logic, Argon2 hashing, JWT generation
│   ├── handler.go      # Fiber v3 HTTP handlers (c.Bind().Body, status codes)
│   └── routes.go       # RegisterRoutes(router, handler, jwtSecret)
├── config/             # Environment configuration (config.go)
├── database/           # GORM database connection (database.go)
├── middlewares/        # HTTP middlewares (auth.go, role.go, cors.go)
├── pkg/                # Utility helpers (argon2.go, jwt.go, read_env.go)
└── scripts/            # Database auto-migrations (auto_migrate.go)
\`\`\`

- **\`internal/<domain>/\` (Domain Module):**
  - **\`models.go\`**: Struct model definitions representing database tables.
  - **\`dto.go\`**: Request payloads (\`*Request\`) and sanitized response structs (\`*Response\`). Never expose sensitive fields (like password hash) in response DTOs.
  - **\`repository.go\`**: All direct database operations (\`*gorm.DB\`) live here. Interface \`[Domain]Repository\`, struct \`[domain]Repository\`, constructor \`New[Domain]Repository(db *gorm.DB)\`.
  - **\`service.go\`**: Business logic, domain validations, JWT token generation. Interface \`[Domain]Service\`, struct \`[domain]Service\`, constructor \`New[Domain]Service(...)\`.
  - **\`handler.go\`**: HTTP presentation layer parsing Fiber context. Struct \`[Domain]Handler\`, constructor \`New[Domain]Handler(svc ...)\`.
  - **\`routes.go\`**: Route mapping \`RegisterRoutes(router fiber.Router, handler *[Domain]Handler, jwtSecret string)\`.

- **\`internal/middlewares/\` (HTTP Middlewares):**
  - JWT auth guard \`Protected()\`, Role-Based Access Control \`RequireRole()\`, \`AdminOnly()\`, CORS.

### ${sectionIndex++}. Protected Files: Database & Config (DO NOT MODIFY)
> [!IMPORTANT]
> The files \`internal/database/database.go\` and \`internal/config/config.go\` **MUST NOT BE MODIFIED** unless new environment variables or database connection configurations need to be explicitly added or changed.

### ${sectionIndex++}. Struct-Based Pattern (MUST Use Structs, NOT Global Variables / Loose Functions)
- **Dependency Injection via Structs:** All repositories, services, and handlers **MUST** be implemented as methods on a **\`struct\`** with constructor functions \`New...()\`.
- **NEVER use global variables or package-level mutable state:** All dependencies must be injected via struct fields during initialization in \`cmd/main.go\`.

### ${sectionIndex++}. Standard JSON Response Shape
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
    } else {
      sections.push(`### ${sectionIndex++}. Go Fiber Architecture & Layer Responsibilities
This backend stack is built with **Go (Golang) 1.23+**, **Fiber v3**, **GORM**, and **JWT + Argon2id**. Each directory has strictly isolated architectural responsibilities:

- **\`internal/dto/\` (Data Transfer Objects):**
  - Request payloads (\`*Request\`) and sanitized response structs (\`*Response\`) isolating HTTP presentation schemas from database models.
  - File naming: \`[domain]_dto.go\` (e.g., \`auth_dto.go\`, \`user_dto.go\`, \`response_dto.go\`).

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
  - Fiber middlewares (JWT authentication guard \`Protected()\`, Role-Based Access Control \`RequireRole()\`, \`AdminOnly()\`, CORS, rate limiting).
  - File naming: \`snake_case.go\` (e.g., \`auth.go\`, \`role.go\`, \`cors.go\`), function: \`PascalCase(...) fiber.Handler\`.

- **\`internal/pkg/\` (Utility Functions):**
  - Collection of domain-agnostic, reusable utility and helper functions (e.g., \`argon2.go\`, \`jwt.go\`, \`read_env.go\`).
  - File naming: \`snake_case.go\`.

- **\`internal/scripts/\` (Standalone Utility Scripts):**
  - Standalone utility scripts such as database schema auto-migrations (\`auto_migrate.go\`).
  - File naming: \`snake_case.go\`.

- **\`internal/models/\` (Database Table Definitions):**
  - Struct model definitions representing GORM database tables along with JSON and GORM tags.
  - File naming: \`snake_case.go\` (e.g., \`user.go\`), struct: \`PascalCase\` (\`type User struct\`).

- **\`cmd/main.go\` (Entry Point):**
  - Application entry point for configuration loading, database connection initialization, Fiber app setup, and calling \`routes.SetupRoutes\`.

### ${sectionIndex++}. Protected Files: Database & Config (DO NOT MODIFY)
> [!IMPORTANT]
> The files \`internal/database/database.go\` and \`internal/config/config.go\` **MUST NOT BE MODIFIED** unless new environment variables or database connection configurations need to be explicitly added or changed.

### ${sectionIndex++}. Struct-Based Pattern (MUST Use Structs, NOT Global Variables / Loose Functions)
- **Dependency Injection via Structs:** All repositories, services, and handlers **MUST** be implemented as methods on a **\`struct\`** with constructor functions \`New...()\`.
- **NEVER use global variables or package-level mutable state:** Do not store database instances (\`*gorm.DB\`), authentication state, or dependencies in global variables. All dependencies must be injected via struct fields during initialization in \`routes.SetupRoutes\`.
- **Method Receivers:**
  - Repositories: \`func (r *userRepository) FindByID(id uint) (*models.User, error)\`
  - Services: \`func (s *userService) Register(req dto.RegisterRequest) (*dto.AuthResponse, error)\`
  - Handlers: \`func (h *UserHandler) Register(c fiber.Ctx) error\`

### ${sectionIndex++}. Naming Conventions per Layer
| Layer | Folder Location | File Naming Convention | Struct / Interface Convention | Constructor / Function |
|---|---|---|---|---|
| **Models** | \`internal/models/\` | \`snake_case.go\` (\`user.go\`) | \`PascalCase\` (\`type User struct\`) | - |
| **DTOs** | \`internal/dto/\` | \`[domain]_dto.go\` (\`auth_dto.go\`) | \`PascalCase\` (\`type RegisterRequest struct\`) | - |
| **Repositories** | \`internal/repositories/\` | \`[domain]_repository.go\` | Interface: \`[Domain]Repository\`<br>Struct: \`[domain]Repository\` | \`New[Domain]Repository(db *gorm.DB)\` |
| **Services** | \`internal/services/\` | \`[domain]_service.go\` | Interface: \`[Domain]Service\`<br>Struct: \`[domain]Service\` | \`New[Domain]Service(repo ...)\` |
| **Handlers** | \`internal/handlers/\` | \`[domain]_handler.go\` | Struct: \`[Domain]Handler\` | \`New[Domain]Handler(svc ...)\` |
| **Middlewares** | \`internal/middlewares/\` | \`snake_case.go\` (\`auth.go\`, \`role.go\`) | - | \`PascalCase(...) fiber.Handler\` |
| **Routes** | \`internal/routes/\` | \`routes.go\` | - | \`SetupRoutes(app, cfg, db)\` |
| **Utilities** | \`internal/pkg/\` | \`snake_case.go\` (\`argon2.go\`, \`jwt.go\`) | Helper structs if needed | \`PascalCase\` functions |
| **Scripts** | \`internal/scripts/\` | \`snake_case.go\` (\`auto_migrate.go\`) | - | \`main()\` |

### ${sectionIndex++}. Standard JSON Response Shape
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
  }

  // Next.js Frontend Directives (if Next.js present)
  if (hasNextjs) {
    sections.push(`### ${sectionIndex++}. Next.js Server Component Priority, Colocation & File Size Limit
- **Server Component First (\`page.tsx\`):** All Next.js pages MUST be Server Components for SSR, server-side route guards (\`redirect("/login")\`), and explicit \`Metadata\`.
- **Colocated Client Components (\`[Feature]Client.tsx\`):** Place interactive client wrappers directly in the route folder alongside \`page.tsx\` (e.g., \`app/(dashboard)/dashboard/DashboardClient.tsx\`).
- **Route-Level \`loading.tsx\`:** Place dedicated loading skeletons in route folders instead of messy \`if (isLoading)\` state branches in components.
- **Strict File Length Limit (< 200 Lines):** Keep all files concise and modular under 200 lines. Extract subcomponents into dedicated files.`);
  }

  // React-Vite Frontend Directives (if React Vite present)
  if (isReactVite) {
    sections.push(`### ${sectionIndex++}. React + Vite Client Architecture
- **Environment Variables:** Use \`import.meta.env.VITE_*\` (never \`process.env\`).
- **Path Alias:** Use \`@/*\` mapped to \`./src/*\`.
- **Client API Integration:** All API calls route through \`src/lib/ApiClient.ts\` (Axios instance configured with \`baseURL: import.meta.env.VITE_API_URL\` and \`withCredentials: true\`).
- **Hook-Driven Logic Separation:**
  - Components MUST remain clean, declarative presentation layers focused on JSX layout and styling.
  - Component business logic, handlers (drag-and-drop, inline editing, mutation triggers, dropdown action handlers), and complex local states MUST be abstracted into custom hooks in \`src/hooks/\`.
- **Strict File Length Limit (< 200 Lines):** Keep all component and hook files concise and modular under 200 lines. Extract subcomponents and hooks into dedicated files.`);
  }

  // Type Safety & Single Source of Truth (if Frontend present)
  if (hasFrontend) {
    sections.push(`### ${sectionIndex++}. Type Safety & Single Source of Truth (Zod Rule)
- **Zero Arbitrary Types:** Never create loose, unvalidated TypeScript interfaces for core domain entities.
- **Schema-First Inference:** Always define runtime Zod schemas in \`schemas/\` (or \`src/schemas/\`) and infer types using \`export type User = z.infer<typeof UserSchema>;\`.`);
  }

  // Discord Bot Architecture Directives (if Discord Bot present)
  if (hasDiscordBot) {
    sections.push(`### ${sectionIndex++}. Discord Bot Architecture & Directives
This bot is built with **TypeScript** and **discord.js v14** using native **Slash Commands** (\`/\`).

- **\`src/commands/\` (Slash Commands Layer):**
  - Every command must implement the \`ICommand\` interface (\`ChatInputApplicationCommandData\` + \`run\` handler).
  - Export the command object with PascalCase (e.g., \`export const PingCommand: ICommand = { ... }\`).
  - Always register new commands in the \`Commands\` array in \`src/commands/index.ts\`.
- **\`src/listeners/\` (Event Listeners Layer):**
  - Event listeners attach handlers to the \`Client\` instance.
  - Export a default function: \`export default (client: Client): void => { ... }\`.
  - Listeners are wired in \`src/index.ts\`.
- **\`src/config.ts\` (Centralized Environment Configuration & Single Source of Truth):**
  - All environment variables **MUST** be loaded and typed exclusively via \`src/config.ts\` (\`Config\` interface & \`loadConfig()\`).
  - **NEVER** use \`process.env\` directly in commands, listeners, or handlers. Always import \`config\` or named exports from \`src/config.ts\`.
- **Interaction Deferral & Auto-Defer:**
  - Discord requires interaction acknowledgements within **3 seconds** before timing out.
  - In \`interactionCreate.ts\`, always call \`await interaction.deferReply()\` and reply inside handlers using \`await interaction.editReply(...)\`.
- **Error Handling:**
  - Wrap command execution in \`try / catch\` and respond with informative error \`EmbedBuilder\` embeds.
- **Environment & Secrets:**
  - Store tokens in \`.env\` (\`BOT_TOKEN\`, optional \`GUILD_ID\`). Never commit raw bot tokens to version control.`);
  }

  // Shadcn UI Reusability (if Frontend present)
  if (hasFrontend) {
    sections.push(`### ${sectionIndex++}. Shadcn Component Reusability & Shared Design Primitives
- **Never Duplicate Styled Primitives:** Reusable and identical UI elements (buttons with brand accents/gradients, status badges, form inputs, dialog modals, sheet drawers, tooltips, cards) MUST reuse and extend shadcn UI primitives in \`components/ui/\` (or \`src/components/ui/\`).
- **Accent & Variant Extension:** Add dedicated variants inside \`buttonVariants\` or component props (e.g. \`variant="accent"\`, \`variant="glow"\`, \`size="sm"\`) rather than writing ad-hoc inline Tailwind strings across multiple pages.
- **Sidebar Navigation:** Use the provided responsive, collapsible \`Sidebar\` component for dashboard layouts with active route highlighting.`);
  }

  // Database Indexing Strategy (if Backend or Fullstack present)
  if (hasGo || stacks.includes("nextjs-fullstack")) {
    sections.push(`### ${sectionIndex++}. Database Indexing Strategy (When to Index vs When NOT to Index)
- **When to Index (High Value):**
  - **Foreign keys & JOIN columns:** Always index references (\`user_id\`, \`tenant_id\`, \`order_id\`) to avoid full table scans during joins.
  - **High-cardinality lookup filters:** Unique columns frequently filtered in \`WHERE\` clauses (\`email\`, \`username\`, \`slug\`, \`api_key\`).
  - **Sorting & Range Queries:** Frequently sorted timestamps in pagination (\`created_at DESC\`, \`deleted_at\`).
  - **Composite Indexes:** Multiple columns queried together (e.g., \`WHERE tenant_id = ? AND status = ?\`) following the leftmost prefix rule.
- **When NOT to Index (Avoid Bloat & Slow Writes):**
  - **Low-cardinality boolean flags alone:** Standalone \`is_active\` or \`is_verified\` where the planner skips index anyway.
  - **Small / Static Tables:** Tables with < 500 rows.
  - **High-Throughput Counter Columns:** Rapidly mutated columns (\`view_count\`, \`last_active_at\`) where B-tree index rebalancing degrades write throughput.
  - **Unbounded Text/JSON:** Avoid indexing raw long text without prefix or GIN/GiST.`);
  }

  // Security & Error Leakage Prevention
  sections.push(`### ${sectionIndex++}. Security, Input Sanitization & Magic Bytes File Validation
- **Zero Internal Error Leakage:** API handlers MUST NEVER expose raw database error messages, SQL syntax strings, internal file paths, or stack traces in HTTP JSON responses.
- **Server-Side Logging:** Log raw errors exclusively to the server console or structured logger (\`log.Printf("[ERROR] ...: %v", err)\`).
- **Sanitized Client Responses:** Return clear, sanitized, user-friendly messages to the frontend (e.g., \`"Invalid username or password"\`, \`"User not found"\`, \`"Invalid request payload"\`).
- **Input Sanitization:** Always sanitize untrusted text inputs (e.g. using \`pkg.SanitizeString(input)\`) to strip HTML/script tags and trim whitespace.
- **Magic Bytes File Upload Validation:** Never trust client-provided \`Content-Type\` headers or extensions. Always inspect initial magic bytes using \`http.DetectContentType\` (\`pkg.ValidateUploadedFile\`), enforce payload size limits, and store files with cryptographically random filenames.`);

  // Final Section: UI/UX Craft & Anti-Slop
  sections.push(`### ${sectionIndex++}. UI/UX Craft & Anti-Slop Principles
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
