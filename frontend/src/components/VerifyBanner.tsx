import { useState } from "react";
import { api } from "../api/client";
import "./VerifyBanner.css";

/**
 * Верификация email/телефона — реальная отправка SMS/писем не подключена (внешние сервисы,
 * вне скоупа демо), поэтому код показывается прямо в интерфейсе вместо реальной доставки.
 */
export function VerifyBanner({
  channel,
  label,
  onVerified,
}: {
  channel: "email" | "phone";
  label: string;
  onVerified: () => void;
}) {
  const [step, setStep] = useState<"idle" | "sent">("idle");
  const [debugCode, setDebugCode] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function requestCode() {
    const res = await api.auth.requestVerification(channel);
    setDebugCode(res.debugCode);
    setStep("sent");
  }

  async function confirm() {
    try {
      await api.auth.confirmVerification(channel, code);
      onVerified();
    } catch {
      setError("Неверный код");
    }
  }

  return (
    <div className="verify-banner">
      <span>{label} не подтверждён.</span>
      {step === "idle" && (
        <button className="btn btn-ghost" type="button" onClick={requestCode}>
          Отправить код
        </button>
      )}
      {step === "sent" && (
        <div className="verify-banner__form">
          <span className="verify-banner__debug">Код (заглушка отправки, реального SMS/email нет): <b>{debugCode}</b></span>
          <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Код из 6 цифр" />
          <button className="btn btn-primary" type="button" onClick={confirm}>Подтвердить</button>
        </div>
      )}
      {error && <span className="verify-banner__error">{error}</span>}
    </div>
  );
}
