interface AuthErrorAlertProps {
  message: string | null;
}

export function AuthErrorAlert({ message }: AuthErrorAlertProps) {
  if (!message) return null;

  return (
    <div className="rounded-lg bg-destructive/10 p-3 text-xs text-destructive font-medium border border-destructive/20 animate-in fade-in-50 duration-200">
      {message}
    </div>
  );
}
