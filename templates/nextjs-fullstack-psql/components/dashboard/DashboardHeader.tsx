import { BrandLogo } from "@/components/common/BrandLogo";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { SignOutButton } from "./SignOutButton";

export function DashboardHeader() {
  return (
    <header className="border-b border-border/50 bg-background/80 backdrop-blur-md px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <BrandLogo />
        <span className="hidden sm:inline-block text-muted-foreground text-xs">/</span>
        <span className="hidden sm:inline-block text-xs font-medium text-foreground">
          Dashboard
        </span>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <SignOutButton />
      </div>
    </header>
  );
}
