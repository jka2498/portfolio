import { useState, type ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { fetchCvDownloadUrl } from "../api/cv";
import "../styles/console.css";

const OWNER_NAME = "Jan Andrzejczyk";
const OWNER_ROLE = "Backend & Cloud Engineer";

export function Layout({ children }: { children: ReactNode }) {
  const [downloading, setDownloading] = useState(false);

  const handleDownloadCv = async () => {
    try {
      setDownloading(true);
      const url = await fetchCvDownloadUrl();
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Failed to download CV.", error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="console-layout">
      <aside className="console-sidebar">
        <div className="console-brand">
          <div className="brand-mark">CC</div>
          <div className="brand-text">
            <span className="brand-title">{OWNER_NAME}</span>
            <span className="brand-subtitle">{OWNER_ROLE}</span>
          </div>
        </div>
        <nav className="console-nav">
          <div className="nav-group">
            <div className="nav-section">Workspace</div>
            <NavLink
              className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}
              to="/"
              end
            >
              Control Plane
            </NavLink>
            <button className="nav-item" type="button">
              Insights
            </button>
          </div>

          <div className="nav-group">
            <div className="nav-section">Resources</div>
            <button className="nav-item" type="button">
              Experience
            </button>
            <button className="nav-item" type="button">
              Storage
            </button>
            <NavLink
              className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}
              to="/projects"
            >
              Projects
            </NavLink>
          </div>

          <div className="nav-group">
            <div className="nav-section">Administration</div>
            <button className="nav-item" type="button">
              Access control
            </button>
            <button className="nav-item" type="button">
              Audit logs
            </button>
          </div>
        </nav>
        <div className="sidebar-footer">
          <div className="status-indicator">
            <span className="status-dot" />
            All systems nominal
          </div>
          <div className="user-card">
            <div className="user-avatar">OP</div>
            <div>
              <div className="user-name">Operator</div>
              <div className="user-role">Workspace admin</div>
            </div>
          </div>
        </div>
      </aside>

      <div className="console-main">
        <header className="console-topbar">
          <div>
            <div className="topbar-title">{OWNER_NAME}</div>
            <div className="topbar-subtitle">
              {OWNER_ROLE}
            </div>
          </div>
          <div className="topbar-actions">
            <div className="access-indicator">Access: Read-only</div>
            <button className="button ghost" type="button" disabled>
              Export
            </button>
            <button
              className="button primary"
              type="button"
              onClick={handleDownloadCv}
              disabled={downloading}
            >
              {downloading ? "Preparing CV…" : "Download CV"}
            </button>
          </div>
        </header>

        <main className="console-content">{children}</main>
      </div>
    </div>
  );
}
