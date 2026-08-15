import { useEffect, useState, type FormEvent } from "react";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import type { Branch, StudentView, Tariff } from "../api/types";
import "./Lk.css";

export function Lk() {
  const { user } = useAuth();
  const [students, setStudents] = useState<StudentView[] | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState("");
  const [newBranch, setNewBranch] = useState<string>("");

  async function refresh() {
    try {
      const [s, b, t] = await Promise.all([api.students.list(), api.branches(), api.tariffs()]);
      setStudents(s);
      setBranches(b);
      setTariffs(t);
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

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 900 }}>
        <span className="eyebrow">Личный кабинет</span>
        <h1>Здравствуйте, {user?.fullName}</h1>

        {error && <p>{error}</p>}

        <div className="lk-students">
          {(students ?? []).map((s) => (
            <StudentCard key={s.id} student={s} tariffs={tariffs} onPaid={refresh} />
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
      </div>
    </section>
  );
}

function StudentCard({
  student,
  tariffs,
  onPaid,
}: {
  student: StudentView;
  tariffs: Tariff[];
  onPaid: () => void;
}) {
  const activeSub = student.subscriptions
    .filter((s) => s.status === "ACTIVE")
    .sort((a, b) => b.id - a.id)[0];
  const [selectedTariff, setSelectedTariff] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "processing" | "done">("idle");

  async function handlePay() {
    if (!selectedTariff) return;
    setStatus("processing");
    // Заглушка платёжного шлюза: имитируем обработку платежа на клиенте,
    // реальная оплата (ЮKassa/Тинькофф/CloudPayments) сюда пока не подключена.
    await new Promise((resolve) => setTimeout(resolve, 1100));
    await api.payments.checkout(student.id, Number(selectedTariff));
    setStatus("done");
    onPaid();
    setTimeout(() => setStatus("idle"), 2500);
  }

  return (
    <div className="card lk-student">
      <div className="lk-student__head">
        <h3>{student.fullName}</h3>
        <span className="tag">{student.age || "возраст не указан"}</span>
      </div>
      {student.branch && <p className="lk-student__branch">{student.branch.address}</p>}

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
    </div>
  );
}
