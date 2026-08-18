import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Zap, Layers, Cpu } from "lucide-react";

export function BentoFeatures() {
  return (
    <section id="features" className="py-16 md:py-24 border-t border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <Badge variant="outline" className="text-xs">
            Overview
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Simple, organized SPA setup.
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            A tidy React starter with predictable patterns, clean components, and easy state management.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 p-6 md:p-8 flex flex-col justify-between border-border/60 bg-gradient-to-br from-card to-muted/40 relative overflow-hidden">
            <div className="space-y-3 z-10 max-w-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-foreground">
                Vite 6 Development
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Instant dev server startup and fast Hot Module Replacement (HMR) powered by modern Vite tooling.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-border/40 flex flex-wrap gap-2 text-xs font-mono text-muted-foreground z-10">
              <span className="rounded bg-background/80 px-2 py-1 border border-border/40">
                React 19
              </span>
              <span className="rounded bg-background/80 px-2 py-1 border border-border/40">
                Vite 6
              </span>
              <span className="rounded bg-background/80 px-2 py-1 border border-border/40">
                TypeScript
              </span>
            </div>
          </Card>

          <Card className="p-6 md:p-8 flex flex-col justify-between border-border/60 bg-card">
            <div className="space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-foreground">
                Cookie Auth Ready
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Pre-configured to talk to backend authentication endpoints using secure HTTP-only cookies.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-border/40 text-xs font-mono text-emerald-600 dark:text-emerald-400">
              Safe Sessions
            </div>
          </Card>

          <Card className="p-6 md:p-8 flex flex-col justify-between border-border/60 bg-card">
            <div className="space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-foreground">
                Tailwind CSS v4 & shadcn
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Tidy UI primitives styled with modern CSS variables, supporting both light and dark mode out of the box.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-border/40 text-xs font-mono text-muted-foreground">
              Dark and Light Themes
            </div>
          </Card>

          <Card className="md:col-span-2 p-6 md:p-8 flex flex-col justify-between border-border/60 bg-gradient-to-br from-card to-muted/40">
            <div className="space-y-3 max-w-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Cpu className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-foreground">
                Zod Validation & React Hook Form
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Single source of truth for types and validation schemas. Forms are responsive, clear, and fully type-checked.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-border/40 flex flex-wrap gap-2 text-xs font-mono text-muted-foreground">
              <span className="rounded bg-background/80 px-2 py-1 border border-border/40">
                Zod Schemas
              </span>
              <span className="rounded bg-background/80 px-2 py-1 border border-border/40">
                React Hook Form
              </span>
              <span className="rounded bg-background/80 px-2 py-1 border border-border/40">
                Zustand Store
              </span>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
