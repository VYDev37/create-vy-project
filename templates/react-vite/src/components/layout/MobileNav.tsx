import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BrandLogo } from "@/components/common/BrandLogo";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuthStore } from "@/stores/AuthStore";
import { useUiStore } from "@/stores/UiStore";
import { useAuth } from "@/hooks/useAuth";
import { Menu, LayoutDashboard, LogOut, LogIn, UserPlus } from "lucide-react";
import { NAV_LINKS } from "./Navbar";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { openAuthModal } = useUiStore();
  const { user, isAuthenticated } = useAuthStore();
  const { logout } = useAuth();

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("/#")) {
      e.preventDefault();
      setOpen(false);
      const targetId = href.replace("/#", "");
      if (window.location.pathname !== "/") {
        navigate("/");
        setTimeout(() => {
          const elem = document.getElementById(targetId);
          if (elem) elem.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        const elem = document.getElementById(targetId);
        if (elem) elem.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Open navigation menu">
            <Menu className="h-4 w-4" />
          </Button>
        }
      />
      <SheetContent side="right" className="w-[280px] sm:w-[320px] flex flex-col justify-between p-6">
        <div className="space-y-6">
          <SheetHeader className="text-left">
            <SheetTitle>
              <Link to="/" onClick={() => setOpen(false)}>
                <BrandLogo />
              </Link>
            </SheetTitle>
          </SheetHeader>

          <nav className="flex flex-col space-y-3 pt-2">
            {NAV_LINKS.map((link) => (
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

        <div className="space-y-4 border-t border-border/40 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-xs font-medium">Theme</span>
            <ThemeToggle />
          </div>

          {isAuthenticated && user ? (
            <div className="space-y-2">
              <div className="rounded-lg bg-muted p-3 text-xs space-y-0.5">
                <p className="font-semibold text-foreground">{user.name}</p>
                <p className="text-[11px] font-mono text-muted-foreground">@{user.username}</p>
                <p className="text-muted-foreground truncate text-[11px]">{user.email}</p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  navigate("/dashboard");
                }}
                className="w-full justify-start gap-2 h-9"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Button>
              <Button
                variant="destructive"
                className="w-full justify-start gap-2 h-9"
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
              >
                <LogOut className="h-4 w-4" />
                Log Out
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                className="w-full justify-start gap-2 h-9 text-xs"
                onClick={() => {
                  setOpen(false);
                  openAuthModal("login");
                }}
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </Button>
              <Button
                className="w-full justify-start gap-2 h-9 text-xs"
                onClick={() => {
                  setOpen(false);
                  openAuthModal("register");
                }}
              >
                <UserPlus className="h-4 w-4" />
                Create Account
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
