import Link from "next/link";
import { BrandLogo } from "@/components/common/BrandLogo";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <BrandLogo />
            <p className="text-xs text-muted-foreground">
              Fullstack Next.js boilerplate with Iron Session, Tailwind CSS v4, and shadcn/ui.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
            <Link href="#architecture" className="hover:text-foreground transition-colors">
              Architecture
            </Link>
            <Link href="#features" className="hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#stack" className="hover:text-foreground transition-colors">
              Stack
            </Link>
            <Link
              href="https://github.com/VYDev37/create-vy-project"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </Link>
          </div>
        </div>

        <div className="mt-8 border-t border-border/40 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} NextStack Starter. Built with precision.</p>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-foreground">
              Tailwind v4
            </span>
            <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-foreground">
              Iron-Session
            </span>
            <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-foreground">
              Argon2
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
