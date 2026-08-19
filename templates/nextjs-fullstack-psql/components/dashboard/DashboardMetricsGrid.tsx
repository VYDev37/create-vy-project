import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ShieldCheck, Server } from "lucide-react";

export function DashboardMetricsGrid() {
  return (
    <>
      {/* Security Overview Card */}
      <Card className="border-border/60 shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <CardTitle className="text-base font-semibold">
              Security Overview
            </CardTitle>
          </div>
          <CardDescription className="text-xs">
            Encrypted session configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          <div className="flex justify-between py-1 border-b border-border/40">
            <span className="text-muted-foreground">Password Hash:</span>
            <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400">
              Argon2id
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-border/40">
            <span className="text-muted-foreground">Cookie Mode:</span>
            <span className="font-mono font-medium">HTTP-Only / Sealed</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-muted-foreground">CSRF Protection:</span>
            <span className="font-mono font-medium">SameSite=Lax</span>
          </div>
        </CardContent>
      </Card>

      {/* Database / Engine Card */}
      <Card className="border-border/60 shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Server className="h-4 w-4 text-blue-500" />
            <CardTitle className="text-base font-semibold">
              Database & Engine
            </CardTitle>
          </div>
          <CardDescription className="text-xs">
            Drizzle ORM runtime
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          <div className="flex justify-between py-1 border-b border-border/40">
            <span className="text-muted-foreground">Database:</span>
            <span className="font-medium">LibSQL / SQLite</span>
          </div>
          <div className="flex justify-between py-1 border-b border-border/40">
            <span className="text-muted-foreground">ORM:</span>
            <span className="font-medium">Drizzle ORM</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-muted-foreground">Styling:</span>
            <span className="font-medium">Tailwind CSS v4</span>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
