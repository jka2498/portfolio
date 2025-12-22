import type { ReactNode } from "react";
import "../styles/console.css";


export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="aws-layout">
      <aside className="aws-sidebar">
        <h2>AWS</h2>
        <nav>
          <div className="nav-item active">Experiences</div>
          <div className="nav-item">Projects</div>
        </nav>
      </aside>

      <main className="aws-content">
        {children}
      </main>
    </div>
  );
}
