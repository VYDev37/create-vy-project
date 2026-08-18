"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  { label: "Architecture", href: "#architecture" },
  { label: "Features", href: "#features" },
  { label: "Stack", href: "#stack" },
];

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { openAuthModal } = useUiStore();
  const { user, isAuthenticated } = useAuthStore();
  const { logout } = useAuth();

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.replace("#", "");

      if (pathname === "/") {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
          window.history.pushState(null, "", href);
        }
      } else {
        router.push("/" + href);
      }
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
    router.refresh();
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
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <BrandLogo />
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
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

        {/* Right side controls */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />

          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full p-0"
                  >
                    <Avatar className="h-9 w-9 border border-border">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                        {getInitials(user?.name)}
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
                        {user?.name || "Developer"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground font-mono">
                        @{user?.username}
                      </p>
                      <p className="text-[11px] leading-none text-muted-foreground truncate pt-0.5">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  render={
                    <Link href="/dashboard" className="cursor-pointer gap-2 flex items-center w-full">
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                  }
                />
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-destructive focus:text-destructive gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openAuthModal("login")}
                className="text-sm"
              >
                Sign In
              </Button>
              <Button
                size="sm"
                onClick={() => openAuthModal("register")}
                className="text-sm"
              >
                Get Started
              </Button>
            </div>
          )}
        </div>

        {/* Mobile menu */}
        <MobileNav navLinks={NAV_LINKS} />
      </div>
    </header>
  );
}
