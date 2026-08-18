import Link from "next/link";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  showText?: boolean;
}

export function BrandLogo({ className, showText = true }: BrandLogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "group flex items-center gap-2.5 transition-opacity hover:opacity-90",
        className
      )}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background font-mono text-sm font-bold shadow-sm transition-transform duration-200 group-hover:scale-105">
        VY
      </div>
      {showText && (
        <span className="font-semibold tracking-tight text-foreground text-base">
          Next<span className="text-muted-foreground font-normal">Stack</span>
        </span>
      )}
    </Link>
  );
}
