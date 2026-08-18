import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, KeyRound, Layers, Cpu } from "lucide-react";

export function BentoFeatures() {
  return (
    <section id="features" className="py-16 md:py-24 border-t border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <Badge variant="outline" className="text-xs">
            Architecture
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Engineered for security and speed.
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            A battle-tested foundation built with zero compromises on type safety and user experience.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Iron Session (Span 2 on Desktop) */}
          <Card className="md:col-span-2 p-6 md:p-8 flex flex-col justify-between border-border/60 bg-gradient-to-br from-card to-muted/40 relative overflow-hidden">
            <div className="space-y-3 z-10 max-w-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-foreground">
                Sealed Iron Session Authentication
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Stateful-feeling stateless sessions stored in encrypted cookies. No database lookups needed on every request, eliminating server bottlenecks while preventing XSS token theft.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-border/40 flex flex-wrap gap-2 text-xs font-mono text-muted-foreground z-10">
              <span className="rounded bg-background/80 px-2 py-1 border border-border/40">
                HTTP-Only
              </span>
              <span className="rounded bg-background/80 px-2 py-1 border border-border/40">
                SameSite: Lax
              </span>
              <span className="rounded bg-background/80 px-2 py-1 border border-border/40">
                Encrypted Payload
              </span>
            </div>
          </Card>

          {/* Card 2: Argon2 Password Hashing */}
          <Card className="p-6 md:p-8 flex flex-col justify-between border-border/60 bg-card">
            <div className="space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                <KeyRound className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-foreground">
                Argon2id Hashing
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Winner of the Password Hashing Competition. Resistant to GPU and side-channel attacks with configurable memory and time cost.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-border/40 text-xs font-mono text-emerald-600 dark:text-emerald-400">
              RFC 9106 Standard
            </div>
          </Card>

          {/* Card 3: Tailwind CSS v4 & shadcn */}
          <Card className="p-6 md:p-8 flex flex-col justify-between border-border/60 bg-card">
            <div className="space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-foreground">
                Tailwind CSS v4 + shadcn
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Lightning fast CSS engine with native `@theme` tokens, zero runtime style cost, and accessible UI primitives ready to customize.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-border/40 text-xs font-mono text-muted-foreground">
              Pre-built Theme Variables
            </div>
          </Card>

          {/* Card 4: End-to-End Type Safety (Span 2 on Desktop) */}
          <Card className="md:col-span-2 p-6 md:p-8 flex flex-col justify-between border-border/60 bg-gradient-to-br from-card to-muted/40">
            <div className="space-y-3 max-w-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Cpu className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-foreground">
                Zod Validation and Zustand Stores
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Strict type validation on client forms and server boundaries with predictable lightweight state management for notifications, modals, and reactive sessions.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-border/40 flex flex-wrap gap-2 text-xs font-mono text-muted-foreground">
              <span className="rounded bg-background/80 px-2 py-1 border border-border/40">
                Zod v4
              </span>
              <span className="rounded bg-background/80 px-2 py-1 border border-border/40">
                Zustand v5
              </span>
              <span className="rounded bg-background/80 px-2 py-1 border border-border/40">
                TypeScript Strict
              </span>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
