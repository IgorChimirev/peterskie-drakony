import { useApi } from "../hooks/useApi";
import { api } from "../api/client";
import { TrialForm } from "../components/TrialForm";

export function Contacts() {
  const { data: branches } = useApi(() => api.branches(), []);

  return (
    <section className="section">
      <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
        <div>
          <span className="eyebrow">Контакты</span>
          <h1>Свяжитесь с нами</h1>
          <p style={{ marginBottom: 24 }}>
            <strong>Телефон:</strong> <a href="tel:+79811474354">+7 (981) 147-43-54</a>
            <br />
            <strong>Email:</strong> <a href="mailto:info@chessdragons.ru">info@chessdragons.ru</a>
          </p>

          <h3>Филиалы</h3>
          <ul style={{ paddingLeft: 18, color: "var(--ink-muted)" }}>
            {(branches ?? []).map((b) => (
              <li key={b.id} style={{ marginBottom: 6 }}>{b.address}</li>
            ))}
          </ul>
        </div>

        <TrialForm />
      </div>
    </section>
  );
}
