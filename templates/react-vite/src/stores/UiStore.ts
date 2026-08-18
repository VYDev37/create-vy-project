import { create } from "zustand";

interface UiState {
  authModalOpen: boolean;
  authModalTab: "login" | "register";
  mobileMenuOpen: boolean;
  openAuthModal: (tab?: "login" | "register") => void;
  closeAuthModal: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  authModalOpen: false,
  authModalTab: "login",
  mobileMenuOpen: false,
  openAuthModal: (tab = "login") =>
    set({ authModalOpen: true, authModalTab: tab }),
  closeAuthModal: () => set({ authModalOpen: false }),
  setMobileMenuOpen: (mobileMenuOpen) => set({ mobileMenuOpen }),
  toggleMobileMenu: () =>
    set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
}));
