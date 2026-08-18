import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { useUiStore } from "@/stores/UiStore";

export function AuthModal() {
  const navigate = useNavigate();
  const { authModalOpen, authModalTab, closeAuthModal, openAuthModal } =
    useUiStore();

  const handleSuccess = () => {
    closeAuthModal();
    navigate("/dashboard");
  };

  return (
    <Dialog
      open={authModalOpen}
      onOpenChange={(open) => {
        if (!open) closeAuthModal();
      }}
    >
      <DialogContent className="sm:max-w-[440px] p-6">
        <DialogHeader className="mb-2 text-center">
          <DialogTitle className="text-xl font-bold tracking-tight">
            {authModalTab === "login" ? "Welcome Back" : "Create Account"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {authModalTab === "login"
              ? "Sign in to access your developer dashboard"
              : "Fill in your details to create your developer profile"}
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={authModalTab}
          onValueChange={(val) => openAuthModal(val as "login" | "register")}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login">Sign In</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <LoginForm
              onSuccess={handleSuccess}
              onSwitchToRegister={() => openAuthModal("register")}
            />
          </TabsContent>

          <TabsContent value="register">
            <RegisterForm
              onSuccess={handleSuccess}
              onSwitchToLogin={() => openAuthModal("login")}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
