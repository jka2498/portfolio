import type { Project } from "../api/projects";
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
            <div className="detail-title">Project detail</div>
            <div className="detail-subtitle">Select an initiative to inspect.</div>
          </div>
        </div>
        <div className="detail-body">
          <div className="detail-placeholder">No project selected.</div>
        </div>
      </aside>
    );
  }

  const lifecycle = project.lifecycle ?? "Unknown";
  const createdYear = project.createdYear ?? "—";
  const summary =
    project.description ??
    "Platform initiative focused on reliable backend delivery and cloud operations.";

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
