import { useEffect, useState, type FormEvent } from "react";
import { api } from "../../api/client";
import type { AdminUserView, Trainer } from "../../api/types";

const ROLE_LABEL: Record<string, string> = { PARENT: "Родитель", TRAINER: "Тренер", ADMIN: "Администратор" };

export function AdminUsers() {
  const [users, setUsers] = useState<AdminUserView[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("PARENT");
  const [trainerId, setTrainerId] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  async function refresh() {
    const [u, t] = await Promise.all([api.admin.users.list(), api.trainers()]);
    setUsers(u);
    setTrainers(t.filter((tr) => !tr.user));
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    try {
      await api.admin.users.create({
        fullName, email, password, role,
        trainerId: role === "TRAINER" && trainerId ? Number(trainerId) : undefined,
      });
      setFullName("");
      setEmail("");
      setPassword("");
      setRole("PARENT");
      setTrainerId("");
      refresh();
    } catch {
      setFormError("Не удалось создать пользователя — возможно, такой email уже занят");
    }
  }

  async function changeRole(id: number, newRole: string) {
    await api.admin.users.setRole(id, newRole);
    refresh();
  }

  async function toggleStatus(u: AdminUserView) {
    await api.admin.users.setStatus(u.id, u.status === "ACTIVE" ? "BLOCKED" : "ACTIVE");
    refresh();
  }

  return (
    <div>
      <form className="card admin-form" onSubmit={handleSubmit}>
        <h3>Создать пользователя вручную</h3>
        <p style={{ fontSize: 12.5, color: "var(--ink-muted)", margin: "-4px 0 8px" }}>
          Для тренера можно сразу привязать существующую карточку тренера, чтобы у него появился вход в свой кабинет.
        </p>
        <div className="admin-form__grid">
          <input required placeholder="Имя" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input required placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} />
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="PARENT">Родитель</option>
            <option value="TRAINER">Тренер</option>
            <option value="ADMIN">Администратор</option>
          </select>
          {role === "TRAINER" && (
            <select value={trainerId} onChange={(e) => setTrainerId(e.target.value)}>
              <option value="">Не привязывать к карточке тренера</option>
              {trainers.map((t) => <option key={t.id} value={t.id}>{t.fullName}</option>)}
            </select>
          )}
        </div>
        <div className="admin-form__actions">
          <button className="btn btn-primary" type="submit">Создать</button>
        </div>
        {formError && <p style={{ color: "var(--accent)", fontSize: 13, margin: 0 }}>{formError}</p>}
      </form>

      <div className="card table-wrap">
        <table>
          <thead><tr><th>Имя</th><th>Email</th><th>Роль</th><th>Статус</th><th></th></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.fullName}</td>
                <td>{u.email}</td>
                <td>
                  <select className="admin-status-select" value={u.role} onChange={(e) => changeRole(u.id, e.target.value)}>
                    {Object.entries(ROLE_LABEL).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </td>
                <td>
                  <span className="tag" style={u.status === "BLOCKED" ? { background: "#F5E6DA", color: "#A33" } : undefined}>
                    {u.status === "ACTIVE" ? "Активен" : "Заблокирован"}
                  </span>
                </td>
                <td>
                  <div className="admin-row-actions">
                    <button type="button" className={u.status === "ACTIVE" ? "danger" : ""} onClick={() => toggleStatus(u)}>
                      {u.status === "ACTIVE" ? "Заблокировать" : "Разблокировать"}
                    </button>
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
