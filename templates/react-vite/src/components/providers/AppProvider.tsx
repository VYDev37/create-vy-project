import React from "react";
import { ThemeProvider } from "./ThemeProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthModal } from "@/components/auth/AuthModal";

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <TooltipProvider delay={200}>
        {children}
        <AuthModal />
      </TooltipProvider>
    </ThemeProvider>
  );
}
