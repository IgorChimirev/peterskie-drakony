import { useEffect, useRef, useState, type FormEvent } from "react";
import { api } from "../../api/client";
import type { LearningMaterial } from "../../api/types";

export function AdminMaterials() {
  const [items, setItems] = useState<LearningMaterial[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  async function refresh() {
    setItems(await api.admin.materials.list());
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await api.admin.media.upload(file);
      setFileUrl(url);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await api.admin.materials.create({ title, description, category, fileUrl });
    setTitle("");
    setDescription("");
    setCategory("");
    setFileUrl(null);
    if (fileInput.current) fileInput.current.value = "";
    refresh();
  }

  async function remove(id: number) {
    await api.admin.materials.remove(id);
    refresh();
  }

  return (
    <div>
      <form className="card admin-form" onSubmit={handleSubmit}>
        <h3>Добавить учебный материал</h3>
        <div className="admin-form__grid">
          <input required placeholder="Название" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input placeholder="Категория (напр. Разрядники)" value={category} onChange={(e) => setCategory(e.target.value)} />
          <input ref={fileInput} type="file" onChange={handleFile} />
        </div>
        <textarea placeholder="Описание" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
        {uploading && <p style={{ fontSize: 12.5, color: "var(--ink-muted)" }}>Загружаем файл…</p>}
        {fileUrl && <p style={{ fontSize: 12.5, color: "var(--accent)" }}>Файл загружен: {fileUrl}</p>}
        <div className="admin-form__actions">
          <button className="btn btn-primary" type="submit">Добавить</button>
        </div>
      </form>

      <div className="card table-wrap">
        <table>
          <thead><tr><th>Название</th><th>Категория</th><th>Файл</th><th></th></tr></thead>
          <tbody>
            {items.map((m) => (
              <tr key={m.id}>
                <td>{m.title}</td>
                <td>{m.category}</td>
                <td>{m.fileUrl ? <a href={m.fileUrl} target="_blank" rel="noreferrer">открыть</a> : <span style={{ color: "var(--ink-muted)" }}>нет</span>}</td>
                <td>
                  <div className="admin-row-actions">
                    <button type="button" className="danger" onClick={() => remove(m.id)}>Удалить</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
