export function generateAgentsMd(stacks: string[]): string {
  const stackList = stacks.map((s) => `- \`${s}\``).join("\n");
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
    skillGuidelines.push(
      "- **Go Fiber Architecture & Conventions:** Read `.agents/skills/backend/go-fiber-convention.md` for layer separation, Fiber v3 handlers, and response shapes.",
      "- **GORM Database Patterns:** Read `.agents/skills/backend/gorm-patterns.md` for database models, migrations, and repositories.",
      "- **JWT Authentication:** Read `.agents/skills/backend/jwt-auth.md` for cookie-based authentication, token validation, and password hashing.",
      "- **Golang Best Practices:** Consult the specialized Go skills in `.agents/skills/` (`golang-code-style`, `golang-naming`, `golang-error-handling`, `golang-security`, `golang-database`)."
    );
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
    namingItems.push(
      "- **Golang Files (Strict Lowercase & snake_case):** Specifically for all Golang source files (`.go`), file names **MUST** use **`lowercase`** and **`snake_case`** format (e.g., `user_handler.go`, `user_repository.go`, `user_service.go`, `auto_migrate.go`, `read_env.go`, `auth.go`, `main.go`). NEVER use PascalCase (e.g., `UserHandler.go`), camelCase (e.g., `userHandler.go`), or kebab-case for any Go file names. All Go directories MUST also use lowercase (`cmd/`, `internal/handlers/`, etc.)."
    );
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
      namingItems.push(
        "- **Database Layer:** For Go Fiber, GORM models and repositories live in `internal/models/` and `internal/repositories/`."
      );
    }

    if (isReactVite) {
      namingItems.push(
        "- **UI Primitives Exception:** Files located inside `src/components/ui/` follow standard shadcn `kebab-case` conventions (e.g., `button.tsx`, `dropdown-menu.tsx`, `skeleton.tsx`, `sheet.tsx`)."
      );
    } else {
      namingItems.push(
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
    sections.push(`### ${sectionIndex++}. Go Fiber Architecture & Layer Responsibilities
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

### ${sectionIndex++}. Protected Files: Database & Config (DO NOT MODIFY)
> [!IMPORTANT]
> The files \`internal/database/database.go\` and \`internal/config/config.go\` **MUST NOT BE MODIFIED** unless new environment variables or database connection configurations need to be explicitly added or changed.

### ${sectionIndex++}. Struct-Based Pattern (MUST Use Structs, NOT Global Variables / Loose Functions)
- **Dependency Injection via Structs:** All repositories, services, and handlers **MUST** be implemented as methods on a **\`struct\`** with constructor functions \`New...()\`.
- **NEVER use global variables or package-level mutable state:** Do not store database instances (\`*gorm.DB\`), authentication state, or dependencies in global variables. All dependencies must be injected via struct fields during initialization in \`routes.SetupRoutes\`.
- **Method Receivers:**
  - Repositories: \`func (r *userRepository) FindByID(id uint) (*models.User, error)\`
  - Services: \`func (s *userService) Register(req RegisterRequest) (*AuthResponse, error)\`
  - Handlers: \`func (h *UserHandler) Register(c fiber.Ctx) error\`

### ${sectionIndex++}. Naming Conventions per Layer
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
- **Strict File Length Limit (< 200 Lines):** Keep all component files concise and modular under 200 lines. Extract subcomponents into dedicated files.`);
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
