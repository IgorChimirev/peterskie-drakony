import { useEffect, useState, type FormEvent } from "react";
import { api } from "../../api/client";
import type { EventItem } from "../../api/types";

const EMPTY = { title: "", date: "", location: "", description: "" };

export function AdminEvents() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState<number | null>(null);

  async function refresh() {
    setEvents(await api.admin.events.list());
  }

  useEffect(() => {
    refresh();
  }, []);

  function edit(ev: EventItem) {
    setEditingId(ev.id);
    setForm({ title: ev.title, date: ev.date, location: ev.location, description: ev.description });
  }

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (editingId) {
      await api.admin.events.update(editingId, form);
    } else {
      await api.admin.events.create(form);
    }
    resetForm();
    refresh();
  }

  async function remove(id: number) {
    await api.admin.events.remove(id);
    refresh();
  }

  return (
    <div>
      <form className="card admin-form" onSubmit={handleSubmit}>
        <h3>{editingId ? "Изменить событие" : "Добавить событие"}</h3>
        <div className="admin-form__grid">
          <input required placeholder="Название" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          <input placeholder="Место проведения" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        </div>
        <textarea placeholder="Описание" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <div className="admin-form__actions">
          <button className="btn btn-primary" type="submit">{editingId ? "Сохранить" : "Добавить"}</button>
          {editingId && <button className="btn btn-ghost" type="button" onClick={resetForm}>Отменить</button>}
        </div>
      </form>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {events.map((ev) => (
          <div key={ev.id} className="card" style={{ padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <div>
                <p style={{ margin: "0 0 4px", fontSize: 12.5, color: "var(--ink-muted)" }}>
                  {new Date(ev.date).toLocaleDateString("ru-RU")} · {ev.location}
                </p>
                <h3 style={{ margin: 0 }}>{ev.title}</h3>
              </div>
              <div className="admin-row-actions" style={{ flexShrink: 0 }}>
                <button type="button" onClick={() => edit(ev)}>Изменить</button>
                <button type="button" className="danger" onClick={() => remove(ev.id)}>Удалить</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
