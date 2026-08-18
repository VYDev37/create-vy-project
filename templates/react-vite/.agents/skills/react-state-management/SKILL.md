---
name: react-state-management
description: "React state management patterns including Zustand stores, React Hook Form with Zod, and atomic selectors."
category: granular-workflow-bundle
risk: safe
source: personal
date_added: "2026-02-27"
---

# React State Management Guide & Patterns

Comprehensive guidelines for managing state across modern React applications with clarity, type safety, and minimal re-renders.

## 1. State Classification Matrix

| State Type | Scope | Recommended Tool | Example |
|---|---|---|---|
| **Local / Component** | Single component | `useState`, `useReducer` | Form inputs, dropdown toggles, modal open state |
| **Shared / Subtree** | Parent & immediate children | Props or React Context | Compound components (Tabs, Accordions) |
| **Global Client State** | Cross-route app state | **Zustand v5** | Auth session, theme preferences, global notifications |
| **Form State** | Form inputs & validation | **React Hook Form + Zod** | Login, Registration, multi-step wizards |
| **URL State** | Shareable filters / pagination | React Router `useSearchParams` | Table pagination, search queries, active tabs |

## 2. Zustand Best Practices (Global State)

### Store Definition Pattern (PascalCase File Naming)
Always separate state interface, action interface, and use strict type inference:

```typescript
// stores/AuthStore.ts
import { create } from "zustand";
import type { User } from "@/schemas/UserSchema";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: () => set({ user: null, isAuthenticated: false, isLoading: false }),
}));
```

### Atomic Selectors (Avoid Re-Render Traps)
Always select specific state properties instead of destructuring the whole store:

```typescript
// ✅ Good: Component only re-renders when `user` changes
const user = useAuthStore((state) => state.user);

// ❌ Avoid: Re-renders on ANY store update
const { user, isLoading, logout } = useAuthStore();
```

## 3. Form State with React Hook Form & Zod

Do not store controlled form inputs in global Zustand stores. Use `react-hook-form` paired with `@hookform/resolvers/zod`:

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, type LoginInput } from "@/schemas/AuthSchema";

export function LoginForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { identifier: "", password: "" },
  });

  const onSubmit = async (data: LoginInput) => {
    // Process form
  };

  return <form onSubmit={handleSubmit(onSubmit)}>...</form>;
}
```

## 4. Anti-Patterns to Avoid
- ❌ **No God Stores**: Do not create a single giant store. Create focused stores (`AuthStore.ts`, `UiStore.ts`).
- ❌ **No Prop Drilling Beyond 2 Levels**: If passing props down more than 2-3 levels without intermediate consumption, use a lightweight store.
