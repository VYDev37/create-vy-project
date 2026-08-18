import { useState } from "react";
import { Check, Copy, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

type PackageManager = "pnpm" | "npm" | "bun" | "yarn";

const COMMANDS: Record<PackageManager, string> = {
  pnpm: "pnpm dlx create-vy-project my-app",
  npm: "npx create-vy-project my-app",
  bun: "bunx create-vy-project my-app",
  yarn: "yarn dlx create-vy-project my-app",
};

export function InstallSnippet({ className }: { className?: string }) {
  const [activePm, setActivePm] = useState<PackageManager>("pnpm");
  const [copied, setCopied] = useState(false);

  const command = COMMANDS[activePm];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-border/70 bg-card/90 shadow-md backdrop-blur-md overflow-hidden",
        className
      )}
    >
      {/* Top PM Tabs */}
      <div className="flex items-center justify-between border-b border-border/50 bg-muted/40 px-3 py-1.5">
        <div className="flex items-center gap-1">
          <Terminal className="h-3.5 w-3.5 text-muted-foreground mr-1.5" />
          {(["pnpm", "npm", "bun", "yarn"] as PackageManager[]).map((pm) => (
            <button
              key={pm}
              onClick={() => setActivePm(pm)}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-mono font-medium transition-colors cursor-pointer",
                activePm === pm
                  ? "bg-background text-foreground shadow-xs border border-border/50"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              )}
            >
              {pm}
            </button>
          ))}
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
          title="Copy command to clipboard"
          aria-label="Copy installation command"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-emerald-500 font-sans">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span className="font-sans">Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Command prompt body */}
      <div className="flex items-center justify-between px-4 py-3 font-mono text-xs sm:text-sm">
        <div className="flex items-center gap-2 overflow-x-auto select-all">
          <span className="text-primary select-none font-bold">$</span>
          <span className="text-foreground">{command}</span>
        </div>
      </div>
    </div>
  );
}
