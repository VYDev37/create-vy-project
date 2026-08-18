import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  showText?: boolean;
}

export function BrandLogo({ className, showText = true }: BrandLogoProps) {
  return (
    <div className={cn("flex items-center gap-2 font-bold tracking-tight text-foreground group select-none", className)}>
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs group-hover:scale-105 transition-transform">
        <Shield className="h-4 w-4" />
      </div>
      {showText && (
        <span className="font-semibold text-sm tracking-tight">
          VY <span className="text-muted-foreground font-normal">React</span>
        </span>
      )}
    </div>
  );
}
