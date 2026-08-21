import { useEffect, useState, type FormEvent } from "react";
import { api } from "../../api/client";
import type { Tariff } from "../../api/types";

const EMPTY = { name: "", description: "", price: 0, oldPrice: undefined as number | undefined, highlighted: false, sortOrder: 0, lessonsCount: 1 };

export function AdminTariffs() {
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState<number | null>(null);

  async function refresh() {
    setTariffs(await api.tariffs());
  }

  useEffect(() => {
    refresh();
  }, []);

  function edit(t: Tariff) {
    setEditingId(t.id);
    setForm({
      name: t.name,
      description: t.description,
      price: t.price,
      oldPrice: t.oldPrice ?? undefined,
      highlighted: t.highlighted,
      sortOrder: t.sortOrder,
      lessonsCount: t.lessonsCount,
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const payload = { ...form, oldPrice: form.oldPrice || null };
    if (editingId) {
      await api.admin.tariffs.update(editingId, payload);
    } else {
      await api.admin.tariffs.create(payload);
    }
    resetForm();
    refresh();
  }

  async function remove(id: number) {
    await api.admin.tariffs.remove(id);
    refresh();
  }

  return (
    <div>
      <form className="card admin-form" onSubmit={handleSubmit}>
        <h3>{editingId ? "Изменить тариф" : "Добавить тариф"}</h3>
        <div className="admin-form__grid">
          <input required placeholder="Название" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Описание" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <input type="number" required placeholder="Цена" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
          <input type="number" placeholder="Старая цена" value={form.oldPrice ?? ""} onChange={(e) => setForm({ ...form, oldPrice: e.target.value ? Number(e.target.value) : undefined })} />
          <input type="number" required placeholder="Занятий в абонементе" value={form.lessonsCount} onChange={(e) => setForm({ ...form, lessonsCount: Number(e.target.value) })} />
          <input type="number" placeholder="Порядок" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} />
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5 }}>
            <input type="checkbox" checked={form.highlighted} onChange={(e) => setForm({ ...form, highlighted: e.target.checked })} />
            Выделить как популярный
          </label>
        </div>
        <div className="admin-form__actions">
          <button className="btn btn-primary" type="submit">{editingId ? "Сохранить" : "Добавить"}</button>
          {editingId && <button className="btn btn-ghost" type="button" onClick={resetForm}>Отменить</button>}
        </div>
      </form>

      <div className="card table-wrap">
        <table>
          <thead><tr><th>Тариф</th><th>Цена</th><th>Занятий</th><th></th></tr></thead>
          <tbody>
            {tariffs.map((t) => (
              <tr key={t.id}>
                <td>{t.name}{t.highlighted ? " ★" : ""}</td>
                <td>{t.price.toLocaleString("ru-RU")} ₽</td>
                <td>{t.lessonsCount}</td>
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
