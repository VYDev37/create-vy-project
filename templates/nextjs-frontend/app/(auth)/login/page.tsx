import type { Metadata } from "next";
import Link from "next/link";
import { BrandLogo } from "@/components/common/BrandLogo";
import { LoginForm } from "@/components/auth/LoginForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in with your username or email and password.",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 sm:p-6 bg-muted/20">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center">
          <BrandLogo />
        </div>

        <Card className="border-border/60 shadow-lg">
          <CardHeader className="text-center space-y-1 pb-4">
            <CardTitle className="text-xl font-bold">Welcome Back</CardTitle>
            <CardDescription className="text-xs">
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm redirectTo="/dashboard" />

            <div className="mt-6 text-center text-xs text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-primary hover:underline underline-offset-4"
              >
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
