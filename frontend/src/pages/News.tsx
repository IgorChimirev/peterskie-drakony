import { useApi } from "../hooks/useApi";
import { api } from "../api/client";

export function News() {
  const { data: posts, loading, error } = useApi(() => api.news(), []);

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 780 }}>
        <div className="section-head">
          <span className="eyebrow">Новости</span>
          <h1>Новости клуба</h1>
        </div>

        {loading && <p>Загружаем новости…</p>}
        {error && <p>{error}</p>}

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {(posts ?? []).map((p) => (
            <article key={p.id} className="card" style={{ padding: 24 }}>
              <p style={{ fontSize: 12.5, color: "var(--ink-muted)", marginBottom: 6 }}>
                {new Date(p.publishedAt).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
              </p>
              <h3 style={{ marginBottom: 8 }}>{p.title}</h3>
              <p style={{ color: "var(--ink-muted)" }}>{p.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
