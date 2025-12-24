import { STORAGE_UNITS } from "../data/storageUnits";
import { StatusPill } from "./StatusPill";

export function Storage() {
  const hasUnits = STORAGE_UNITS.length > 0;

  return (
    <section className="storage">
      <div className="page-header">
        <div>
          <h1>Storage</h1>
          <p>Operational archives curated from Jan's cloud programs.</p>
        </div>
      </div>

      <section className="table-card">
        <div className="table-toolbar">
          <div className="table-title">Operational archives</div>
          <div className="table-actions">
            <input
              className="table-search"
              placeholder="Search archives or types"
              aria-label="Search storage archives"
            />
            <button className="button ghost" type="button">
              Filters
            </button>
          </div>
        </div>

        <table className="console-table dense">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Scope</th>
              <th>Lifecycle state</th>
              <th>Access level</th>
              <th>Last updated</th>
            </tr>
          </thead>
          <tbody>
            {hasUnits ? (
              STORAGE_UNITS.map(unit => {
                const accessKey = unit.accessLevel.toLowerCase();
                return (
                  <tr key={unit.id} className="row-hover">
                    <td>
                      <div className="primary-cell">{unit.name}</div>
                      <div className="secondary-cell">Unit ID: {unit.id}</div>
                    </td>
                    <td>{unit.type}</td>
                    <td>{unit.scope}</td>
                    <td>
                      <StatusPill state={unit.lifecycleState} />
                    </td>
                    <td>
                      <span className={`tag-pill tag-${accessKey}`}>
                        {unit.accessLevel}
                      </span>
                    </td>
                    <td className="muted-cell">{unit.lastUpdated}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6}>
                  <div className="empty-state">
                    <div className="empty-title">No storage units available</div>
                    <div className="empty-subtitle">
                      Add a project to begin tracking persistent outputs.
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </section>
  );
}
