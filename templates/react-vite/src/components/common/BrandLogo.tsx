import { Shield } from "lucide-react";

export function BrandLogo() {
  return (
    <a href="#" className="flex items-center gap-2 font-bold tracking-tight text-foreground group">
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs group-hover:scale-105 transition-transform">
        <Shield className="h-4 w-4" />
      </div>
      <span className="font-semibold text-sm tracking-tight">VY React</span>
    </a>
  );
}
