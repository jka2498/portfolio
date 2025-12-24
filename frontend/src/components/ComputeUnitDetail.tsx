import type { Experience } from "../api/experiences";
import { StatusPill } from "./StatusPill";

type ComputeUnitDetailProps = {
  unit: Experience | null;
  onClose: () => void;
};

const DOMAIN_TAGS = [
  { match: "engineer", label: "Engineering" },
  { match: "developer", label: "Software delivery" },
  { match: "design", label: "Design systems" },
  { match: "data", label: "Data platforms" },
  { match: "manager", label: "Operations" },
  { match: "lead", label: "Program oversight" },
];

function getDomains(unit: Experience): string[] {
  const combined = `${unit.role} ${unit.company}`.toLowerCase();
  const matches = DOMAIN_TAGS.filter(tag => combined.includes(tag.match)).map(
    tag => tag.label
  );

  return matches.length ? matches : ["General operations"];
}

export function ComputeUnitDetail({ unit, onClose }: ComputeUnitDetailProps) {
  if (!unit) {
    return (
      <aside className="detail-panel empty">
        <div className="detail-header">
          <div>
            <div className="detail-title">Compute detail</div>
            <div className="detail-subtitle">Select a runtime instance to inspect.</div>
          </div>
        </div>
        <div className="detail-body">
          <div className="detail-placeholder">
            No compute instance selected.
          </div>
        </div>
      </aside>
    );
  }

  const runtimeState = unit.state ?? "Unknown";
  const launchYear = unit.startYear ?? "—";
  const description = unit.description ?? "No description provided.";

  return (
    <aside className="detail-panel">
      <div className="detail-header">
        <div>
          <div className="detail-title">{unit.role}</div>
          <div className="detail-subtitle">{unit.company}</div>
        </div>
        <button className="button ghost detail-close" type="button" onClick={onClose}>
          Close
        </button>
      </div>
      <div className="detail-body">
        <div className="detail-section">
          <div className="detail-label">Engagement state</div>
          <StatusPill state={runtimeState} />
        </div>
        <div className="detail-section">
          <div className="detail-label">Start year</div>
          <div className="detail-value">{launchYear}</div>
        </div>
        <div className="detail-section">
          <div className="detail-label">Summary</div>
          <div className="detail-value">{description}</div>
        </div>
        <div className="detail-section">
          <div className="detail-label">Focus</div>
          <div className="detail-value">{unit.focus ?? "—"}</div>
        </div>
        <div className="detail-section">
          <div className="detail-label">Domains</div>
          <div className="detail-tags">
            {getDomains(unit).map(domain => (
              <span key={domain} className="detail-pill">
                {domain}
              </span>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
