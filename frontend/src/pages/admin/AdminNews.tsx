import { useEffect, useState, type FormEvent } from "react";
import { api } from "../../api/client";
import type { NewsPost } from "../../api/types";

const EMPTY: Partial<NewsPost> = { title: "", excerpt: "", body: "" };

export function AdminNews() {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [form, setForm] = useState<Partial<NewsPost>>(EMPTY);
  const [editingId, setEditingId] = useState<number | null>(null);

  async function refresh() {
    setPosts(await api.news());
  }

  useEffect(() => {
    refresh();
  }, []);

  function edit(post: NewsPost) {
    setEditingId(post.id);
    setForm(post);
  }

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (editingId) {
      await api.admin.news.update(editingId, form);
    } else {
      await api.admin.news.create(form);
    }
    resetForm();
    refresh();
  }

  async function remove(id: number) {
    await api.admin.news.remove(id);
    refresh();
  }

  return (
    <div>
      <form className="card admin-form" onSubmit={handleSubmit}>
        <h3>{editingId ? "Изменить новость" : "Добавить новость"}</h3>
        <input required placeholder="Заголовок" value={form.title ?? ""} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input placeholder="Краткое описание" value={form.excerpt ?? ""} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
        <textarea required placeholder="Текст новости" rows={4} value={form.body ?? ""} onChange={(e) => setForm({ ...form, body: e.target.value })} />
        <div className="admin-form__actions">
          <button className="btn btn-primary" type="submit">{editingId ? "Сохранить" : "Опубликовать"}</button>
          {editingId && <button className="btn btn-ghost" type="button" onClick={resetForm}>Отменить</button>}
        </div>
      </form>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {posts.map((p) => (
          <div key={p.id} className="card" style={{ padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
              <div>
                <p style={{ fontSize: 12, color: "var(--ink-muted)", margin: "0 0 4px" }}>
                  {new Date(p.publishedAt).toLocaleDateString("ru-RU")}
                </p>
                <h3 style={{ margin: 0 }}>{p.title}</h3>
              </div>
              <div className="admin-row-actions">
                <button type="button" onClick={() => edit(p)}>Изменить</button>
                <button type="button" className="danger" onClick={() => remove(p.id)}>Удалить</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
