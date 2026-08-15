import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("parent@example.com");
  const [password, setPassword] = useState("parent123");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const authUser = await login(email, password);
      navigate(authUser.role === "ADMIN" ? "/admin" : "/lk");
    } catch {
      setError("Неверный email или пароль");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 420 }}>
        <span className="eyebrow">Личный кабинет</span>
        <h1>Вход</h1>
        <form className="card" style={{ padding: 26, display: "flex", flexDirection: "column", gap: 14 }} onSubmit={handleSubmit}>
          <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 700, color: "var(--ink-muted)" }}>
            Email
            <input name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              style={{ padding: "11px 12px", border: "1px solid var(--line)", borderRadius: 4 }} />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 700, color: "var(--ink-muted)" }}>
            Пароль
            <input name="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              style={{ padding: "11px 12px", border: "1px solid var(--line)", borderRadius: 4 }} />
          </label>
          <button className="btn btn-primary btn-block" type="submit" disabled={busy}>
            {busy ? "Входим…" : "Войти"}
          </button>
          {error && <p style={{ color: "var(--accent)", fontSize: 13, margin: 0 }}>{error}</p>}
          <p style={{ fontSize: 13, color: "var(--ink-muted)", margin: 0 }}>
            Нет аккаунта? <Link to="/register" style={{ color: "var(--accent)", fontWeight: 700 }}>Зарегистрироваться</Link>
          </p>
          <p style={{ fontSize: 12, color: "var(--ink-muted)", margin: 0 }}>
            Демо-доступ уже подставлен: родитель — parent@example.com / parent123. Для админки — arina@chessdragons.ru / admin123.
          </p>
        </form>
      </div>
    </section>
  );
}
