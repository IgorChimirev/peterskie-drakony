import { useApi } from "../hooks/useApi";
import { api } from "../api/client";
import "./Rating.css";

export function Rating() {
  const { data: entries, loading, error } = useApi(() => api.rating(), []);
  const maxPoints = Math.max(1, ...(entries ?? []).map((e) => e.totalPoints));

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 780 }}>
        <div className="section-head">
          <span className="eyebrow">Рейтинг</span>
          <h1>Рейтинг учеников</h1>
          <p>
            Считается по сумме баллов за домашние задания и турнирные результаты, которые заносят тренеры.
            Обновляется ежемесячно.
          </p>
        </div>

        {loading && <p>Загружаем рейтинг…</p>}
        {error && <p>{error}</p>}

        {entries && entries.length === 0 && (
          <p style={{ color: "var(--ink-muted)" }}>Пока нет данных для рейтинга.</p>
        )}

        <div className="rating-list" role="table" aria-label="Рейтинг учеников">
          {(entries ?? []).map((e, i) => (
            <div className="rating-row" role="row" key={e.studentId}>
              <span className="rating-row__place">{i + 1}</span>
              <div className="rating-row__body">
                <div className="rating-row__head">
                  <span className="rating-row__name">{e.studentName}</span>
                  <span className="rating-row__value">{e.totalPoints}</span>
                </div>
                <div className="rating-row__track">
                  <div
                    className="rating-row__fill"
                    style={{ width: `${Math.max(4, (e.totalPoints / maxPoints) * 100)}%` }}
                  />
                </div>
                <div className="rating-row__breakdown">
                  ДЗ: {e.homeworkPoints} · Турниры: {e.tournamentPoints}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
