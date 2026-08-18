export function generateAgentsMd(stacks: string[]): string {
  const stackList = stacks.map((s) => `- \`${s}\``).join("\n");

  return `# Agent Instructions & Guidelines

This project was scaffolded with \`create-vy-project\`.

## Active Stacks
${stackList}

## Agent Workflow & Skill Guidelines
Before modifying, generating, or refactoring code in this repository, agents MUST consult the local skills located in \`.agents/skills/\`:

- **General & Anti-Slop:** Read \`.agents/skills/general/stop-slop.md\` for clean, human, humble writing without AI buzzwords or em-dashes.
- **Next.js & Frontend Conventions:** Read \`.agents/skills/frontend/nextjs-conventions.md\` for Server Component first rules, colocated client components, and PascalCase.
- **State Management:** Read \`.agents/skills/frontend/react-state-management.md\` for Zustand atomic selectors and \`UserProvider\` context.
- **Frontend UI Quality:** Read \`.agents/skills/frontend/frontend-developer.md\` for accessible, modular component architecture.
- **Backend Architecture:** Check \`.agents/skills/backend/\` for database ORM patterns, authentication, and API endpoints.

---

## Core Directives & Standards

### 1. File & Component Naming Conventions
- **PascalCase by Default:** All custom React components, layouts, sections, schemas, stores, database files, and providers MUST be named in **\`PascalCase\`** (e.g., \`Navbar.tsx\`, \`HeroSection.tsx\`, \`LoginForm.tsx\`, \`UserSchema.ts\`, \`AuthStore.ts\`, \`UserProvider.tsx\`, \`Schema.ts\`, \`UserRepository.ts\`).
- **Database Layer in \`db/\`:** All Drizzle/GORM schemas, database connection singletons, and repositories MUST live in the \`db/\` directory.
- **UI Primitives Exception:** Files located inside \`components/ui/\` follow standard shadcn \`kebab-case\` conventions (e.g., \`button.tsx\`, \`dropdown-menu.tsx\`, \`skeleton.tsx\`, \`sheet.tsx\`).
- **Next.js App Router Special Files:** Routing convention files retain Next.js standards (\`page.tsx\`, \`layout.tsx\`, \`loading.tsx\`, \`error.tsx\`, \`route.ts\`).

### 2. Server Component Priority, Colocation & File Size Limit
- **Server Component First (\`page.tsx\`):** All Next.js pages MUST be Server Components for SSR, server-side route guards (\`redirect("/login")\`), and explicit \`Metadata\`.
- **Colocated Client Components (\`[Feature]Client.tsx\`):** Place interactive client wrappers directly in the route folder alongside \`page.tsx\` (e.g., \`app/(dashboard)/dashboard/DashboardClient.tsx\`).
- **Route-Level \`loading.tsx\`:** Place dedicated loading skeletons in route folders instead of messy \`if (isLoading)\` state branches in components.
- **Strict File Length Limit (< 200 Lines):** Keep all files concise and modular under 200 lines. Extract subcomponents into dedicated files.

### 3. Type Safety & Single Source of Truth (Zod Rule)
- **Zero Arbitrary Types:** Never create loose, unvalidated TypeScript interfaces for core domain entities.
- **Schema-First Inference:** Always define runtime Zod schemas in \`schemas/\` and infer types using \`export type User = z.infer<typeof UserSchema>;\`.

### 4. UI/UX Craft & Anti-Slop Principles
- **No Em-Dashes (\`—\`):** Never use em-dashes in user-facing copy or labels.
- **No AI Buzzwords:** Keep copy simple, natural, and humble. Avoid words like "delve", "testament", "unleash", "elevate", "cutting-edge", "game-changer", "tapestry", "seamlessly", "enterprise-grade".
- **Single-Line Desktop Actions:** Navbar, primary CTA buttons, and header action rows must remain single-line without awkward wrapping.
- **Strict WCAG AA:** All text, badges, and form controls must maintain high contrast (minimum 4.5:1).
`;
}
