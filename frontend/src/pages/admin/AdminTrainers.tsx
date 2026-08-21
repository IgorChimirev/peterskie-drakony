import { useEffect, useState, type FormEvent } from "react";
import { api } from "../../api/client";
import type { Trainer } from "../../api/types";

const EMPTY = { fullName: "", title: "", fideRating: "", headCoach: false, achievements: "", sortOrder: 0 };

export function AdminTrainers() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState<number | null>(null);

  async function refresh() {
    setTrainers(await api.trainers());
  }

  useEffect(() => {
    refresh();
  }, []);

  function edit(t: Trainer) {
    setEditingId(t.id);
    setForm({
      fullName: t.fullName,
      title: t.title,
      fideRating: t.fideRating ?? "",
      headCoach: t.headCoach,
      achievements: t.achievements,
      sortOrder: t.sortOrder,
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (editingId) {
      await api.admin.trainers.update(editingId, form);
    } else {
      await api.admin.trainers.create(form);
    }
    resetForm();
    refresh();
  }

  async function remove(id: number) {
    await api.admin.trainers.remove(id);
    refresh();
  }

  return (
    <div>
      <form className="card admin-form" onSubmit={handleSubmit}>
        <h3>{editingId ? "Изменить тренера" : "Добавить тренера"}</h3>
        <div className="admin-form__grid">
          <input required placeholder="Имя" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          <input placeholder="Звание" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input placeholder="Рейтинг ФИДЕ" value={form.fideRating} onChange={(e) => setForm({ ...form, fideRating: e.target.value })} />
          <input type="number" placeholder="Порядок" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} />
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5 }}>
            <input type="checkbox" checked={form.headCoach} onChange={(e) => setForm({ ...form, headCoach: e.target.checked })} />
            Главный тренер
          </label>
        </div>
        <textarea placeholder="Достижения" rows={3} value={form.achievements} onChange={(e) => setForm({ ...form, achievements: e.target.value })} />
        <div className="admin-form__actions">
          <button className="btn btn-primary" type="submit">{editingId ? "Сохранить" : "Добавить"}</button>
          {editingId && <button className="btn btn-ghost" type="button" onClick={resetForm}>Отменить</button>}
        </div>
      </form>

      <div className="card table-wrap">
        <table>
          <thead><tr><th>Имя</th><th>Звание</th><th>Рейтинг</th><th>Логин</th><th></th></tr></thead>
          <tbody>
            {trainers.map((t) => (
              <tr key={t.id}>
                <td>{t.fullName}{t.headCoach ? " ★" : ""}</td>
                <td>{t.title}</td>
                <td>{t.fideRating}</td>
                <td>{t.user ? t.user.email : <span style={{ color: "var(--ink-muted)" }}>нет</span>}</td>
                <td>
                  <div className="admin-row-actions">
                    <button type="button" onClick={() => edit(t)}>Изменить</button>
                    <button type="button" className="danger" onClick={() => remove(t.id)}>Удалить</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
