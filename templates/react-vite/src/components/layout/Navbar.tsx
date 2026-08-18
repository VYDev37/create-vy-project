import { BrandLogo } from "@/components/common/BrandLogo";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { MobileNav } from "./MobileNav";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/stores/AuthStore";
import { useUiStore } from "@/stores/UiStore";
import { useAuth } from "@/hooks/useAuth";
import { LayoutDashboard, LogOut } from "lucide-react";

export const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Architecture", href: "#architecture" },
  { label: "Stack", href: "#stack" },
];

export function Navbar({ onNavigate }: { onNavigate?: (view: "home" | "dashboard") => void }) {
  const { openAuthModal } = useUiStore();
  const { user, isAuthenticated } = useAuthStore();
  const { logout } = useAuth();

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      if (onNavigate) onNavigate("home");
      const targetId = href.replace("#", "");
      const elem = document.getElementById(targetId);
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 sm:px-6">
        {/* Brand & Left Navigation */}
        <div className="flex items-center gap-8">
          <div onClick={() => onNavigate && onNavigate("home")} className="cursor-pointer">
            <BrandLogo />
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-muted-foreground">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleSmoothScroll(e, link.href)}
                className="hover:text-foreground transition-colors cursor-pointer"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Right Actions Desktop */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />

          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                    <Avatar className="h-9 w-9 border border-border">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                }
              />
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none text-foreground">
                        {user.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground font-mono">
                        @{user.username}
                      </p>
                      <p className="text-[11px] leading-none text-muted-foreground truncate pt-0.5">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onNavigate && onNavigate("dashboard")}
                  className="cursor-pointer gap-2 flex items-center w-full"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 gap-2 flex items-center"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openAuthModal("login")}
                className="h-8 text-xs font-medium cursor-pointer"
              >
                Sign In
              </Button>
              <Button
                size="sm"
                onClick={() => openAuthModal("register")}
                className="h-8 text-xs font-medium cursor-pointer"
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Navigation Drawer */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <MobileNav onNavigate={onNavigate} />
        </div>
      </div>
    </header>
  );
}
