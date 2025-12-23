import type { ReactNode } from "react";
import "../styles/console.css";


export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="console-layout">
      <aside className="console-sidebar">
        <div className="console-brand">
          <div className="brand-mark">CC</div>
          <div className="brand-text">
            <span className="brand-title">Cloud Console</span>
            <span className="brand-subtitle">Operations</span>
          </div>
        </div>
        <nav className="console-nav">
          <div className="nav-group">
            <div className="nav-section">Workspace</div>
            <button className="nav-item active" type="button">
              Control Plane
            </button>
            <button className="nav-item" type="button">
              Insights
            </button>
          </div>

          <div className="nav-group">
            <div className="nav-section">Resources</div>
            <button className="nav-item" type="button">
              Compute Units
            </button>
            <button className="nav-item" type="button">
              Storage
            </button>
            <button className="nav-item" type="button">
              Projects
            </button>
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
            <div className="topbar-title">Talent Management</div>
            <div className="topbar-subtitle">
              Centralized experience records and workforce visibility
            </div>
          </div>
          <div className="topbar-actions">
            <div className="access-indicator">Access: Read-only</div>
            <button className="button ghost" type="button" disabled>
              Export
            </button>
            <button className="button primary" type="button" disabled>
              New entry
            </button>
          </div>
        </header>

        <main className="console-content">{children}</main>
      </div>
    </div>
  );
}
