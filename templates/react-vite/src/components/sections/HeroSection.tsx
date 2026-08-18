import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useUiStore } from "@/stores/UiStore";
import { useAuthStore } from "@/stores/AuthStore";
import {
  ArrowRight,
  Server,
  Lock,
  Layers,
  Zap,
  Code2,
} from "lucide-react";

export function HeroSection() {
  const { openAuthModal } = useUiStore();
  const { isAuthenticated } = useAuthStore();

  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24">
      {/* Subtle radial background glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-40 dark:opacity-20">
        <div className="h-[450px] w-[650px] rounded-full bg-gradient-to-tr from-primary/20 via-primary/5 to-transparent blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto">
          {/* Release Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span>React 19 + Vite 6 + Tailwind CSS v4</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground max-w-3xl leading-[1.12]">
            High Performance{" "}
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              React + Vite
            </span>{" "}
            Boilerplate
          </h1>

          {/* Subtitle */}
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl font-normal leading-relaxed">
            Ultra-fast SPA frontend with Tailwind CSS v4, shadcn/ui components,
            Zustand state management, Zod schema validation, and Axios integration for Go Fiber backends.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {isAuthenticated ? (
              <a href="#dashboard">
                <Button size="lg" className="h-10 px-5 text-sm font-medium gap-2 shadow-xs cursor-pointer">
                  Open Dashboard <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
            ) : (
              <Button
                size="lg"
                onClick={() => openAuthModal("register")}
                className="h-10 px-5 text-sm font-medium gap-2 shadow-xs cursor-pointer"
              >
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            )}

            <a
              href="https://github.com/VYDev37/create-vy-project"
              target="_blank"
              rel="noreferrer"
            >
              <Button
                variant="outline"
                size="lg"
                className="h-10 px-5 text-sm font-medium gap-2 bg-background/50 backdrop-blur-xs cursor-pointer"
              >
                <Code2 className="h-4 w-4" />
                GitHub Repository
              </Button>
            </a>
          </div>

          {/* Key Value Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 w-full max-w-3xl">
            <Card className="p-3 bg-card/40 backdrop-blur-xs border-border/50 flex flex-col items-center justify-center text-center">
              <Zap className="h-4 w-4 text-amber-500 mb-1" />
              <p className="text-xs font-semibold">Vite 6 Fast HMR</p>
              <p className="text-[10px] text-muted-foreground">Instant server start</p>
            </Card>
            <Card className="p-3 bg-card/40 backdrop-blur-xs border-border/50 flex flex-col items-center justify-center text-center">
              <Layers className="h-4 w-4 text-blue-500 mb-1" />
              <p className="text-xs font-semibold">Tailwind CSS v4</p>
              <p className="text-[10px] text-muted-foreground">Oxide engine</p>
            </Card>
            <Card className="p-3 bg-card/40 backdrop-blur-xs border-border/50 flex flex-col items-center justify-center text-center">
              <Lock className="h-4 w-4 text-emerald-500 mb-1" />
              <p className="text-xs font-semibold">Cookie Auth</p>
              <p className="text-[10px] text-muted-foreground">HTTP-only JWT tokens</p>
            </Card>
            <Card className="p-3 bg-card/40 backdrop-blur-xs border-border/50 flex flex-col items-center justify-center text-center">
              <Server className="h-4 w-4 text-violet-500 mb-1" />
              <p className="text-xs font-semibold">Axios + Zod</p>
              <p className="text-[10px] text-muted-foreground">Type-safe API calls</p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
