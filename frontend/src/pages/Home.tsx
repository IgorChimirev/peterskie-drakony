import { Link } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import { api } from "../api/client";
import { TrialForm } from "../components/TrialForm";
import "./Home.css";

const ADVANTAGES = [
  {
    title: "Стратегическое мышление",
    text: "Учим ставить цель, просчитывать варианты и оценивать результат — не только за доской.",
  },
  {
    title: "Концентрация внимания",
    text: "Формат занятий удерживает интерес даже у непоседливых дошкольников.",
  },
  {
    title: "Эмоциональная устойчивость",
    text: "Учимся спокойно принимать и победу, и поражение — искать ошибку, а не обвинять судьбу.",
  },
  {
    title: "Советская школа + современные платформы",
    text: "Классическая методика подготовки в сочетании с цифровыми инструментами для разбора партий.",
  },
];

export function Home() {
  const { data: trainers } = useApi(() => api.trainers(), []);
  const { data: branches } = useApi(() => api.branches(), []);
  const { data: reviews } = useApi(() => api.reviews(), []);

  const featuredTrainers = trainers?.slice(0, 3) ?? [];

  return (
    <>
      <section className="hero">
        <div className="container hero__grid">
          <div>
            <span className="eyebrow">Шахматный клуб в Санкт-Петербурге</span>
            <h1>Шахматы, которые учат мыслить</h1>
            <p className="hero__lead">
              Обучаем детей и взрослых шахматам — от первого хода до турнирного разряда.
              Тренеры клуба «Питерские драконы» — гроссмейстеры и мастера ФИДЕ, 5 залов по
              городу, бережный подход к каждому ученику.
            </p>
            <div className="hero__actions">
              <Link className="btn btn-primary" to="/trial">Записаться на пробное занятие</Link>
              <Link className="btn btn-ghost" to="/about">Узнать о методике</Link>
            </div>
            <dl className="hero__stats">
              <div>
                <dt>5</dt>
                <dd>филиалов в СПб</dd>
              </div>
              <div>
                <dt>11</dt>
                <dd>тренеров, включая гроссмейстеров</dd>
              </div>
              <div>
                <dt>2451+</dt>
                <dd>рейтинг ФИДЕ главного тренера</dd>
              </div>
            </dl>
          </div>
          <div className="hero__board" aria-hidden="true">
            <div className="chessboard">
              {Array.from({ length: 64 }).map((_, i) => (
                <span key={i} className={(Math.floor(i / 8) + i) % 2 === 0 ? "sq sq--light" : "sq sq--dark"} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Почему шахматы</span>
            <h2>Чему учится ребёнок за доской</h2>
          </div>
          <div className="grid grid-4">
            {ADVANTAGES.map((a) => (
              <div key={a.title} className="card advantage">
                <h3>{a.title}</h3>
                <p>{a.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Тренерский состав</span>
            <h2>Учат гроссмейстеры и мастера ФИДЕ</h2>
          </div>
          <div className="grid grid-3">
            {featuredTrainers.map((t) => (
              <div key={t.id} className="card trainer-preview">
                <h3>{t.fullName}</h3>
                <p className="trainer-preview__title">{t.title}</p>
                {t.fideRating && <span className="tag">{t.fideRating}</span>}
              </div>
            ))}
          </div>
          <Link className="btn btn-ghost" to="/trainers" style={{ marginTop: 24 }}>
            Весь тренерский состав
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Филиалы</span>
            <h2>5 залов в разных районах Петербурга</h2>
          </div>
          <ul className="branch-strip">
            {(branches ?? []).map((b) => (
              <li key={b.id}>{b.address}</li>
            ))}
          </ul>
          <Link className="btn btn-ghost" to="/branches" style={{ marginTop: 20 }}>
            Смотреть на карте и расписание
          </Link>
        </div>
      </section>

      {reviews && reviews.length > 0 && (
        <section className="section section-alt">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Отзывы</span>
              <h2>Что говорят родители</h2>
            </div>
            <div className="grid grid-3">
              {reviews.map((r) => (
                <div key={r.id} className="card review">
                  <p>«{r.text}»</p>
                  <span className="review__author">— {r.authorName}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container cta-split">
          <div>
            <span className="eyebrow">Первое занятие в подарок</span>
            <h2>Приходите на бесплатное пробное занятие</h2>
            <p>
              Посмотрите, как проходят уроки, познакомьтесь с тренером — а если решите
              продолжить, первое занятие войдёт в абонемент как подарок.
            </p>
          </div>
          <TrialForm compact />
        </div>
      </section>
    </>
  );
}
