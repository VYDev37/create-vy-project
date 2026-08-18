import { Link, useNavigate } from "react-router-dom";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { BrandLogo } from "@/components/common/BrandLogo";

export default function RegisterPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <BrandLogo />
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Create an account
          </h1>
          <p className="text-xs text-muted-foreground">
            Sign up to get started with the application
          </p>
        </div>

        <Card className="border-border/60 shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Register</CardTitle>
            <CardDescription className="text-xs">
              Enter your details below to register
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm onSuccess={() => navigate("/dashboard")} />
          </CardContent>
          <CardFooter className="border-t border-border/40 pt-4 flex justify-center text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline ml-1">
              Sign in
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
