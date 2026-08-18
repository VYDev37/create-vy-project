import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useUiStore } from "@/stores/UiStore";
import { useAuthStore } from "@/stores/AuthStore";

export function CtaSection() {
  const { openAuthModal } = useUiStore();
  const { isAuthenticated } = useAuthStore();

  return (
    <section className="py-16 md:py-24 border-t border-border/40 bg-muted/20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Ready for Production
          </div>

          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
            Start Building with React 19 & Vite Today
          </h2>

          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            Zero-config SPA development setup with prebuilt components, full styling,
            and end-to-end type safety out of the box.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {isAuthenticated ? (
              <a href="#dashboard">
                <Button size="lg" className="h-10 px-6 text-sm font-medium gap-2 shadow-xs cursor-pointer">
                  Go to Dashboard <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
            ) : (
              <Button
                size="lg"
                onClick={() => openAuthModal("register")}
                className="h-10 px-6 text-sm font-medium gap-2 shadow-xs cursor-pointer"
              >
                Create Free Account <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
