import { useEffect, useState } from "react";
import { api } from "../../api/client";
import type { DashboardStats } from "../../api/types";
import "./AdminStats.css";

const STATUS_LABEL: Record<string, string> = { NEW: "Новая", CONTACTED: "Связались", CONVERTED: "Записан", DECLINED: "Отказ" };

export function AdminStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recalculating, setRecalculating] = useState(false);

  async function refresh() {
    setStats(await api.admin.stats());
  }

  useEffect(() => {
    refresh();
  }, []);

  async function recalcRating() {
    setRecalculating(true);
    try {
      await api.admin.rating.recalculate();
      await refresh();
    } finally {
      setRecalculating(false);
    }
  }

  if (!stats) return <p>Загружаем статистику…</p>;

  const leadEntries = Object.entries(stats.leadsByStatus);
  const maxLead = Math.max(1, ...leadEntries.map(([, v]) => v));
  const maxRating = Math.max(1, ...stats.topRating.map((r) => r.totalPoints));

  return (
    <div>
      <div className="stat-tiles">
        <div className="stat-tile">
          <span className="stat-tile__label">Пользователи</span>
          <span className="stat-tile__value">{stats.totalUsers}</span>
          <span className="stat-tile__hint">{stats.totalParents} родителей · {stats.totalTrainers} тренеров</span>
        </div>
        <div className="stat-tile">
          <span className="stat-tile__label">Ученики</span>
          <span className="stat-tile__value">{stats.totalStudents}</span>
        </div>
        <div className="stat-tile">
          <span className="stat-tile__label">Активные абонементы</span>
          <span className="stat-tile__value">{stats.activeSubscriptions}</span>
        </div>
        <div className="stat-tile">
          <span className="stat-tile__label">Выручка (демо-оплаты)</span>
          <span className="stat-tile__value">{stats.totalRevenue.toLocaleString("ru-RU")} ₽</span>
        </div>
        <div className="stat-tile">
          <span className="stat-tile__label">Отзывы на модерации</span>
          <span className="stat-tile__value">{stats.pendingReviews}</span>
        </div>
      </div>

      <div className="grid grid-2" style={{ marginTop: 24, alignItems: "start" }}>
        <div className="card" style={{ padding: 20 }}>
          <h3>Заявки по статусам</h3>
          {leadEntries.length === 0 && <p style={{ color: "var(--ink-muted)", fontSize: 13.5 }}>Заявок пока нет.</p>}
          <div className="mini-bars">
            {leadEntries.map(([status, count]) => (
              <div key={status} className="mini-bars__row">
                <span className="mini-bars__label">{STATUS_LABEL[status] ?? status}</span>
                <div className="mini-bars__track">
                  <div className="mini-bars__fill" style={{ width: `${(count / maxLead) * 100}%` }} />
                </div>
                <span className="mini-bars__value">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0 }}>Топ рейтинга</h3>
            <button className="btn btn-ghost" type="button" onClick={recalcRating} disabled={recalculating}>
              {recalculating ? "Считаем…" : "Пересчитать сейчас"}
            </button>
          </div>
          {stats.topRating.length === 0 && <p style={{ color: "var(--ink-muted)", fontSize: 13.5, marginTop: 10 }}>Пока нет данных.</p>}
          <div className="mini-bars" style={{ marginTop: 10 }}>
            {stats.topRating.map((r) => (
              <div key={r.studentId} className="mini-bars__row">
                <span className="mini-bars__label">{r.studentName}</span>
                <div className="mini-bars__track">
                  <div className="mini-bars__fill" style={{ width: `${(r.totalPoints / maxRating) * 100}%` }} />
                </div>
                <span className="mini-bars__value">{r.totalPoints}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
