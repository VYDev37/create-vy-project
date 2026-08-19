import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const STACK_ITEMS = [
  {
    category: "Framework",
    name: "Next.js 16 (App Router)",
    detail: "Fast Turbopack builds with modern React 19 server components.",
  },
  {
    category: "Database",
    name: "Drizzle ORM & SQLite",
    detail: "Type-safe database layer with instant local SQLite file storage.",
  },
  {
    category: "Authentication",
    name: "Iron Session & Argon2",
    detail: "Encrypted cookie sessions paired with safe password hashing.",
  },
  {
    category: "Styling & UI",
    name: "Tailwind CSS v4 & shadcn",
    detail: "Clean theme variables with accessible, unstyled UI primitives.",
  },
  {
    category: "Validation & State",
    name: "Zod, Hook Form & Zustand",
    detail: "Schema-first type safety with lightweight client state management.",
  },
  {
    category: "HTTP Client",
    name: "Axios Client",
    detail: "Centralized API instance with error helpers and cookie credentials.",
  },
];

export function TechStack() {
  return (
    <section id="stack" className="py-16 md:py-24 border-t border-border/40 bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <Badge variant="outline" className="text-xs">
            Toolchain
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            A balanced and predictable stack.
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Packages selected for simplicity, maintainability, and clean developer experience.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {STACK_ITEMS.map((item) => (
            <Card
              key={item.name}
              className="p-5 border-border/60 bg-card hover:border-border transition-colors space-y-2"
            >
              <span className="text-[11px] font-mono font-medium text-muted-foreground uppercase tracking-wider">
                {item.category}
              </span>
              <h3 className="text-base font-semibold text-foreground">
                {item.name}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {item.detail}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
