import { useEffect, useState } from "react";
import { api } from "../../api/client";
import type { Review } from "../../api/types";

export function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);

  async function refresh() {
    setReviews(await api.admin.reviews.list());
  }

  useEffect(() => {
    refresh();
  }, []);

  async function approve(id: number) {
    await api.admin.reviews.approve(id);
    refresh();
  }

  async function remove(id: number) {
    await api.admin.reviews.remove(id);
    refresh();
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {reviews.map((r) => (
        <div key={r.id} className="card" style={{ padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <div>
              <p style={{ margin: "0 0 6px", fontSize: 12.5, color: "var(--ink-muted)" }}>
                {r.authorName} · {r.rating}/5 · {new Date(r.createdAt).toLocaleDateString("ru-RU")}
                {" "}
                <span className="tag" style={!r.approved ? { background: "#F5E6DA", color: "#A33" } : undefined}>
                  {r.approved ? "Опубликован" : "На модерации"}
                </span>
              </p>
              <p style={{ margin: 0, fontFamily: "var(--font-serif)" }}>«{r.text}»</p>
            </div>
            <div className="admin-row-actions" style={{ flexShrink: 0 }}>
              {!r.approved && <button type="button" onClick={() => approve(r.id)}>Одобрить</button>}
              <button type="button" className="danger" onClick={() => remove(r.id)}>Удалить</button>
            </div>
          </div>
        </div>
      ))}
      {reviews.length === 0 && <p style={{ color: "var(--ink-muted)" }}>Отзывов пока нет.</p>}
    </div>
  );
}
