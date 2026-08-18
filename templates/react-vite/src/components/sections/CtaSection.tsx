import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useUiStore } from "@/stores/UiStore";
import { useAuthStore } from "@/stores/AuthStore";

export function CtaSection() {
  const { openAuthModal } = useUiStore();
  const { isAuthenticated } = useAuthStore();

  return (
    <section className="py-16 md:py-24 border-t border-border/40 bg-muted/20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
            Ready to start building with React & Vite?
          </h2>

          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            A simple, lightweight starter with prebuilt components, clean styling, and full TypeScript support.
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
                Create Account <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
