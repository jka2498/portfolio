import type { Project } from "../api/projects";
import { describeServiceType } from "../api/projects";
import { StatusPill } from "./StatusPill";

type ProjectDetailProps = {
  project: Project | null;
  onClose: () => void;
};

function formatTechnologies(tech?: string[]) {
  if (!tech || tech.length === 0) {
    return ["Unspecified"];
  }
  return tech;
}

export function ProjectDetail({ project, onClose }: ProjectDetailProps) {
  if (!project) {
    return (
      <aside className="detail-panel empty">
        <div className="detail-header">
          <div>
            <div className="detail-title">Service detail</div>
            <div className="detail-subtitle">Select a provisioned unit to inspect.</div>
          </div>
        </div>
        <div className="detail-body">
          <div className="detail-placeholder">No service selected.</div>
        </div>
      </aside>
    );
  }

  const lifecycle = project.lifecycle ?? "Unknown";
  const createdYear = project.createdYear ?? "—";
  const service = describeServiceType(project.serviceType);
  const summary = project.description ?? "No description provided.";

  return (
    <aside className="detail-panel">
      <div className="detail-header">
        <div>
          <div className="detail-title">{project.name}</div>
          <div className="detail-subtitle">{project.organization ?? "Portfolio bucket"}</div>
        </div>
        <button className="button ghost detail-close" type="button" onClick={onClose}>
          Close
        </button>
      </div>
      <div className="detail-body">
        <div className="detail-section">
          <div className="detail-label">Lifecycle</div>
          <StatusPill state={lifecycle} />
        </div>
        <div className="detail-section">
          <div className="detail-label">Service</div>
          <div className="detail-value">{service.label}</div>
        </div>
        <div className="detail-section">
          <div className="detail-label">Region</div>
          <div className="detail-value">{project.region ?? "Global"}</div>
        </div>
        <div className="detail-section">
          <div className="detail-label">Created year</div>
          <div className="detail-value">{createdYear}</div>
        </div>
        <div className="detail-section">
          <div className="detail-label">Summary</div>
          <div className="detail-value">{summary}</div>
        </div>
        <div className="detail-section">
          <div className="detail-label">Technologies</div>
          <div className="detail-tags">
            {formatTechnologies(project.technologies).map(tech => (
              <span key={tech} className="detail-pill">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
