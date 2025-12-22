import { useEffect, useState } from "react";
import type { Experience } from "../api/experiences";
import { fetchExperiences } from "../api/experiences";

export function ExperiencesTable() {
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperiences()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading experiences...</div>;

  return (
    <>
      <h1>Experiences</h1>

      <table className="aws-table">
        <thead>
          <tr>
            <th>Role</th>
            <th>Company</th>
            <th>Start Year</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {items.map(exp => (
            <tr key={exp.id}>
              <td>{exp.role}</td>
              <td>{exp.company}</td>
              <td>{exp.startYear ?? "-"}</td>
              <td>{exp.state ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
