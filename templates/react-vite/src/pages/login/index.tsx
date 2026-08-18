import { Link, useNavigate } from "react-router-dom";
import { LoginForm } from "@/components/auth/LoginForm";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { BrandLogo } from "@/components/common/BrandLogo";

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <BrandLogo />
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Sign in to your account
          </h1>
          <p className="text-xs text-muted-foreground">
            Enter your credentials to access the application
          </p>
        </div>

        <Card className="border-border/60 shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Login</CardTitle>
            <CardDescription className="text-xs">
              Demo account available: demodev / Password123!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm onSuccess={() => navigate("/dashboard")} />
          </CardContent>
          <CardFooter className="border-t border-border/40 pt-4 flex justify-center text-xs text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-primary font-medium hover:underline ml-1">
              Create an account
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
