import { useEffect, useMemo, useState } from "react";
import type { Experience } from "../api/experiences";
import { fetchExperiences } from "../api/experiences";
import { STORAGE_UNITS } from "../data/storageUnits";

type SummaryCardProps = {
  label: string;
  value: string | number;
  helper?: string;
  placeholder?: boolean;
};

function SummaryCard({ label, value, helper, placeholder }: SummaryCardProps) {
  return (
    <div className="summary-card">
      <div className="summary-header">
        <span>{label}</span>
        {placeholder ? <span className="summary-tag">Placeholder</span> : null}
      </div>
      <div className="summary-value">{value}</div>
      {helper ? <div className="summary-helper">{helper}</div> : null}
    </div>
  );
}

export function Overview() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperiences()
      .then(setExperiences)
      .finally(() => setLoading(false));
  }, []);

  const { activeCount, archivedCount, latestLaunch, capabilityCount } = useMemo(() => {
    const normalized = experiences.map(exp => exp.state?.toLowerCase() ?? "");
    const latest = Math.max(...experiences.map(exp => exp.startYear ?? 0), 0);
    const roles = new Set(experiences.map(exp => exp.role).filter(Boolean));
    return {
      activeCount: normalized.filter(state => state === "active").length,
      archivedCount: normalized.filter(state => state === "archived").length,
      latestLaunch: latest || null,
      capabilityCount: roles.size,
    };
  }, [experiences]);

  const totalCount = experiences.length;
  const environmentStatus = loading ? "Evaluating" : "Stable";
  const storageCount = STORAGE_UNITS.length;

  return (
    <section className="overview">
      <div className="overview-header">
        <div>
          <h2>Control Plane</h2>
          <p>System overview of portfolio resources and operational health.</p>
        </div>
        <div className="overview-status">
          <span className="status-dot neutral" />
          {environmentStatus}
        </div>
      </div>

      <div className="summary-grid">
        <SummaryCard
          label="Active workloads"
          value={loading ? "—" : activeCount}
          helper="Experience entries in an active runtime state."
        />
        <SummaryCard
          label="Archived workloads"
          value={loading ? "—" : archivedCount}
          helper="Entries marked complete or inactive."
        />
        <SummaryCard
          label="Compute inventory"
          value={loading ? "—" : totalCount}
          helper="Total workload units tracked."
        />
        <SummaryCard
          label="Storage units"
          value={storageCount}
          helper="Project capacity currently indexed."
        />
        <SummaryCard
          label="Enabled capabilities"
          value={loading ? "—" : capabilityCount}
          helper="Distinct role capabilities detected."
        />
      </div>

      <div className="overview-panel">
        <div className="panel-title">System status</div>
        <div className="panel-body">
          <div className="panel-row">
            <span>Operational posture</span>
            <span className="panel-value">{environmentStatus}</span>
          </div>
          <div className="panel-row">
            <span>Lifecycle balance</span>
            <span className="panel-value">
              {loading ? "Evaluating" : `${activeCount} active / ${archivedCount} archived`}
            </span>
          </div>
          <div className="panel-row">
            <span>Most recent lifecycle event</span>
            <span className="panel-value">
              {loading
                ? "Evaluating"
                : latestLaunch
                ? `Launch year ${latestLaunch}`
                : "No recent updates"}
            </span>
          </div>
        </div>
      </div>

      <div className="overview-panel">
        <div className="panel-title">Resource lifecycle</div>
        <div className="panel-body">
          <div className="panel-row">
            <span>Newest workload launch</span>
            <span className="panel-value">
              {loading ? "Evaluating" : latestLaunch ?? "—"}
            </span>
          </div>
          <div className="panel-row">
            <span>Lifecycle coverage</span>
            <span className="panel-value">Complete</span>
          </div>
          <div className="panel-row">
            <span>Audit readiness</span>
            <span className="panel-value">On track</span>
          </div>
        </div>
      </div>
    </section>
  );
}
