import { useEffect, useState } from "react";
import type { Experience } from "../api/experiences";
import { fetchExperiences } from "../api/experiences";
import { ComputeUnitDetail } from "./ComputeUnitDetail";
import { StatusPill } from "./StatusPill";

export function ExperiencesTable() {
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    fetchExperiences()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  const activeCount = items.filter(exp => exp.state?.toLowerCase() === "active").length;
  const latestYear = Math.max(
    ...items.map(exp => exp.startYear ?? 0),
    0
  );
  const hasItems = items.length > 0;
  const selectedUnit = items.find(exp => exp.id === selectedId) ?? null;

  if (loading) {
    return (
      <div className="table-state">
        <div className="spinner" />
        Loading experiences...
      </div>
    );
  }

  return (
    <>
      <section className="page-header">
        <div>
          <h1>Experience</h1>
          <p>Roles and responsibilities across Jan's backend and cloud journey.</p>
        </div>
        <div className="page-meta">
          <div className="meta-card">
            <div className="meta-label">Total roles</div>
            <div className="meta-value">{items.length}</div>
          </div>
          <div className="meta-card">
            <div className="meta-label">Active roles</div>
            <div className="meta-value">{activeCount}</div>
          </div>
          <div className="meta-card">
            <div className="meta-label">Latest start</div>
            <div className="meta-value">{latestYear || "-"}</div>
          </div>
        </div>
      </section>

      <section className="table-card">
        <div className="table-toolbar">
          <div className="table-title">Career timeline</div>
          <div className="table-actions">
            <input
              className="table-search"
              placeholder="Search roles or companies"
              aria-label="Search experience entries"
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
                <th>Name</th>
                <th>Company</th>
                <th>Start year</th>
                <th>Status</th>
                <th>Focus</th>
              </tr>
            </thead>
            <tbody>
              {hasItems ? (
                items.map(exp => {
                  const isSelected = exp.id === selectedId;
                  return (
                    <tr
                      key={exp.id}
                      className={`row-hover ${isSelected ? "row-selected" : ""}`}
                      onClick={() => setSelectedId(exp.id)}
                      onKeyDown={event => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          setSelectedId(exp.id);
                        }
                      }}
                      tabIndex={0}
                      aria-selected={isSelected}
                    >
                      <td>
                        <div className="primary-cell">{exp.role}</div>
                        <div className="secondary-cell">Experience ID: {exp.id}</div>
                      </td>
                      <td>{exp.company}</td>
                      <td>{exp.startYear ?? "-"}</td>
                      <td>
                        <StatusPill state={exp.state} />
                      </td>
                      <td className="muted-cell">
                        {exp.company ? "Backend platforms" : "Independent delivery"}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5}>
                    <div className="empty-state">
                      <div className="empty-title">No experience records found</div>
                      <div className="empty-subtitle">
                        Add experiences to highlight backend and cloud leadership.
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <ComputeUnitDetail
            unit={selectedUnit}
            onClose={() => setSelectedId(null)}
          />
        </div>
      </section>
    </>
  );
}
