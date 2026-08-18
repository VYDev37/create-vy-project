import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const STACK_ITEMS = [
  {
    category: "Framework",
    name: "Next.js 16 (App Router)",
    detail: "React 19 Server Components, Server Actions, and Turbopack support.",
  },
  {
    category: "Authentication",
    name: "Iron Session + Argon2",
    detail: "Encrypted stateless cookie sessions with RFC 9106 password hashing.",
  },
  {
    category: "Styling & UI",
    name: "Tailwind CSS v4 + shadcn/ui",
    detail: "Modern theme engine with Radix-accessible components.",
  },
  {
    category: "Validation & State",
    name: "Zod + Zustand",
    detail: "Runtime schema validation with zero-boilerplate reactive stores.",
  },
  {
    category: "Client",
    name: "Axios + Custom Hooks",
    detail: "Configured HTTP client with auto-refresh and error handling interceptors.",
  },
  {
    category: "Backend Interop",
    name: "Go Fiber Compatible",
    detail: "Shared cookie specifications allowing seamless separation into Go Fiber backend.",
  },
];

export function TechStack() {
  return (
    <section id="stack" className="py-16 md:py-24 border-t border-border/40 bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <Badge variant="outline" className="text-xs">
            Stack
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Curated modern toolchain.
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Zero legacy debt. Every package is chosen for performance, security, and developer ergonomics.
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
