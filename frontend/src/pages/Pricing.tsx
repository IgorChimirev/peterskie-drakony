import { Link } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import { api } from "../api/client";
import "./Pricing.css";

export function Pricing() {
  const { data: tariffs, loading, error } = useApi(() => api.tariffs(), []);

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Цены</span>
          <h1>Абонементы и разовые занятия</h1>
          <p>Первое занятие — бесплатно, при покупке абонемента оно остаётся в подарок.</p>
        </div>

        {loading && <p>Загружаем тарифы…</p>}
        {error && <p>{error}</p>}

        <div className="grid grid-3">
          {(tariffs ?? []).map((t) => (
            <div key={t.id} className={`card tariff-card ${t.highlighted ? "tariff-card--highlighted" : ""}`}>
              {t.highlighted && <span className="tag">Популярный выбор</span>}
              <h3>{t.name}</h3>
              <p className="tariff-card__desc">{t.description}</p>
              <div className="tariff-card__price">
                {t.oldPrice && <span className="tariff-card__old">{t.oldPrice.toLocaleString("ru-RU")} ₽</span>}
                <span>{t.price.toLocaleString("ru-RU")} ₽</span>
              </div>
              <Link className="btn btn-primary btn-block" to="/trial">Записаться</Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
