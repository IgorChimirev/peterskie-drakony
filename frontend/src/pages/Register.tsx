import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await register(fullName, email, password);
      navigate("/lk");
    } catch {
      setError("Не получилось зарегистрироваться — возможно, такой email уже занят");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 420 }}>
        <span className="eyebrow">Личный кабинет</span>
        <h1>Регистрация</h1>
        <form className="card" style={{ padding: 26, display: "flex", flexDirection: "column", gap: 14 }} onSubmit={handleSubmit}>
          <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 700, color: "var(--ink-muted)" }}>
            Ваше имя
            <input name="fullName" required value={fullName} onChange={(e) => setFullName(e.target.value)}
              style={{ padding: "11px 12px", border: "1px solid var(--line)", borderRadius: 4 }} />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 700, color: "var(--ink-muted)" }}>
            Email
            <input name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              style={{ padding: "11px 12px", border: "1px solid var(--line)", borderRadius: 4 }} />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 700, color: "var(--ink-muted)" }}>
            Пароль
            <input name="password" type="password" required minLength={4} value={password} onChange={(e) => setPassword(e.target.value)}
              style={{ padding: "11px 12px", border: "1px solid var(--line)", borderRadius: 4 }} />
          </label>
          <button className="btn btn-primary btn-block" type="submit" disabled={busy}>
            {busy ? "Создаём аккаунт…" : "Зарегистрироваться"}
          </button>
          {error && <p style={{ color: "var(--accent)", fontSize: 13, margin: 0 }}>{error}</p>}
          <p style={{ fontSize: 13, color: "var(--ink-muted)", margin: 0 }}>
            Уже есть аккаунт? <Link to="/login" style={{ color: "var(--accent)", fontWeight: 700 }}>Войти</Link>
          </p>
        </form>
      </div>
    </section>
  );
}
