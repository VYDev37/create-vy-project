export type { User, UserRole, UserProfileUpdate } from "@/schemas/UserSchema";
export type { LoginInput, RegisterInput, SessionData } from "@/schemas/AuthSchema";

// Generic UI and API envelopes
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface NavItem {
  label: string;
  href: string;
  isExternal?: boolean;
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  category: string;
  tag?: string;
}
