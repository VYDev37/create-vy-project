import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type User, getRoleLabel } from "@/schemas/UserSchema";
import { User as UserIcon } from "lucide-react";

interface DashboardProfileCardProps {
  user: User | null;
}

export function DashboardProfileCard({ user }: DashboardProfileCardProps) {
  return (
    <Card className="border-border/60 shadow-xs">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <UserIcon className="h-4 w-4 text-primary" />
          <CardTitle className="text-base font-semibold">
            Profile Details
          </CardTitle>
        </div>
        <CardDescription className="text-xs">
          Authenticated user account details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-xs">
        <div className="flex justify-between py-1 border-b border-border/40">
          <span className="text-muted-foreground">Username:</span>
          <span className="font-mono font-medium">@{user?.username || "demodev"}</span>
        </div>
        <div className="flex justify-between py-1 border-b border-border/40">
          <span className="text-muted-foreground">Name:</span>
          <span className="font-medium">{user?.name || "Demo Developer"}</span>
        </div>
        <div className="flex justify-between py-1 border-b border-border/40">
          <span className="text-muted-foreground">Email:</span>
          <span className="font-medium">{user?.email || "demo@example.com"}</span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-muted-foreground">Role:</span>
          <Badge variant="outline" className="text-[10px] font-semibold">
            {getRoleLabel(user?.role)}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
