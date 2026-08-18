import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

export function DashboardStatusBanner() {
  return (
    <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
        <div>
          <p className="text-xs font-semibold text-foreground">
            Session Active & Verified
          </p>
          <p className="text-[11px] text-muted-foreground">
            Authenticated via Iron Session encrypted cookie on server runtime.
          </p>
        </div>
      </div>
      <Badge variant="secondary" className="text-[10px] font-mono">
        Server Verified
      </Badge>
    </div>
  );
}
