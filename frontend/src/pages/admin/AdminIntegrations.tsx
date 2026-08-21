import { useEffect, useState } from "react";
import { api } from "../../api/client";
import type { EmailLog, IntegrationStatus } from "../../api/types";

const STATUS_LABEL: Record<string, string> = { NOT_CONNECTED: "Не подключено", STUBBED: "Заглушка", CONNECTED: "Подключено" };

export function AdminIntegrations() {
  const [statuses, setStatuses] = useState<IntegrationStatus[]>([]);
  const [emails, setEmails] = useState<EmailLog[]>([]);

  useEffect(() => {
    api.admin.integrations.list().then(setStatuses);
    api.admin.integrations.emails().then(setEmails);
  }, []);

  return (
    <div>
      <div className="card table-wrap" style={{ marginBottom: 20 }}>
        <table>
          <thead><tr><th>Интеграция</th><th>Статус</th><th>Комментарий</th></tr></thead>
          <tbody>
            {statuses.map((s) => (
              <tr key={s.key}>
                <td>{s.name}</td>
                <td>
                  <span className="tag" style={s.status === "NOT_CONNECTED" ? { background: "#F5E6DA", color: "#A33" } : undefined}>
                    {STATUS_LABEL[s.status]}
                  </span>
                </td>
                <td style={{ fontSize: 13, color: "var(--ink-muted)" }}>{s.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3>Журнал «отправленных» писем</h3>
      <p style={{ fontSize: 12.5, color: "var(--ink-muted)", marginTop: -6 }}>
        Реальный SMTP не подключён — письма только логируются здесь вместо отправки.
      </p>
      <div className="card table-wrap">
        <table>
          <thead><tr><th>Дата</th><th>Кому</th><th>Тема</th><th>Текст</th></tr></thead>
          <tbody>
            {emails.map((e) => (
              <tr key={e.id}>
                <td>{new Date(e.sentAt).toLocaleString("ru-RU")}</td>
                <td>{e.toAddress}</td>
                <td>{e.subject}</td>
                <td style={{ maxWidth: 320 }}>{e.body}</td>
              </tr>
            ))}
            {emails.length === 0 && <tr><td colSpan={4} style={{ color: "var(--ink-muted)" }}>Пока пусто.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
