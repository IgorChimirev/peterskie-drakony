import { TrialForm } from "../components/TrialForm";

export function Trial() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 560 }}>
        <span className="eyebrow">Пробное занятие</span>
        <h1>Запишитесь на бесплатное пробное занятие</h1>
        <p style={{ marginBottom: 24 }}>
          Администратор подберёт группу по возрасту и удобному филиалу и пришлёт
          расписание в течение 15 минут.
        </p>
        <TrialForm />
      </div>
    </section>
  );
}
