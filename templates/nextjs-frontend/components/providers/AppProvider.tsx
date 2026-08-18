"use client";

import * as React from "react";
import { ThemeProvider } from "./ThemeProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserProvider } from "./UserProvider";

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <UserProvider>
        <TooltipProvider delay={200}>{children}</TooltipProvider>
      </UserProvider>
    </ThemeProvider>
  );
}
