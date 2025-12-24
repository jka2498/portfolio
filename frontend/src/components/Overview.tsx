import { useEffect, useMemo, useState } from "react";
import type { Experience } from "../api/experiences";
import { fetchExperiences } from "../api/experiences";
import type { Project } from "../api/projects";
import { fetchProjects } from "../api/projects";

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
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOverview = async () => {
      try {
        const [experienceItems, projectItems] = await Promise.all([
          fetchExperiences(),
          fetchProjects(),
        ]);
        setExperiences(experienceItems);
        setProjects(projectItems);
      } catch (error) {
        console.error("Failed to load overview data.", error);
      } finally {
        setLoading(false);
      }
    };

    void loadOverview();
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
  const projectCount = projects.length;
  const environmentStatus = loading ? "Evaluating" : "Stable";

  return (
    <section className="overview">
      <div className="overview-header">
        <div>
          <h2>Control Plane</h2>
          <p>Career operations view for Jan Andrzejczyk.</p>
        </div>
        <div className="overview-status">
          <span className="status-dot neutral" />
          {environmentStatus}
        </div>
      </div>

      <div className="summary-grid">
        <SummaryCard
          label="Active roles"
          value={loading ? "—" : activeCount}
          helper="Roles currently marked as active."
        />
        <SummaryCard
          label="Archived roles"
          value={loading ? "—" : archivedCount}
          helper="Past roles marked as archived."
        />
        <SummaryCard
          label="Role inventory"
          value={loading ? "—" : totalCount}
          helper="Total roles across the timeline."
        />
        <SummaryCard
          label="Project initiatives"
          value={loading ? "—" : projectCount}
          helper="Platforms and systems delivered."
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
            <span>Portfolio posture</span>
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
        <div className="panel-title">Delivery cadence</div>
        <div className="panel-body">
          <div className="panel-row">
            <span>Newest role start</span>
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
