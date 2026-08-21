import { useEffect, useState, type FormEvent } from "react";
import { api } from "../../api/client";
import type { ChatMessage } from "../../api/types";
import "./AdminChat.css";

export function AdminChat() {
  const [threads, setThreads] = useState<{ id: number; fullName: string; email: string }[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");

  async function loadThreads() {
    const t = await api.admin.chat.threads();
    setThreads(t);
    if (!activeId && t.length > 0) setActiveId(t[0].id);
  }

  async function loadMessages(id: number) {
    setMessages(await api.admin.chat.messages(id));
  }

  useEffect(() => {
    loadThreads();
  }, []);

  useEffect(() => {
    if (activeId) loadMessages(activeId);
  }, [activeId]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!activeId || !text.trim()) return;
    await api.admin.chat.reply(activeId, text.trim());
    setText("");
    loadMessages(activeId);
  }

  const activeThread = threads.find((t) => t.id === activeId);

  return (
    <div className="admin-chat">
      <div className="card admin-chat__threads">
        <h3 style={{ padding: "16px 16px 8px" }}>Диалоги</h3>
        {threads.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`admin-chat__thread ${t.id === activeId ? "is-active" : ""}`}
            onClick={() => setActiveId(t.id)}
          >
            <strong>{t.fullName}</strong>
            <span>{t.email}</span>
          </button>
        ))}
        {threads.length === 0 && <p style={{ padding: 16, color: "var(--ink-muted)", fontSize: 13.5 }}>Сообщений пока нет.</p>}
      </div>

      <div className="card admin-chat__conversation">
        {activeThread ? (
          <>
            <h3 style={{ padding: "16px 16px 8px" }}>{activeThread.fullName}</h3>
            <div className="admin-chat__messages">
              {messages.map((m) => (
                <div key={m.id} className={`admin-chat__msg ${m.sender.email === activeThread.email ? "is-parent" : "is-staff"}`}>
                  <span className="admin-chat__author">{m.sender.fullName}</span>
                  <p>{m.text}</p>
                  <span className="admin-chat__time">{new Date(m.createdAt).toLocaleString("ru-RU")}</span>
                </div>
              ))}
              {messages.length === 0 && <p style={{ color: "var(--ink-muted)", fontSize: 13.5 }}>Переписки пока нет.</p>}
            </div>
            <form className="admin-chat__form" onSubmit={handleSubmit}>
              <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Ответить…" />
              <button className="btn btn-primary" type="submit">Отправить</button>
            </form>
          </>
        ) : (
          <p style={{ padding: 16, color: "var(--ink-muted)" }}>Выберите диалог слева.</p>
        )}
      </div>
    </div>
  );
}
