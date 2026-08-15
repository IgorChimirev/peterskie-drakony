import { useEffect, useState } from "react";
import { api } from "../../api/client";
import type { Lead } from "../../api/types";

const STATUSES = ["NEW", "CONTACTED", "CONVERTED", "DECLINED"];
const STATUS_LABEL: Record<string, string> = {
  NEW: "Новая",
  CONTACTED: "Связались",
  CONVERTED: "Записан",
  DECLINED: "Отказ",
};

export function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);

  async function refresh() {
    setLeads(await api.admin.leads.list());
  }

  useEffect(() => {
    refresh();
  }, []);

  async function updateStatus(id: number, status: string) {
    await api.admin.leads.setStatus(id, status);
    refresh();
  }

  if (leads.length === 0) {
    return <p style={{ color: "var(--ink-muted)" }}>Заявок пока нет.</p>;
  }

  return (
    <div className="card table-wrap">
      <table>
        <thead>
          <tr>
            <th>Дата</th><th>Ребёнок</th><th>Возраст</th><th>Телефон</th><th>Филиал</th><th>Комментарий</th><th>Статус</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((l) => (
            <tr key={l.id}>
              <td>{new Date(l.createdAt).toLocaleString("ru-RU")}</td>
              <td>{l.childName}</td>
              <td>{l.childAge}</td>
              <td>{l.parentPhone}</td>
              <td>{l.preferredBranch}</td>
              <td>{l.comment}</td>
              <td>
                <select className="admin-status-select" value={l.status} onChange={(e) => updateStatus(l.id, e.target.value)}>
                  {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
