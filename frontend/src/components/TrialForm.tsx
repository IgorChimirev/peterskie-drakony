import { useState, type FormEvent } from "react";
import { api } from "../api/client";
import "./TrialForm.css";

export function TrialForm({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [preferredBranch, setPreferredBranch] = useState("");
  const [comment, setComment] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      await api.submitLead({ childName, childAge, parentPhone, preferredBranch, comment });
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="trial-form trial-form--done card">
        <h3>Заявка отправлена</h3>
        <p>Администратор свяжется с вами в течение 15 минут и подберёт группу.</p>
      </div>
    );
  }

  return (
    <form className={`trial-form card ${compact ? "trial-form--compact" : ""}`} onSubmit={handleSubmit}>
      {!compact && <h3>Записаться на бесплатное пробное занятие</h3>}
      <div className="trial-form__row">
        <label>
          Имя ребёнка
          <input name="childName" required value={childName} onChange={(e) => setChildName(e.target.value)} placeholder="Как зовут ученика" />
        </label>
        <label>
          Возраст
          <input name="childAge" value={childAge} onChange={(e) => setChildAge(e.target.value)} placeholder="Например, 7 лет" />
        </label>
      </div>
      <div className="trial-form__row">
        <label>
          Телефон
          <input name="parentPhone" required value={parentPhone} onChange={(e) => setParentPhone(e.target.value)} placeholder="+7" />
        </label>
        <label>
          Удобный филиал
          <input name="preferredBranch" value={preferredBranch} onChange={(e) => setPreferredBranch(e.target.value)} placeholder="Например, Большая Разночинная" />
        </label>
      </div>
      {!compact && (
        <label className="trial-form__comment">
          Комментарий
          <textarea name="comment" value={comment} onChange={(e) => setComment(e.target.value)} rows={3} placeholder="Удобное время, пожелания" />
        </label>
      )}
      <button className="btn btn-primary btn-block" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Отправляем…" : "Записаться"}
      </button>
      {status === "error" && <p className="trial-form__error">Не получилось отправить, попробуйте ещё раз.</p>}
      <p className="trial-form__legal">Отправляя форму, вы соглашаетесь с обработкой персональных данных.</p>
    </form>
  );
}
