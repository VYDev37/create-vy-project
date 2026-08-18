import type { Metadata } from "next";
import Link from "next/link";
import { BrandLogo } from "@/components/common/BrandLogo";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Register a new developer account to access your dashboard.",
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 sm:p-6 bg-muted/20">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center">
          <BrandLogo />
        </div>

        <Card className="border-border/60 shadow-lg">
          <CardHeader className="text-center space-y-1 pb-4">
            <CardTitle className="text-xl font-bold">Create Account</CardTitle>
            <CardDescription className="text-xs">
              Fill in your details to create your developer profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm redirectTo="/dashboard" />

            <div className="mt-6 text-center text-xs text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-primary hover:underline underline-offset-4"
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
