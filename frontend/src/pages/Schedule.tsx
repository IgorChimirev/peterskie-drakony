import { useMemo, useState } from "react";
import { useApi } from "../hooks/useApi";
import { api } from "../api/client";

export function Schedule() {
  const { data: slots, loading, error } = useApi(() => api.schedule(), []);
  const [branchFilter, setBranchFilter] = useState<string>("all");

  const branchNames = useMemo(
    () => Array.from(new Set((slots ?? []).map((s) => s.branch.address))),
    [slots]
  );

  const filtered = (slots ?? []).filter(
    (s) => branchFilter === "all" || s.branch.address === branchFilter
  );

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Расписание</span>
          <h1>Расписание занятий</h1>
          <p>Внутришкольное расписание групп по филиалам — свяжитесь с администратором, чтобы записаться в конкретную группу.</p>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: "var(--ink-muted)" }}>
            Филиал:{" "}
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              style={{ padding: "8px 10px", border: "1px solid var(--line)", borderRadius: 4, fontFamily: "var(--font-sans)" }}
            >
              <option value="all">Все филиалы</option>
              {branchNames.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </label>
        </div>

        {loading && <p>Загружаем расписание…</p>}
        {error && <p>{error}</p>}

        <div className="card table-wrap">
          <table>
            <thead>
              <tr>
                <th>Группа</th>
                <th>Возраст</th>
                <th>Дни</th>
                <th>Время</th>
                <th>Тренер</th>
                <th>Филиал</th>
                <th>Свободно мест</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id}>
                  <td>{s.groupName}</td>
                  <td>{s.ageRange}</td>
                  <td>{s.dayOfWeek}</td>
                  <td>{s.timeRange}</td>
                  <td>{s.trainer.fullName}</td>
                  <td>{s.branch.address}</td>
                  <td>{Math.max(s.capacity - s.booked, 0)} из {s.capacity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
