import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  BarChart3,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react";
import { BrandLogo } from "@/components/common/BrandLogo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/stores/AuthStore";
import { useAuth } from "@/hooks/useAuth";

export interface SidebarNavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const SIDEBAR_NAV_ITEMS: SidebarNavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Analytics", href: "/analytics", icon: BarChart3 },
  { title: "Projects", href: "/projects", icon: FolderKanban, badge: "New" },
  { title: "Team", href: "/team", icon: Users },
  { title: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const { user } = useAuthStore();
  const { logout } = useAuth();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

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
    <ShadcnSidebar collapsible="icon" className="border-r border-border/40 bg-card/60 backdrop-blur-xl">
      <SidebarHeader className="border-b border-border/40 p-3">
        <div className="flex items-center justify-between">
          {!isCollapsed ? (
            <BrandLogo />
          ) : (
            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Sparkles className="h-4 w-4" />
            </div>
          )}
          <SidebarTrigger className="hidden md:flex h-7 w-7 text-muted-foreground hover:text-foreground" />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {SIDEBAR_NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link to={item.href} />}
                      isActive={isActive}
                      tooltip={item.title}
                      className={
                        isActive
                          ? "bg-primary text-primary-foreground font-medium shadow-xs hover:bg-primary/90 hover:text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                      }
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                    {item.badge && (
                      <SidebarMenuBadge className="bg-primary/20 text-primary text-[10px] font-semibold">
                        {item.badge}
                      </SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/40 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            {isCollapsed ? (
              <SidebarMenuButton
                tooltip="Log Out"
                onClick={() => logout()}
                className="justify-center text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="h-4 w-4" />
              </SidebarMenuButton>
            ) : (
              <div className="flex items-center justify-between w-full p-1.5 rounded-lg hover:bg-muted/40 transition-colors">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <Avatar className="h-7 w-7 border border-border/60">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                      {getInitials(user?.name || user?.username)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-foreground">
                      {user?.name || user?.username || "Guest User"}
                    </p>
                    <p className="truncate text-[10px] text-muted-foreground">{user?.email || "Signed in"}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  onClick={() => logout()}
                  aria-label="Logout"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </ShadcnSidebar>
  );
}
