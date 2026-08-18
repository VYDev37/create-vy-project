import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LucideIcon } from "lucide-react";

export interface AuthInputGroupProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  icon: LucideIcon;
  error?: string;
}

export const AuthInputGroup = React.forwardRef<HTMLInputElement, AuthInputGroupProps>(
  ({ id, label, icon: Icon, error, ...inputProps }, ref) => {
    return (
      <div className="space-y-1.5">
        <Label htmlFor={id} className="text-xs font-medium">
          {label}
        </Label>
        <div className="relative">
          <Icon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            id={id}
            ref={ref}
            className="pl-9 text-sm"
            {...inputProps}
          />
        </div>
        {error && <p className="text-[11px] text-destructive">{error}</p>}
      </div>
    );
  }
);

AuthInputGroup.displayName = "AuthInputGroup";
