import { useEffect, useState, type FormEvent } from "react";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { ChatWidget } from "../components/ChatWidget";
import { NotificationsList } from "../components/NotificationsList";
import { VerifyBanner } from "../components/VerifyBanner";
import type { Branch, LearningMaterial, Me, ScheduleSlot, StudentView, Tariff } from "../api/types";
import "./Lk.css";

export function Lk() {
  const { user, refreshUser } = useAuth();
  const [me, setMe] = useState<Me | null>(null);
  const [students, setStudents] = useState<StudentView[] | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [slots, setSlots] = useState<ScheduleSlot[]>([]);
  const [materials, setMaterials] = useState<LearningMaterial[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState("");
  const [newBranch, setNewBranch] = useState<string>("");

  const [editingProfile, setEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");

  async function refresh() {
    try {
      const [meRes, s, b, t, sched, mat] = await Promise.all([
        api.auth.me(),
        api.students.list(),
        api.branches(),
        api.tariffs(),
        api.schedule(),
        api.materials(),
      ]);
      setMe(meRes);
      setProfileName(meRes.fullName);
      setProfilePhone(meRes.phone ?? "");
      setStudents(s);
      setBranches(b);
      setTariffs(t);
      setSlots(sched);
      setMaterials(mat);
    } catch {
      setError("Не удалось загрузить данные личного кабинета");
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleAddStudent(e: FormEvent) {
    e.preventDefault();
    await api.students.create({
      fullName: newName,
      age: newAge,
      branchId: newBranch ? Number(newBranch) : null,
    });
    setNewName("");
    setNewAge("");
    setNewBranch("");
    refresh();
  }

  async function saveProfile(e: FormEvent) {
    e.preventDefault();
    await api.auth.updateMe({ fullName: profileName, phone: profilePhone });
    setEditingProfile(false);
    refreshUser();
    refresh();
  }

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 960 }}>
        <span className="eyebrow">Личный кабинет</span>
        <h1>Здравствуйте, {user?.fullName}</h1>

        {error && <p>{error}</p>}

        {me && !me.emailVerified && (
          <VerifyBanner channel="email" label="Email" onVerified={refresh} />
        )}
        {me && me.phone && !me.phoneVerified && (
          <VerifyBanner channel="phone" label="Телефон" onVerified={refresh} />
        )}

        <div className="card lk-profile">
          {!editingProfile ? (
            <div className="lk-profile__view">
              <div>
                <strong>{me?.fullName}</strong>
                <p style={{ margin: "2px 0 0", color: "var(--ink-muted)", fontSize: 13.5 }}>
                  {me?.email} {me?.phone ? `· ${me.phone}` : ""}
                </p>
              </div>
              <button className="btn btn-ghost" type="button" onClick={() => setEditingProfile(true)}>Изменить</button>
            </div>
          ) : (
            <form className="lk-profile__form" onSubmit={saveProfile}>
              <input required value={profileName} onChange={(e) => setProfileName(e.target.value)} placeholder="Имя" />
              <input value={profilePhone} onChange={(e) => setProfilePhone(e.target.value)} placeholder="Телефон" />
              <div className="lk-profile__actions">
                <button className="btn btn-primary" type="submit">Сохранить</button>
                <button className="btn btn-ghost" type="button" onClick={() => setEditingProfile(false)}>Отмена</button>
              </div>
            </form>
          )}
        </div>

        <div className="lk-students">
          {(students ?? []).map((s) => (
            <StudentCard key={s.id} student={s} tariffs={tariffs} branches={branches} slots={slots} onChanged={refresh} />
          ))}
        </div>

        <form className="card lk-add-student" onSubmit={handleAddStudent}>
          <h3>Добавить ученика</h3>
          <div className="lk-add-student__row">
            <input required placeholder="Имя ребёнка" value={newName} onChange={(e) => setNewName(e.target.value)} />
            <input placeholder="Возраст" value={newAge} onChange={(e) => setNewAge(e.target.value)} />
            <select value={newBranch} onChange={(e) => setNewBranch(e.target.value)}>
              <option value="">Филиал не выбран</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>{b.address}</option>
              ))}
            </select>
            <button className="btn btn-primary" type="submit">Добавить</button>
          </div>
        </form>

        {materials.length > 0 && (
          <div className="card lk-materials">
            <h3>Учебные материалы</h3>
            <ul>
              {materials.map((m) => (
                <li key={m.id}>
                  <div>
                    <strong>{m.title}</strong>
                    <span className="tag" style={{ marginLeft: 8 }}>{m.category}</span>
                    <p>{m.description}</p>
                  </div>
                  {m.fileUrl && <a className="btn btn-ghost" href={m.fileUrl} target="_blank" rel="noreferrer">Скачать</a>}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-2" style={{ marginTop: 24, alignItems: "start" }}>
          <NotificationsList />
          <ChatWidget />
        </div>
      </div>
    </section>
  );
}

function StudentCard({
  student,
  tariffs,
  branches,
  slots,
  onChanged,
}: {
  student: StudentView;
  tariffs: Tariff[];
  branches: Branch[];
  slots: ScheduleSlot[];
  onChanged: () => void;
}) {
  const activeSub = student.subscriptions
    .filter((s) => s.status === "ACTIVE")
    .sort((a, b) => b.id - a.id)[0];
  const [selectedTariff, setSelectedTariff] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "processing" | "done">("idle");
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(student.fullName);
  const [editAge, setEditAge] = useState(student.age ?? "");
  const [editBranch, setEditBranch] = useState(student.branch?.id?.toString() ?? "");
  const [selectedSlot, setSelectedSlot] = useState(student.scheduleSlot?.id?.toString() ?? "");

  async function handlePay() {
    if (!selectedTariff) return;
    setStatus("processing");
    // Заглушка платёжного шлюза: имитируем обработку платежа на клиенте,
    // реальная оплата (ЮKassa/Тинькофф/CloudPayments) сюда пока не подключена.
    await new Promise((resolve) => setTimeout(resolve, 1100));
    await api.payments.checkout(student.id, Number(selectedTariff));
    setStatus("done");
    onChanged();
    setTimeout(() => setStatus("idle"), 2500);
  }

  async function saveEdit(e: FormEvent) {
    e.preventDefault();
    await api.students.update(student.id, {
      fullName: editName,
      age: editAge,
      branchId: editBranch ? Number(editBranch) : null,
    });
    setEditing(false);
    onChanged();
  }

  async function removeStudent() {
    if (!confirm(`Удалить ${student.fullName} из личного кабинета?`)) return;
    await api.students.remove(student.id);
    onChanged();
  }

  async function changeEnrollment(value: string) {
    setSelectedSlot(value);
    if (value) {
      await api.students.enroll(student.id, Number(value));
    } else if (student.scheduleSlot) {
      await api.students.unenroll(student.id);
    }
    onChanged();
  }

  return (
    <div className="card lk-student">
      {!editing ? (
        <div className="lk-student__head">
          <h3>{student.fullName}</h3>
          <span className="tag">{student.age || "возраст не указан"}</span>
          <span className="tag">рейтинг: {student.ratingPoints}</span>
          <div className="lk-student__head-actions">
            <button type="button" onClick={() => setEditing(true)}>Изменить</button>
            <button type="button" className="danger" onClick={removeStudent}>Удалить</button>
          </div>
        </div>
      ) : (
        <form className="lk-student__edit" onSubmit={saveEdit}>
          <input required value={editName} onChange={(e) => setEditName(e.target.value)} />
          <input value={editAge} onChange={(e) => setEditAge(e.target.value)} placeholder="Возраст" />
          <select value={editBranch} onChange={(e) => setEditBranch(e.target.value)}>
            <option value="">Филиал не выбран</option>
            {branches.map((b) => <option key={b.id} value={b.id}>{b.address}</option>)}
          </select>
          <button className="btn btn-primary" type="submit">Сохранить</button>
          <button className="btn btn-ghost" type="button" onClick={() => setEditing(false)}>Отмена</button>
        </form>
      )}

      {student.branch && <p className="lk-student__branch">{student.branch.address}</p>}

      <label className="lk-student__enroll">
        Группа занятий
        <select value={selectedSlot} onChange={(e) => changeEnrollment(e.target.value)}>
          <option value="">Не записан в группу</option>
          {slots.map((s) => (
            <option key={s.id} value={s.id} disabled={s.booked >= s.capacity && s.id !== student.scheduleSlot?.id}>
              {s.groupName} · {s.dayOfWeek} {s.timeRange} · {s.branch.address} ({s.booked}/{s.capacity})
            </option>
          ))}
        </select>
      </label>

      {activeSub ? (
        <div className="lk-subscription">
          <div>
            <div className="lk-subscription__label">Абонемент</div>
            <div className="lk-subscription__value">{activeSub.tariff.name}</div>
          </div>
          <div>
            <div className="lk-subscription__label">Осталось занятий</div>
            <div className="lk-subscription__value">{activeSub.lessonsTotal - activeSub.lessonsUsed} из {activeSub.lessonsTotal}</div>
          </div>
          <div>
            <div className="lk-subscription__label">Действует до</div>
            <div className="lk-subscription__value">{new Date(activeSub.validUntil).toLocaleDateString("ru-RU")}</div>
          </div>
        </div>
      ) : (
        <p className="lk-student__no-sub">Активного абонемента нет.</p>
      )}

      <div className="lk-pay">
        <select value={selectedTariff} onChange={(e) => setSelectedTariff(e.target.value)}>
          <option value="">Выбрать тариф для продления/покупки</option>
          {tariffs.map((t) => (
            <option key={t.id} value={t.id}>{t.name} — {t.price.toLocaleString("ru-RU")} ₽</option>
          ))}
        </select>
        <button className="btn btn-primary" type="button" disabled={!selectedTariff || status === "processing"} onClick={handlePay}>
          {status === "processing" ? "Обрабатываем платёж…" : status === "done" ? "Оплачено ✓" : "Оплатить"}
        </button>
      </div>
      <p className="lk-pay__hint">Оплата — демонстрационная заглушка, реальный платёжный шлюз не подключён.</p>

      {(student.homework.length > 0 || student.tournamentResults.length > 0) && (
        <div className="lk-student__history">
          {student.homework.length > 0 && (
            <div>
              <h4>Домашние задания</h4>
              <ul>
                {student.homework.map((h) => (
                  <li key={h.id}>{h.description} <span>+{h.points}</span></li>
                ))}
              </ul>
            </div>
          )}
          {student.tournamentResults.length > 0 && (
            <div>
              <h4>Турнирные результаты</h4>
              <ul>
                {student.tournamentResults.map((r) => (
                  <li key={r.id}>{r.tournamentName} — {r.place} <span>+{r.points}</span></li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
