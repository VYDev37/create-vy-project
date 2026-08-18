# Frontend Developer Guide & Best Practices

Expert standards for building accessible, maintainable, and high-performance user interfaces in React, Next.js, and TypeScript.

---

## 1. Core Principles

- **Component Single Responsibility**: A component should focus on doing one thing well (UI presentation, data fetching, or state orchestration).
- **Props Down, Events Up**: Pass clean data down to child components via typed props; notify parent components of changes via explicit callback handlers (`onSuccess`, `onChange`, `onSelect`).
- **Composition Over Inheritance**: Use compound component patterns and children slots rather than rigid configuration props.
- **File Length Limit (< 200 Lines)**: Keep files focused. If a component exceeds 200 lines, extract subcomponents into dedicated files in the same or local feature directory.

---

## 2. Component Design & Hierarchy

### Component Types
| Type | Role | State Allowed? | Example |
|---|---|---|---|
| **Server Component** | SSR, data fetching, route protection | None (stateless on client) | `page.tsx`, `layout.tsx` |
| **Container / Colocated Client** | Hooks, state orchestration, layout wiring | Yes (`useState`, stores) | `DashboardClient.tsx` |
| **Presentational Component** | Visual rendering, styling | Props only (rare local UI state) | `BrandLogo.tsx`, `CurrencyCard.tsx` |
| **UI Primitive** | Reusable design system element | Unstyled / accessible state | `button.tsx`, `dialog.tsx` |

### Props Interface Naming Convention
Always suffix props interface with `Props` using `PascalCase`:

```typescript
interface CurrencyCardProps {
  code: string;
  rate: number;
  symbol: string;
  flag: string;
  onSelect?: (code: string) => void;
}

export function CurrencyCard({ code, rate, symbol, flag, onSelect }: CurrencyCardProps) {
  return (
    <div onClick={() => onSelect?.(code)} className="p-4 rounded-lg border">
      <span>{flag} {code}</span>
      <p>{symbol} {rate.toFixed(2)}</p>
    </div>
  );
}
```

---

## 3. Accessibility & UX Quality (WCAG 2.1 AA)

- **Semantic HTML**: Use proper elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<button>`, `<a>`) rather than clickable `<div>` elements.
- **Focus & Keyboard Navigation**: Ensure interactive elements have visible `:focus-visible` rings and support `Enter` / `Space` keyboard activation.
- **Contrast**: Maintain minimum 4.5:1 text contrast ratio in both dark and light modes.
- **Aria Labels**: Provide descriptive `aria-label` for icon-only buttons (e.g. theme toggle, mobile menu drawer button).

---

## 4. Re-render Optimization & Clean State

- **Atomic Selectors in Zustand**: Never call `const { a, b, c } = useStore()`. Always extract only the needed slice (`useStore((state) => state.a)`).
- **Avoid Premature Optimization**: Do not wrap every small function in `useCallback` or `useMemo` unless profiling shows unnecessary child re-renders.
- **Derived State**: Compute values on the fly during render rather than syncing them to extra `useState` and `useEffect`.

---

## 5. Type Safety & Single Source of Truth

- **Derive Types from Zod**: Never write loose duplicate TypeScript interfaces for API models. Always infer with `z.infer<typeof Schema>`.
- **Forwarding Refs for Form Inputs**: Custom input controls connected to React Hook Form must forward refs using `React.forwardRef`:
  ```typescript
  export const InputField = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, ...props }, ref) => (
      <div className="space-y-1">
        <label>{label}</label>
        <input ref={ref} {...props} />
        {error && <span className="text-destructive text-xs">{error}</span>}
      </div>
    )
  );
  InputField.displayName = "InputField";
  ```
