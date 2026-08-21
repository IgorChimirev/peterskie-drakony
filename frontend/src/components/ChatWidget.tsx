import { useEffect, useRef, useState, type FormEvent } from "react";
import { api } from "../api/client";
import type { ChatMessage } from "../api/types";
import "./ChatWidget.css";

/** Внутренний чат с клубом (без внешних мессенджеров) — обновляется по опросу раз в 4 секунды. */
export function ChatWidget() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  async function load() {
    const data = await api.chat.messages();
    setMessages(data);
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    await api.chat.send(text.trim());
    setText("");
    load();
  }

  return (
    <div className="card chat-widget">
      <h3>Чат с клубом</h3>
      <div className="chat-widget__list" ref={listRef}>
        {messages.length === 0 && <p className="chat-widget__empty">Напишите нам — ответит администратор или тренер.</p>}
        {messages.map((m) => (
          <div key={m.id} className={`chat-widget__msg ${m.sender.email === m.threadOwner.email ? "is-mine" : "is-staff"}`}>
            <span className="chat-widget__author">{m.sender.fullName}</span>
            <p>{m.text}</p>
            <span className="chat-widget__time">{new Date(m.createdAt).toLocaleString("ru-RU")}</span>
          </div>
        ))}
      </div>
      <form className="chat-widget__form" onSubmit={handleSubmit}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Написать сообщение…" />
        <button className="btn btn-primary" type="submit">Отправить</button>
      </form>
    </div>
  );
}
