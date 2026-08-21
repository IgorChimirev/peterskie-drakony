import { useApi } from "../hooks/useApi";
import { api } from "../api/client";

export function Gallery() {
  const { data: items, loading, error } = useApi(() => api.gallery(), []);

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Галерея</span>
          <h1>Фотографии с занятий и турниров</h1>
        </div>

        {loading && <p>Загружаем галерею…</p>}
        {error && <p>{error}</p>}

        <div className="grid grid-3">
          {(items ?? []).map((g) => (
            <figure key={g.id} className="card" style={{ padding: 0, overflow: "hidden" }}>
              {g.imageUrl ? (
                <img src={g.imageUrl} alt={g.title} style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }} />
              ) : (
                <div style={{ width: "100%", height: 180, background: "var(--surface-alt)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink-muted)", fontSize: 13 }}>
                  Фото скоро появится
                </div>
              )}
              <figcaption style={{ padding: 14 }}>
                <strong style={{ fontSize: 14.5 }}>{g.title}</strong>
                <p style={{ margin: "4px 0 0", fontSize: 12.5, color: "var(--ink-muted)" }}>
                  {new Date(g.eventDate).toLocaleDateString("ru-RU")}
                </p>
              </figcaption>
            </figure>
          ))}
          {items && items.length === 0 && <p style={{ color: "var(--ink-muted)" }}>Галерея пока пуста.</p>}
        </div>
      </div>
    </section>
  );
}
