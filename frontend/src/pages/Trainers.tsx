import { useApi } from "../hooks/useApi";
import { api } from "../api/client";
import "./Trainers.css";

export function Trainers() {
  const { data: trainers, loading, error } = useApi(() => api.trainers(), []);

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Тренерский состав</span>
          <h1>Тренеры клуба</h1>
          <p>
            Каждый тренер клуба — это не только сильный шахматист, но и опытный
            наставник, умеющий найти подход к ученикам разного возраста и уровня
            подготовки.
          </p>
        </div>

        {loading && <p>Загружаем тренеров…</p>}
        {error && <p>{error}</p>}

        <div className="grid grid-3">
          {(trainers ?? []).map((t) => (
            <article key={t.id} className={`card trainer-card ${t.headCoach ? "trainer-card--head" : ""}`}>
              {t.headCoach && <span className="tag trainer-card__badge">Главный тренер</span>}
              <h3>{t.fullName}</h3>
              <p className="trainer-card__title">{t.title}</p>
              {t.fideRating && <p className="trainer-card__rating">{t.fideRating}</p>}
              <p className="trainer-card__achievements">{t.achievements}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
