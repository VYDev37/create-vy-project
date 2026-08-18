"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InstallSnippet } from "@/components/common/InstallSnippet";
import { useUiStore } from "@/stores/UiStore";
import { useAuthStore } from "@/stores/AuthStore";
import {
  ArrowRight,
  CheckCircle2,
  Server,
  Lock,
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

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Value Prop */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-3.5 py-1 text-xs font-medium text-foreground">
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>Next.js 16 + Tailwind v4 + Axios</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
              A clean frontend starter for Go Fiber APIs.
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
              My personal client template designed to connect cleanly with a Go Fiber backend API using Axios, Zustand, and TypeScript.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              {isAuthenticated ? (
                <Link href="/dashboard" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto gap-2 text-sm font-medium h-11 px-6">
                    Open Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Button
                    size="lg"
                    onClick={() => openAuthModal("register")}
                    className="w-full sm:w-auto gap-2 text-sm font-medium h-11 px-6"
                  >
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => openAuthModal("login")}
                    className="w-full sm:w-auto text-sm font-medium h-11 px-6"
                  >
                    Try Demo Account
                  </Button>
                </>
              )}
            </div>

            {/* Quick Install Command Tab */}
            <div className="pt-2 max-w-lg mx-auto lg:mx-0">
              <InstallSnippet />
            </div>

            {/* Quick feature checklist */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 pt-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>Axios interceptors</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>JWT cookie support</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>Zustand store ready</span>
              </div>
            </div>
          </div>

          {/* Right Column: Code & Architecture Card */}
          <div id="architecture" className="lg:col-span-5">
            <Card className="border-border/60 bg-card/70 backdrop-blur-sm shadow-xl p-5 space-y-4">
              {/* Terminal header */}
              <div className="flex items-center justify-between border-b border-border/50 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
                  </div>
                  <span className="text-[11px] font-mono text-muted-foreground ml-2">
                    lib/ApiClient.ts
                  </span>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">
                  Axios HTTP Client
                </span>
              </div>

              {/* Code preview */}
              <div className="rounded-lg bg-muted/70 p-3.5 font-mono text-[11px] leading-relaxed text-foreground space-y-1">
                <p className="text-muted-foreground">// Preconfigured Axios instance</p>
                <p>
                  <span className="text-primary font-semibold">export const</span> apiClient = axios.create({"{"}
                </p>
                <p className="pl-4 text-muted-foreground">
                  baseURL: process.env.NEXT_PUBLIC_API_URL,
                </p>
                <p className="pl-4 text-muted-foreground">
                  withCredentials: <span className="text-primary">true</span>,
                </p>
                <p>{"});"}</p>
              </div>

              {/* Security Metrics Pills */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="flex items-center gap-2.5 rounded-md border border-border/50 bg-background/60 p-2.5">
                  <Lock className="h-4 w-4 text-emerald-500 shrink-0" />
                  <div>
                    <p className="text-[11px] font-semibold">HTTP-Only</p>
                    <p className="text-[10px] text-muted-foreground">JWT Cookies</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 rounded-md border border-border/50 bg-background/60 p-2.5">
                  <Server className="h-4 w-4 text-blue-500 shrink-0" />
                  <div>
                    <p className="text-[11px] font-semibold">Go Fiber</p>
                    <p className="text-[10px] text-muted-foreground">Backend Ready</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
