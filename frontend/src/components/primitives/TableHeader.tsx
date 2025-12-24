import type { PropsWithChildren } from "react";

type TableHeaderProps = PropsWithChildren<{
  title: string;
  helper?: string;
  className?: string;
}>;

export function TableHeader({ title, helper, children, className }: TableHeaderProps) {
  return (
    <div
      className={`flex flex-col gap-2 border-b border-console-border/60 pb-3 sm:flex-row sm:items-center sm:justify-between ${
        className ?? ""
      }`}
    >
      <div className="space-y-1">
        <div className="text-console-sm font-semibold text-console-emphasis">{title}</div>
        {helper ? <div className="text-console-xs text-console-subtle">{helper}</div> : null}
      </div>
      {children ? <div className="flex flex-wrap items-center gap-2">{children}</div> : null}
    </div>
  );
}
