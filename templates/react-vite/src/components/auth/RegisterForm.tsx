import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema, type RegisterInput } from "@/schemas/AuthSchema";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { AuthErrorAlert } from "./AuthErrorAlert";
import { AuthInputGroup } from "./AuthInputGroup";
import { AuthPasswordGroup } from "./AuthPasswordGroup";
import { AtSign, Loader2, Mail, User as UserIcon } from "lucide-react";

interface RegisterFormProps {
  onSuccess?: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const { register: registerAuth } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    setServerError(null);
    try {
      await registerAuth(data);
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : "Registration failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <AuthErrorAlert message={serverError} />

      <AuthInputGroup
        id="reg-name"
        label="Full name"
        icon={UserIcon}
        placeholder="Alex Developer"
        error={errors.name?.message}
        {...register("name")}
      />

      <AuthInputGroup
        id="reg-username"
        label="Username"
        icon={AtSign}
        autoComplete="username"
        placeholder="alexdev"
        error={errors.username?.message}
        {...register("username")}
      />

      <AuthInputGroup
        id="reg-email"
        type="email"
        label="Email address"
        icon={Mail}
        autoComplete="email"
        placeholder="alex@example.com"
        error={errors.email?.message}
        {...register("email")}
      />

      <AuthPasswordGroup
        id="reg-password"
        label="Password"
        autoComplete="new-password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register("password")}
      />

      <AuthPasswordGroup
        id="reg-confirm"
        label="Confirm password"
        autoComplete="new-password"
        placeholder="••••••••"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-10 font-medium text-sm transition-all active:scale-[0.99] mt-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Account...
          </>
        ) : (
          "Create Account"
        )}
      </Button>
    </form>
  );
}
