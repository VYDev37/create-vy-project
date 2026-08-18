import type { Metadata } from "next";
import Link from "next/link";
import { BrandLogo } from "@/components/common/BrandLogo";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Create Account | NextStack",
  description: "Create a new account with username, email, and password.",
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 sm:p-6 bg-muted/20">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center">
          <BrandLogo />
        </div>

        <Card className="border-border/60 shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold tracking-tight">
              Create Account
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Fill in the fields below to create a new user account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm />

            <div className="mt-6 text-center text-xs text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-foreground underline underline-offset-4 hover:text-primary transition-colors"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
