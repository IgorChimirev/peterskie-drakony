import { useState } from "react";
import { AdminSchedule } from "./AdminSchedule";
import { AdminNews } from "./AdminNews";
import { AdminLeads } from "./AdminLeads";
import "./Admin.css";

const TABS = [
  { id: "schedule", label: "Расписание" },
  { id: "news", label: "Новости" },
  { id: "leads", label: "Заявки" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function Admin() {
  const [tab, setTab] = useState<TabId>("schedule");

  return (
    <section className="section">
      <div className="container">
        <span className="eyebrow">Админ-панель</span>
        <h1>Управление сайтом</h1>
        <p style={{ color: "var(--ink-muted)", marginBottom: 24 }}>
          Здесь можно двигать расписание, публиковать новости и обрабатывать заявки — без участия разработчика.
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

        {tab === "schedule" && <AdminSchedule />}
        {tab === "news" && <AdminNews />}
        {tab === "leads" && <AdminLeads />}
      </div>
    </section>
  );
}
