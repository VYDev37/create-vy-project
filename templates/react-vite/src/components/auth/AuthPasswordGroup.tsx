import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff } from "lucide-react";

export interface AuthPasswordGroupProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  hint?: string;
  error?: string;
}

export const AuthPasswordGroup = React.forwardRef<HTMLInputElement, AuthPasswordGroupProps>(
  ({ id, label, hint, error, ...inputProps }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor={id} className="text-xs font-medium">
            {label}
          </Label>
          {hint && <span className="text-[11px] text-muted-foreground">{hint}</span>}
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            id={id}
            ref={ref}
            type={showPassword ? "text" : "password"}
            className="pl-9 pr-9 text-sm"
            {...inputProps}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground focus:outline-none transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {error && <p className="text-[11px] text-destructive">{error}</p>}
      </div>
    );
  }
);

AuthPasswordGroup.displayName = "AuthPasswordGroup";
