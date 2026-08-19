"use client";

import * as React from "react";
import type { User } from "@/schemas/UserSchema";
import { ThemeProvider } from "./ThemeProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserProvider } from "./UserProvider";

interface AppProviderProps {
  initialUser?: User | null;
  children: React.ReactNode;
}

export function AppProvider({ initialUser, children }: AppProviderProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <UserProvider initialUser={initialUser}>
        <TooltipProvider delay={200}>{children}</TooltipProvider>
      </UserProvider>
    </ThemeProvider>
  );
}
