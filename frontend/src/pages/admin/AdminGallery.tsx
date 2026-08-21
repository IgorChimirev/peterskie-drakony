import { useEffect, useRef, useState, type FormEvent } from "react";
import { api } from "../../api/client";
import type { GalleryItem } from "../../api/types";

export function AdminGallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [title, setTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  async function refresh() {
    setItems(await api.admin.gallery.list());
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
      setImageUrl(url);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await api.admin.gallery.create({ title, eventDate, imageUrl });
    setTitle("");
    setEventDate("");
    setImageUrl(null);
    if (fileInput.current) fileInput.current.value = "";
    refresh();
  }

  async function remove(id: number) {
    await api.admin.gallery.remove(id);
    refresh();
  }

  return (
    <div>
      <form className="card admin-form" onSubmit={handleSubmit}>
        <h3>Добавить фото в галерею</h3>
        <div className="admin-form__grid">
          <input required placeholder="Подпись" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input required type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
          <input ref={fileInput} type="file" accept="image/*" onChange={handleFile} />
        </div>
        {uploading && <p style={{ fontSize: 12.5, color: "var(--ink-muted)" }}>Загружаем файл…</p>}
        {imageUrl && <p style={{ fontSize: 12.5, color: "var(--accent)" }}>Файл загружен: {imageUrl}</p>}
        <div className="admin-form__actions">
          <button className="btn btn-primary" type="submit">Добавить</button>
        </div>
      </form>

      <div className="grid grid-4">
        {items.map((g) => (
          <div key={g.id} className="card" style={{ padding: 0, overflow: "hidden" }}>
            {g.imageUrl ? (
              <img src={g.imageUrl} alt={g.title} style={{ width: "100%", height: 120, objectFit: "cover", display: "block" }} />
            ) : (
              <div style={{ width: "100%", height: 120, background: "var(--surface-alt)" }} />
            )}
            <div style={{ padding: 10 }}>
              <strong style={{ fontSize: 13 }}>{g.title}</strong>
              <div className="admin-row-actions" style={{ marginTop: 6 }}>
                <button type="button" className="danger" onClick={() => remove(g.id)}>Удалить</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
