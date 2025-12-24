import { useState, type ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { fetchCvDownloadUrl } from "../api/cv";
import "../styles/console.css";

const OWNER_NAME = "Jan Andrzejczyk";
const OWNER_ROLE = "Backend & Cloud Engineer";
const LINKEDIN_URL = "https://www.linkedin.com/in/janandrzejczyk";

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
          <div className="brand-mark" aria-hidden="true">CC</div>
          <div className="brand-text">
            <span className="brand-title">Control Console</span>
            <span className="brand-subtitle">Personal workspace</span>
          </div>
        </div>
        <nav className="console-nav">
          <div className="nav-group">
            <div className="nav-section">Workspace</div>
            <NavLink
              className={({ isActive }) => `nav-item tier-primary${isActive ? " active" : ""}`}
              to="/"
              end
            >
              <span className="nav-icon" aria-hidden="true">▦</span>
              Control Plane
            </NavLink>
            <button className="nav-item tier-primary" type="button">
              <span className="nav-icon" aria-hidden="true">◌</span>
              Workspace Pulse
            </button>
          </div>

          <div className="nav-group">
            <div className="nav-section">Operations</div>
            <button className="nav-item tier-secondary" type="button">
              <span className="nav-icon" aria-hidden="true">▣</span>
              Compute Instances
            </button>
            <NavLink
              className={({ isActive }) => `nav-item tier-secondary${isActive ? " active" : ""}`}
              to="/projects"
            >
              <span className="nav-icon" aria-hidden="true">⬚</span>
              Service Inventory
            </NavLink>
          </div>

          <div className="nav-group">
            <div className="nav-section">Administration</div>
            <button className="nav-item tier-tertiary" type="button">
              <span className="nav-icon" aria-hidden="true">⬒</span>
              Access Control
            </button>
            <button className="nav-item tier-tertiary" type="button">
              <span className="nav-icon" aria-hidden="true">☷</span>
              Audit Logs
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
            <a
              className="button ghost linked-in"
              href={LINKEDIN_URL}
              target="_blank"
              rel="noreferrer noopener"
            >
              <span className="icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <path
                    d="M6 9.5V18H3V9.5h3zm.25-3A1.73 1.73 0 0 1 4.5 8.25 1.74 1.74 0 0 1 2.75 6.5 1.74 1.74 0 0 1 4.5 4.75 1.74 1.74 0 0 1 6.25 6.5zM21 18h-3v-4.5c0-1.2-.7-1.5-1.2-1.5-.6 0-1.3.5-1.3 1.5V18h-3V9.5h3v1.2c.4-.7 1.3-1.2 2.3-1.2 1.5 0 3.2.9 3.2 3.6z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              LinkedIn
            </a>
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
