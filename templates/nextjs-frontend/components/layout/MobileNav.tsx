"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, LayoutDashboard, LogOut } from "lucide-react";
import { BrandLogo } from "@/components/common/BrandLogo";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { useAuthStore } from "@/stores/AuthStore";
import { useUiStore } from "@/stores/UiStore";
import { useAuth } from "@/hooks/useAuth";

interface MobileNavProps {
  navLinks: Array<{ label: string; href: string }>;
}

export function MobileNav({ navLinks }: MobileNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { mobileMenuOpen, setMobileMenuOpen, openAuthModal } = useUiStore();
  const { user, isAuthenticated } = useAuthStore();
  const { logout } = useAuth();

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setMobileMenuOpen(false);
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.replace("#", "");

      if (pathname === "/") {
        setTimeout(() => {
          const element = document.getElementById(targetId);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
            window.history.pushState(null, "", href);
          }
        }, 150);
      } else {
        router.push("/" + href);
      }
    }
  };

  return (
    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 md:hidden"
            aria-label="Open mobile menu"
          />
        }
      >
        <Menu className="h-5 w-5" />
      </SheetTrigger>
      <SheetContent side="right" className="flex w-72 flex-col justify-between p-6">
        <div className="space-y-6">
          <SheetHeader className="text-left">
            <SheetTitle>
              <BrandLogo />
            </SheetTitle>
          </SheetHeader>

          <nav className="flex flex-col space-y-3 pt-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleSmoothScroll(e, link.href)}
                className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors py-1.5 cursor-pointer"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="space-y-4 border-t pt-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-xs font-medium">Theme</span>
            <ThemeToggle />
          </div>

          {isAuthenticated ? (
            <div className="space-y-2">
              <div className="rounded-lg bg-muted p-3 text-xs space-y-0.5">
                <p className="font-semibold text-foreground">{user?.name}</p>
                <p className="text-[11px] font-mono text-muted-foreground">@{user?.username}</p>
                <p className="text-muted-foreground truncate text-[11px]">{user?.email}</p>
              </div>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full block"
              >
                <Button variant="outline" className="w-full justify-start gap-2 h-9">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Button
                variant="destructive"
                className="w-full justify-start gap-2 h-9 cursor-pointer"
                onClick={async () => {
                  setMobileMenuOpen(false);
                  await logout();
                  router.push("/");
                  router.refresh();
                }}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                className="w-full h-9"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal("login");
                }}
              >
                Sign In
              </Button>
              <Button
                className="w-full h-9"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal("register");
                }}
              >
                Get Started
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
