import type { PropsWithChildren } from "react";

export function Card({ children, className }: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={`rounded-panel border border-console-border/80 bg-console-panel/80 shadow-console ${
        className ?? ""
      }`}
    >
      {children}
    </div>
  );
}
