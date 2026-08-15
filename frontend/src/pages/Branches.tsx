import { useApi } from "../hooks/useApi";
import { api } from "../api/client";

export function Branches() {
  const { data: branches, loading, error } = useApi(() => api.branches(), []);

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Филиалы</span>
          <h1>5 залов в Санкт-Петербурге</h1>
          <p>Выбирайте зал, который удобнее по дороге в школу или домой — расписание есть в каждом филиале.</p>
        </div>

        {loading && <p>Загружаем филиалы…</p>}
        {error && <p>{error}</p>}

        <div className="grid grid-2">
          {(branches ?? []).map((b) => (
            <div key={b.id} className="card" style={{ padding: 24 }}>
              <h3>{b.address}</h3>
              {b.note && <p style={{ color: "var(--ink-muted)", fontSize: 14.5 }}>{b.note}</p>}
              <p style={{ fontSize: 14, margin: 0 }}>
                <strong>Часы работы:</strong> {b.workingHours}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
