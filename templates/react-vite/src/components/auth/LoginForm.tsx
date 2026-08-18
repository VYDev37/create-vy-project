import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, type LoginInput } from "@/schemas/AuthSchema";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { AuthErrorAlert } from "./AuthErrorAlert";
import { AuthInputGroup } from "./AuthInputGroup";
import { AuthPasswordGroup } from "./AuthPasswordGroup";
import { Loader2, User as UserIcon } from "lucide-react";

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
}

export function LoginForm({ onSuccess, onSwitchToRegister }: LoginFormProps) {
  const { login } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setServerError(null);
    try {
      await login(data);
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : "Invalid credentials. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <AuthErrorAlert message={serverError} />

      <AuthInputGroup
        id="login-identifier"
        label="Username or Email"
        icon={UserIcon}
        autoComplete="username"
        placeholder="demodev or demo@example.com"
        error={errors.identifier?.message}
        {...register("identifier")}
      />

      <AuthPasswordGroup
        id="login-password"
        label="Password"
        hint="Demo: Password123!"
        autoComplete="current-password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register("password")}
      />

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-10 font-medium text-sm transition-all active:scale-[0.99] cursor-pointer"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing In...
          </>
        ) : (
          "Sign In"
        )}
      </Button>

      {onSwitchToRegister && (
        <div className="text-center text-xs text-muted-foreground pt-1">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="font-medium text-primary hover:underline underline-offset-4 cursor-pointer"
          >
            Sign up
          </button>
        </div>
      )}
    </form>
  );
}
