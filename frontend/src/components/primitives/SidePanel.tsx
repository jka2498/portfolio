import type { PropsWithChildren, ReactNode } from "react";
import { Card } from "./Card";

type SidePanelProps = PropsWithChildren<{
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
}>;

export function SidePanel({ title, subtitle, actions, children, className }: SidePanelProps) {
  return (
    <Card className={`flex h-full min-h-[260px] flex-col ${className ?? ""}`}>
      {(title || subtitle || actions) && (
        <div className="flex items-start justify-between gap-3 border-b border-console-border/60 px-4 pb-3 pt-3">
          <div className="space-y-1">
            {title ? <div className="text-console-base font-semibold">{title}</div> : null}
            {subtitle ? <div className="text-console-xs text-console-subtle">{subtitle}</div> : null}
          </div>
          {actions ? <div className="shrink-0">{actions}</div> : null}
        </div>
      )}
      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3 text-console-base text-console-emphasis">
        {children}
      </div>
    </Card>
  );
}
