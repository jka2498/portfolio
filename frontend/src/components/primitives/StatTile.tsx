import type { PropsWithChildren, ReactNode } from "react";
import { Card } from "./Card";

type StatTileProps = PropsWithChildren<{
  label: string;
  value: ReactNode;
  helper?: ReactNode;
  tone?: "compute" | "services" | "meta";
  className?: string;
  placeholder?: boolean;
}>;

const toneStyles: Record<NonNullable<StatTileProps["tone"]>, string> = {
  compute: "text-console-accent",
  services: "text-console-accentAlt",
  meta: "text-console-emphasis",
};

export function StatTile({
  label,
  value,
  helper,
  tone,
  className,
  placeholder,
  children,
}: StatTileProps) {
  const accent = tone ? toneStyles[tone] : "text-console-emphasis";

  return (
    <Card className={`p-3 sm:p-4 ${className ?? ""}`}>
      <div className="mb-2 flex items-center gap-2 text-console-xs uppercase tracking-[0.1em] text-console-muted">
        <span>{label}</span>
        {placeholder ? (
          <span className="rounded-full border border-console-border px-2 py-0.5 text-[0.65rem] text-console-subtle">
            Placeholder
          </span>
        ) : null}
      </div>
      <div className={`text-console-lg font-semibold ${accent}`}>{value}</div>
      {helper ? (
        <div className="mt-1 text-console-sm text-console-subtle">{helper}</div>
      ) : null}
      {children}
    </Card>
  );
}
