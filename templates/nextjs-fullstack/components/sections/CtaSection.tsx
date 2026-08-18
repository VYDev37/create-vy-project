"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useUiStore } from "@/stores/UiStore";
import { useAuthStore } from "@/stores/AuthStore";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
  const { openAuthModal } = useUiStore();
  const { isAuthenticated } = useAuthStore();

  return (
    <section className="py-16 md:py-24 border-t border-border/40">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Card className="relative overflow-hidden p-8 sm:p-12 text-center border-border/70 bg-gradient-to-b from-card to-muted/40 shadow-lg space-y-6">
          <div className="space-y-3 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Ready to start your project?
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Use this boilerplate as a starting point. It is set up with tidy defaults so you can focus on building your features.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button size="lg" className="gap-2 text-sm font-medium h-11 px-8">
                  Open Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Button
                size="lg"
                onClick={() => openAuthModal("register")}
                className="gap-2 text-sm font-medium h-11 px-8"
              >
                Create Account
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </Card>
      </div>
    </section>
  );
}
