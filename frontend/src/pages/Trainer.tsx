import { useEffect, useState, type FormEvent } from "react";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import type { Homework, ScheduleSlot, StudentView, Trainer as TrainerType, TournamentResult } from "../api/types";
import "./Trainer.css";

export function Trainer() {
  const { user } = useAuth();
  const [me, setMe] = useState<TrainerType | null>(null);
  const [schedule, setSchedule] = useState<ScheduleSlot[]>([]);
  const [students, setStudents] = useState<StudentView[]>([]);
  const [homework, setHomework] = useState<Homework[]>([]);
  const [results, setResults] = useState<TournamentResult[]>([]);

  const [hwStudentId, setHwStudentId] = useState("");
  const [hwDescription, setHwDescription] = useState("");
  const [hwPoints, setHwPoints] = useState(5);

  const [trStudentId, setTrStudentId] = useState("");
  const [trName, setTrName] = useState("");
  const [trPlace, setTrPlace] = useState("");
  const [trPoints, setTrPoints] = useState(10);

  async function refresh() {
    const [meRes, scheduleRes, studentsRes, homeworkRes, resultsRes] = await Promise.all([
      api.trainer.me(),
      api.trainer.schedule(),
      api.trainer.students(),
      api.trainer.homework(),
      api.trainer.tournamentResults(),
    ]);
    setMe(meRes);
    setSchedule(scheduleRes);
    setStudents(studentsRes);
    setHomework(homeworkRes);
    setResults(resultsRes);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function submitHomework(e: FormEvent) {
    e.preventDefault();
    if (!hwStudentId) return;
    await api.trainer.addHomework({ studentId: Number(hwStudentId), description: hwDescription, points: hwPoints });
    setHwDescription("");
    setHwPoints(5);
    refresh();
  }

  async function submitTournamentResult(e: FormEvent) {
    e.preventDefault();
    if (!trStudentId) return;
    await api.trainer.addTournamentResult({ studentId: Number(trStudentId), tournamentName: trName, place: trPlace, points: trPoints });
    setTrName("");
    setTrPlace("");
    setTrPoints(10);
    refresh();
  }

  return (
    <section className="section">
      <div className="container">
        <span className="eyebrow">Кабинет тренера</span>
        <h1>Здравствуйте, {user?.fullName}</h1>
        {me && <p style={{ color: "var(--ink-muted)" }}>{me.title}{me.fideRating ? ` · ${me.fideRating}` : ""}</p>}

        <h2 style={{ marginTop: 32 }}>Моё расписание</h2>
        <div className="card table-wrap">
          <table>
            <thead>
              <tr><th>Группа</th><th>Дни</th><th>Время</th><th>Филиал</th><th>Мест</th></tr>
            </thead>
            <tbody>
              {schedule.map((s) => (
                <tr key={s.id}>
                  <td>{s.groupName}</td>
                  <td>{s.dayOfWeek}</td>
                  <td>{s.timeRange}</td>
                  <td>{s.branch.address}</td>
                  <td>{s.booked}/{s.capacity}</td>
                </tr>
              ))}
              {schedule.length === 0 && (
                <tr><td colSpan={5} style={{ color: "var(--ink-muted)" }}>Пока нет назначенных групп.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <h2 style={{ marginTop: 32 }}>Мои ученики</h2>
        <div className="grid grid-3" style={{ marginBottom: 8 }}>
          {students.map((s) => (
            <div key={s.id} className="card" style={{ padding: 16 }}>
              <strong>{s.fullName}</strong>
              <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--ink-muted)" }}>
                Рейтинг: {s.ratingPoints} баллов
              </p>
            </div>
          ))}
          {students.length === 0 && <p style={{ color: "var(--ink-muted)" }}>Пока нет учеников в ваших группах.</p>}
        </div>

        <div className="grid grid-2" style={{ marginTop: 24 }}>
          <form className="card trainer-form" onSubmit={submitHomework}>
            <h3>Выставить домашнее задание</h3>
            <select required value={hwStudentId} onChange={(e) => setHwStudentId(e.target.value)}>
              <option value="">Ученик…</option>
              {students.map((s) => <option key={s.id} value={s.id}>{s.fullName}</option>)}
            </select>
            <input required placeholder="Описание задания" value={hwDescription} onChange={(e) => setHwDescription(e.target.value)} />
            <label className="trainer-form__points">
              Баллы за выполнение
              <input type="number" min={1} value={hwPoints} onChange={(e) => setHwPoints(Number(e.target.value))} />
            </label>
            <button className="btn btn-primary" type="submit">Выставить</button>
          </form>

          <form className="card trainer-form" onSubmit={submitTournamentResult}>
            <h3>Внести турнирный результат</h3>
            <select required value={trStudentId} onChange={(e) => setTrStudentId(e.target.value)}>
              <option value="">Ученик…</option>
              {students.map((s) => <option key={s.id} value={s.id}>{s.fullName}</option>)}
            </select>
            <input required placeholder="Название турнира" value={trName} onChange={(e) => setTrName(e.target.value)} />
            <input placeholder="Место (напр. 2 место)" value={trPlace} onChange={(e) => setTrPlace(e.target.value)} />
            <label className="trainer-form__points">
              Баллы в рейтинг
              <input type="number" min={1} value={trPoints} onChange={(e) => setTrPoints(Number(e.target.value))} />
            </label>
            <button className="btn btn-primary" type="submit">Сохранить</button>
          </form>
        </div>

        <h2 style={{ marginTop: 32 }}>Журнал домашних заданий</h2>
        <div className="card table-wrap">
          <table>
            <thead><tr><th>Дата</th><th>Задание</th><th>Баллы</th></tr></thead>
            <tbody>
              {homework.map((h) => (
                <tr key={h.id}>
                  <td>{new Date(h.date).toLocaleDateString("ru-RU")}</td>
                  <td>{h.description}</td>
                  <td>{h.points}</td>
                </tr>
              ))}
              {homework.length === 0 && <tr><td colSpan={3} style={{ color: "var(--ink-muted)" }}>Пока пусто.</td></tr>}
            </tbody>
          </table>
        </div>

        <h2 style={{ marginTop: 32 }}>Турнирные результаты</h2>
        <div className="card table-wrap">
          <table>
            <thead><tr><th>Дата</th><th>Турнир</th><th>Место</th><th>Баллы</th></tr></thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.id}>
                  <td>{new Date(r.date).toLocaleDateString("ru-RU")}</td>
                  <td>{r.tournamentName}</td>
                  <td>{r.place}</td>
                  <td>{r.points}</td>
                </tr>
              ))}
              {results.length === 0 && <tr><td colSpan={4} style={{ color: "var(--ink-muted)" }}>Пока пусто.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
