import { BrandLogo } from "@/components/common/BrandLogo";

export function Footer() {
  return (
    <footer className="border-t border-border/40 py-8 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <BrandLogo />
            <span className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} VYDev37. Released under MIT License.
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#architecture" className="hover:text-foreground transition-colors">
              Architecture
            </a>
            <a href="#stack" className="hover:text-foreground transition-colors">
              Stack
            </a>
            <a
              href="https://github.com/VYDev37/create-vy-project"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
