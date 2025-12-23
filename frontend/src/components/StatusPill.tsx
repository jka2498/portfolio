type LifecycleState = "active" | "archived" | "pending" | "unknown";

type StatusPillProps = {
  state?: string | null;
};

const STATE_ALIASES: Record<string, LifecycleState> = {
  active: "active",
  running: "active",
  current: "active",
  completed: "archived",
  inactive: "archived",
  archived: "archived",
  planned: "pending",
  pending: "pending",
};

function normalizeState(state?: string | null): LifecycleState {
  if (!state) {
    return "unknown";
  }
  return STATE_ALIASES[state.toLowerCase()] ?? "unknown";
}

const STATE_LABELS: Record<LifecycleState, string> = {
  active: "Active",
  archived: "Archived",
  pending: "Pending",
  unknown: "Unknown",
};

export function StatusPill({ state }: StatusPillProps) {
  const normalized = normalizeState(state);
  return (
    <span className={`status-pill status-${normalized}`}>
      {STATE_LABELS[normalized]}
    </span>
  );
}
