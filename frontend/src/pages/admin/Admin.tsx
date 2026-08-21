import { useState } from "react";
import { AdminSchedule } from "./AdminSchedule";
import { AdminNews } from "./AdminNews";
import { AdminLeads } from "./AdminLeads";
import { AdminTrainers } from "./AdminTrainers";
import { AdminTariffs } from "./AdminTariffs";
import { AdminUsers } from "./AdminUsers";
import { AdminReviews } from "./AdminReviews";
import { AdminEvents } from "./AdminEvents";
import { AdminGallery } from "./AdminGallery";
import { AdminMaterials } from "./AdminMaterials";
import { AdminChat } from "./AdminChat";
import { AdminStats } from "./AdminStats";
import { AdminIntegrations } from "./AdminIntegrations";
import { AdminBackup } from "./AdminBackup";
import "./Admin.css";

const TABS = [
  { id: "stats", label: "Статистика" },
  { id: "schedule", label: "Расписание" },
  { id: "news", label: "Новости" },
  { id: "events", label: "События" },
  { id: "gallery", label: "Галерея" },
  { id: "materials", label: "Материалы" },
  { id: "trainers", label: "Тренеры" },
  { id: "tariffs", label: "Цены" },
  { id: "leads", label: "Заявки" },
  { id: "reviews", label: "Отзывы" },
  { id: "chat", label: "Чат" },
  { id: "users", label: "Пользователи" },
  { id: "integrations", label: "Интеграции" },
  { id: "backup", label: "Бэкапы" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function Admin() {
  const [tab, setTab] = useState<TabId>("stats");

  return (
    <section className="section">
      <div className="container">
        <span className="eyebrow">Админ-панель</span>
        <h1>Управление сайтом</h1>
        <p style={{ color: "var(--ink-muted)", marginBottom: 24 }}>
          Полное управление контентом, пользователями и настройками — без участия разработчика.
        </p>

        <div className="admin-tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`admin-tabs__btn ${tab === t.id ? "is-active" : ""}`}
              type="button"
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "stats" && <AdminStats />}
        {tab === "schedule" && <AdminSchedule />}
        {tab === "news" && <AdminNews />}
        {tab === "events" && <AdminEvents />}
        {tab === "gallery" && <AdminGallery />}
        {tab === "materials" && <AdminMaterials />}
        {tab === "trainers" && <AdminTrainers />}
        {tab === "tariffs" && <AdminTariffs />}
        {tab === "leads" && <AdminLeads />}
        {tab === "reviews" && <AdminReviews />}
        {tab === "chat" && <AdminChat />}
        {tab === "users" && <AdminUsers />}
        {tab === "integrations" && <AdminIntegrations />}
        {tab === "backup" && <AdminBackup />}
      </div>
    </section>
  );
}
