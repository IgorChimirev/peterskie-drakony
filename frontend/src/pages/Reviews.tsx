import { useState, type FormEvent } from "react";
import { useApi } from "../hooks/useApi";
import { api } from "../api/client";

export function Reviews() {
  const { data: reviews, loading, error } = useApi(() => api.reviews(), []);
  const [authorName, setAuthorName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    await api.submitReview({ authorName, rating, text });
    setAuthorName("");
    setText("");
    setRating(5);
    setStatus("done");
  }

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 780 }}>
        <div className="section-head">
          <span className="eyebrow">Отзывы</span>
          <h1>Что говорят родители</h1>
        </div>

        {loading && <p>Загружаем отзывы…</p>}
        {error && <p>{error}</p>}

        <div className="grid grid-2" style={{ marginBottom: 32 }}>
          {(reviews ?? []).map((r) => (
            <div key={r.id} className="card" style={{ padding: 20 }}>
              <p style={{ fontFamily: "var(--font-serif)", marginBottom: 10 }}>«{r.text}»</p>
              <span style={{ fontSize: 13, color: "var(--ink-muted)" }}>— {r.authorName}, {r.rating}/5</span>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: 24, maxWidth: 480 }}>
          <h3>Оставить отзыв</h3>
          {status === "done" ? (
            <p style={{ color: "var(--ink-muted)" }}>
              Спасибо! Отзыв отправлен на модерацию и появится на сайте после проверки администратором.
            </p>
          ) : (
            <form style={{ display: "flex", flexDirection: "column", gap: 12 }} onSubmit={handleSubmit}>
              <input required placeholder="Ваше имя" value={authorName} onChange={(e) => setAuthorName(e.target.value)}
                style={{ padding: "10px 12px", border: "1px solid var(--line)", borderRadius: 4 }} />
              <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "var(--ink-muted)" }}>
                Оценка
                <select value={rating} onChange={(e) => setRating(Number(e.target.value))}
                  style={{ padding: "8px 10px", border: "1px solid var(--line)", borderRadius: 4 }}>
                  {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </label>
              <textarea required rows={4} placeholder="Ваш отзыв" value={text} onChange={(e) => setText(e.target.value)}
                style={{ padding: "10px 12px", border: "1px solid var(--line)", borderRadius: 4, fontFamily: "var(--font-sans)" }} />
              <button className="btn btn-primary" type="submit" disabled={status === "sending"}>
                {status === "sending" ? "Отправляем…" : "Отправить"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
