import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { Notification } from "../api/types";
import "./NotificationsList.css";

export function NotificationsList() {
  const [items, setItems] = useState<Notification[]>([]);

  async function load() {
    setItems(await api.notifications.list());
  }

  useEffect(() => {
    load();
  }, []);

  async function markRead(id: number) {
    await api.notifications.markRead(id);
    load();
  }

  if (items.length === 0) {
    return (
      <div className="card notifications-list">
        <h3>Уведомления</h3>
        <p style={{ color: "var(--ink-muted)", fontSize: 13.5, margin: 0 }}>Пока нет уведомлений.</p>
      </div>
    );
  }

  return (
    <div className="card notifications-list">
      <h3>Уведомления {items.some((i) => !i.read) && <span className="tag">новые есть</span>}</h3>
      <ul>
        {items.map((n) => (
          <li key={n.id} className={n.read ? "" : "is-unread"}>
            <div>
              <strong>{n.title}</strong>
              <p>{n.body}</p>
              <span>{new Date(n.createdAt).toLocaleString("ru-RU")}</span>
            </div>
            {!n.read && (
              <button type="button" onClick={() => markRead(n.id)}>Прочитано</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
