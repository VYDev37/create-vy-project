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
            Zero-trust session architecture
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          <div className="flex justify-between py-1 border-b border-border/40">
            <span className="text-muted-foreground">Token Type:</span>
            <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400">
              JWT (HMAC-SHA256)
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-border/40">
            <span className="text-muted-foreground">Cookie Mode:</span>
            <span className="font-mono font-medium">HTTP-Only</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-muted-foreground">Credentials:</span>
            <span className="font-mono font-medium">withCredentials=true</span>
          </div>
        </CardContent>
      </Card>

      {/* Engine / Client Card */}
      <Card className="border-border/60 shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Server className="h-4 w-4 text-blue-500" />
            <CardTitle className="text-base font-semibold">
              Frontend Engine
            </CardTitle>
          </div>
          <CardDescription className="text-xs">
            Next.js 16 runtime environment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          <div className="flex justify-between py-1 border-b border-border/40">
            <span className="text-muted-foreground">Framework:</span>
            <span className="font-medium">Next.js 16 (Client SPA)</span>
          </div>
          <div className="flex justify-between py-1 border-b border-border/40">
            <span className="text-muted-foreground">Styling:</span>
            <span className="font-medium">Tailwind CSS v4</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-muted-foreground">Client:</span>
            <span className="font-medium">Axios Instance</span>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
