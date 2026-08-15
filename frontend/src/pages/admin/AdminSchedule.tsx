import { useEffect, useState, type FormEvent } from "react";
import { api } from "../../api/client";
import type { Branch, ScheduleSlot, ScheduleSlotPayload, Trainer } from "../../api/types";

const EMPTY: ScheduleSlotPayload = {
  groupName: "",
  ageRange: "",
  dayOfWeek: "",
  timeRange: "",
  capacity: 10,
  booked: 0,
  branchId: 0,
  trainerId: 0,
};

export function AdminSchedule() {
  const [slots, setSlots] = useState<ScheduleSlot[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [form, setForm] = useState<ScheduleSlotPayload>(EMPTY);
  const [editingId, setEditingId] = useState<number | null>(null);

  async function refresh() {
    const [s, b, t] = await Promise.all([api.schedule(), api.branches(), api.trainers()]);
    setSlots(s);
    setBranches(b);
    setTrainers(t);
  }

  useEffect(() => {
    refresh();
  }, []);

  function edit(slot: ScheduleSlot) {
    setEditingId(slot.id);
    setForm({
      groupName: slot.groupName,
      ageRange: slot.ageRange,
      dayOfWeek: slot.dayOfWeek,
      timeRange: slot.timeRange,
      capacity: slot.capacity,
      booked: slot.booked,
      branchId: slot.branch.id,
      trainerId: slot.trainer.id,
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.branchId || !form.trainerId) return;
    if (editingId) {
      await api.admin.schedule.update(editingId, form);
    } else {
      await api.admin.schedule.create(form);
    }
    resetForm();
    refresh();
  }

  async function remove(id: number) {
    await api.admin.schedule.remove(id);
    refresh();
  }

  return (
    <div>
      <form className="card admin-form" onSubmit={handleSubmit}>
        <h3>{editingId ? "Изменить занятие" : "Добавить занятие"}</h3>
        <div className="admin-form__grid">
          <input required placeholder="Название группы" value={form.groupName}
            onChange={(e) => setForm({ ...form, groupName: e.target.value })} />
          <input placeholder="Возраст, напр. 7–9 лет" value={form.ageRange}
            onChange={(e) => setForm({ ...form, ageRange: e.target.value })} />
          <input placeholder="Дни, напр. Пн / Ср" value={form.dayOfWeek}
            onChange={(e) => setForm({ ...form, dayOfWeek: e.target.value })} />
          <input placeholder="Время, напр. 18:00–19:00" value={form.timeRange}
            onChange={(e) => setForm({ ...form, timeRange: e.target.value })} />
          <input type="number" placeholder="Вместимость" value={form.capacity}
            onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} />
          <input type="number" placeholder="Занято мест" value={form.booked}
            onChange={(e) => setForm({ ...form, booked: Number(e.target.value) })} />
          <select value={form.branchId} onChange={(e) => setForm({ ...form, branchId: Number(e.target.value) })}>
            <option value={0}>Филиал…</option>
            {branches.map((b) => <option key={b.id} value={b.id}>{b.address}</option>)}
          </select>
          <select value={form.trainerId} onChange={(e) => setForm({ ...form, trainerId: Number(e.target.value) })}>
            <option value={0}>Тренер…</option>
            {trainers.map((t) => <option key={t.id} value={t.id}>{t.fullName}</option>)}
          </select>
        </div>
        <div className="admin-form__actions">
          <button className="btn btn-primary" type="submit">{editingId ? "Сохранить" : "Добавить"}</button>
          {editingId && <button className="btn btn-ghost" type="button" onClick={resetForm}>Отменить</button>}
        </div>
      </form>

      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>Группа</th><th>Дни</th><th>Время</th><th>Тренер</th><th>Филиал</th><th>Мест</th><th></th>
            </tr>
          </thead>
          <tbody>
            {slots.map((s) => (
              <tr key={s.id}>
                <td>{s.groupName}</td>
                <td>{s.dayOfWeek}</td>
                <td>{s.timeRange}</td>
                <td>{s.trainer.fullName}</td>
                <td>{s.branch.address}</td>
                <td>{s.booked}/{s.capacity}</td>
                <td>
                  <div className="admin-row-actions">
                    <button type="button" onClick={() => edit(s)}>Изменить</button>
                    <button type="button" className="danger" onClick={() => remove(s.id)}>Удалить</button>
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
