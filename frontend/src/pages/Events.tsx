import { useApi } from "../hooks/useApi";
import { api } from "../api/client";

export function Events() {
  const { data: events, loading, error } = useApi(() => api.events(), []);

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 780 }}>
        <div className="section-head">
          <span className="eyebrow">События</span>
          <h1>Мероприятия клуба</h1>
          <p>Турниры, мастер-классы и открытые занятия — следите за анонсами.</p>
        </div>

        {loading && <p>Загружаем события…</p>}
        {error && <p>{error}</p>}

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {(events ?? []).map((e) => (
            <article key={e.id} className="card" style={{ padding: 24 }}>
              <p style={{ fontSize: 12.5, color: "var(--ink-muted)", marginBottom: 6 }}>
                {new Date(e.date).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
                {e.location ? ` · ${e.location}` : ""}
              </p>
              <h3 style={{ marginBottom: 8 }}>{e.title}</h3>
              <p style={{ color: "var(--ink-muted)" }}>{e.description}</p>
            </article>
          ))}
          {events && events.length === 0 && <p style={{ color: "var(--ink-muted)" }}>Пока новых событий не запланировано.</p>}
        </div>
      </div>
    </section>
  );
}
