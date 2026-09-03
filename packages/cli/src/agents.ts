export function generateAgentsMd(stacks: string[]): string {
  const stackList = stacks.map((s) => `- \`${s}\``).join("\n");
  const hasGo = stacks.includes("go-fiber");
  const hasFrontend = stacks.some((s) => s.startsWith("nextjs") || s === "react-vite");

  const skillGuidelines: string[] = [
    "- **General & Anti-Slop:** Read `.agents/skills/general/stop-slop.md` for clean, human, humble writing without AI buzzwords or em-dashes.",
  ];

  if (hasGo) {
    skillGuidelines.push(
      "- **Go Fiber Conventions & Architecture:** Read `.agents/skills/backend/go-fiber-convention.md` for layer separation, Fiber v3 handlers, and response shapes.",
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
      "- **Golang Files (Strict Lowercase & snake_case):** Khusus semua file Golang (`.go`), semua nama file **WAJIB** menggunakan **`lowercase`** dan format **`snake_case`** (contoh: `user_handler.go`, `user_repository.go`, `user_service.go`, `auto_migrate.go`, `read_env.go`, `auth.go`, `main.go`). DILARANG KERAS menggunakan PascalCase (e.g., `UserHandler.go`), camelCase (e.g., `userHandler.go`), atau kebab-case untuk nama file Go. Direktori Go juga wajib lowercase (`cmd/`, `internal/handlers/`, dll.)."
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
    sections.push(`### 2. Go Fiber Architecture & Layering Rules
- **\`cmd/main.go\`:** Entry point for loading configuration, database connection, Fiber v3 setup, and mounting routes.
- **\`internal/models/\`:** Pure GORM struct models representing database tables and JSON/GORM tags.
- **\`internal/repositories/\`:** Data access layer executing database queries with \`*gorm.DB\`.
- **\`internal/services/\`:** Pure business logic layer. Receives repositories via interface.
- **\`internal/handlers/\`:** Fiber HTTP handlers parsing input (\`c.Bind().Body()\`), validating, and returning standardized JSON responses.
- **\`internal/middlewares/\`:** Fiber middlewares (CORS, JWT auth, logging).
- **\`internal/routes/\`:** Dependency injection wiring and HTTP route definitions.
- **Standard JSON Response Shape:**
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

  // Section 3: Frontend Directives (if Frontend present)
  if (hasFrontend) {
    sections.push(`### ${hasGo ? "3" : "2"}. Server Component Priority, Colocation & File Size Limit
- **Server Component First (\`page.tsx\`):** All Next.js pages MUST be Server Components for SSR, server-side route guards (\`redirect("/login")\`), and explicit \`Metadata\`.
- **Colocated Client Components (\`[Feature]Client.tsx\`):** Place interactive client wrappers directly in the route folder alongside \`page.tsx\` (e.g., \`app/(dashboard)/dashboard/DashboardClient.tsx\`).
- **Route-Level \`loading.tsx\`:** Place dedicated loading skeletons in route folders instead of messy \`if (isLoading)\` state branches in components.
- **Strict File Length Limit (< 200 Lines):** Keep all files concise and modular under 200 lines. Extract subcomponents into dedicated files.

### ${hasGo ? "4" : "3"}. Type Safety & Single Source of Truth (Zod Rule)
- **Zero Arbitrary Types:** Never create loose, unvalidated TypeScript interfaces for core domain entities.
- **Schema-First Inference:** Always define runtime Zod schemas in \`schemas/\` and infer types using \`export type User = z.infer<typeof UserSchema>;\`.`);
  }

  // Final Section: UI/UX Craft & Anti-Slop
  const craftNumber = hasGo && hasFrontend ? 5 : hasGo || hasFrontend ? 3 : 2;
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
