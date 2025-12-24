import { useEffect, useState } from "react";
import type { Project } from "../api/projects";
import { fetchProjects } from "../api/projects";
import { ProjectDetail } from "./ProjectDetail";
import { StatusPill } from "./StatusPill";

function formatTechnologies(technologies?: string[]) {
  if (!technologies || technologies.length === 0) {
    return "-";
  }
  const visible = technologies.slice(0, 2);
  const remaining = technologies.length - visible.length;
  if (remaining > 0) {
    return `${visible.join(", ")} +${remaining}`;
  }
  return visible.join(", ");
}

export function ProjectsTable() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects()
      .then(setProjects)
      .finally(() => setLoading(false));
  }, []);

  const activeCount = projects.filter(project => project.lifecycle === "ACTIVE").length;
  const latestYear = Math.max(
    ...projects.map(project => project.createdYear ?? 0),
    0
  );
  const selectedProject = projects.find(project => project.id === selectedId) ?? null;

  if (loading) {
    return (
      <div className="table-state">
        <div className="spinner" />
        Loading projects...
      </div>
    );
  }

  return (
    <>
      <section className="page-header">
        <div>
          <h1>Projects</h1>
          <p>Delivery initiatives and platforms led by Jan across cloud programs.</p>
        </div>
        <div className="page-meta">
          <div className="meta-card">
            <div className="meta-label">Total initiatives</div>
            <div className="meta-value">{projects.length}</div>
          </div>
          <div className="meta-card">
            <div className="meta-label">Active initiatives</div>
            <div className="meta-value">{activeCount}</div>
          </div>
          <div className="meta-card">
            <div className="meta-label">Latest launch</div>
            <div className="meta-value">{latestYear || "-"}</div>
          </div>
        </div>
      </section>

      <section className="table-card">
        <div className="table-toolbar">
          <div className="table-title">Project buckets</div>
          <div className="table-actions">
            <input
              className="table-search"
              placeholder="Search initiatives or regions"
              aria-label="Search project initiatives"
            />
            <button className="button ghost" type="button">
              Filters
            </button>
          </div>
        </div>

        <div className="table-layout">
          <table className="console-table dense">
            <thead>
              <tr>
                <th>Bucket</th>
                <th>Region</th>
                <th>Created year</th>
                <th>Status</th>
                <th>Technologies</th>
              </tr>
            </thead>
            <tbody>
              {projects.length > 0 ? (
                projects.map(project => {
                  const isSelected = project.id === selectedId;
                  return (
                    <tr
                      key={project.id}
                      className={`row-hover ${isSelected ? "row-selected" : ""}`}
                      onClick={() => setSelectedId(project.id)}
                      onKeyDown={event => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          setSelectedId(project.id);
                        }
                      }}
                      tabIndex={0}
                      aria-selected={isSelected}
                    >
                      <td>
                        <div className="bucket-cell">
                          <span className="bucket-icon" aria-hidden="true" />
                            <div>
                              <div className="primary-cell">{project.name}</div>
                              <div className="secondary-cell">Project ID: {project.id}</div>
                            </div>
                          </div>
                      </td>
                      <td>{project.region ?? "Global"}</td>
                      <td>{project.createdYear ?? "-"}</td>
                      <td>
                        <StatusPill state={project.lifecycle} />
                      </td>
                      <td className="muted-cell">
                        {formatTechnologies(project.technologies)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5}>
                    <div className="empty-state">
                      <div className="empty-title">No projects found</div>
                      <div className="empty-subtitle">
                        Add initiatives to highlight platforms and delivery wins.
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <ProjectDetail project={selectedProject} onClose={() => setSelectedId(null)} />
        </div>
      </section>
    </>
  );
}
