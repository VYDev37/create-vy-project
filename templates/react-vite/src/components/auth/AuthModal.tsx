import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { useUiStore } from "@/stores/UiStore";

export function AuthModal() {
  const { authModalOpen, authModalTab, closeAuthModal, openAuthModal } =
    useUiStore();

  return (
    <Dialog open={authModalOpen} onOpenChange={(open) => !open && closeAuthModal()}>
      <DialogContent className="sm:max-w-[425px] p-6">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-xl font-bold tracking-tight text-center">
            {authModalTab === "login" ? "Welcome Back" : "Create Account"}
          </DialogTitle>
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
            <LoginForm onSuccess={closeAuthModal} />
          </TabsContent>

          <TabsContent value="register">
            <RegisterForm onSuccess={closeAuthModal} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
