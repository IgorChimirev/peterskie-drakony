import { useEffect, useState } from "react";
import { api } from "../../api/client";
import type { BackupFile } from "../../api/types";

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} Б`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`;
  return `${(bytes / 1024 / 1024).toFixed(2)} МБ`;
}

export function AdminBackup() {
  const [backups, setBackups] = useState<BackupFile[]>([]);
  const [creating, setCreating] = useState(false);

  async function refresh() {
    setBackups(await api.admin.backup.list());
  }

  useEffect(() => {
    refresh();
  }, []);

  async function createBackup() {
    setCreating(true);
    try {
      await api.admin.backup.create();
      await refresh();
    } finally {
      setCreating(false);
    }
  }

  return (
    <div>
      <div className="card" style={{ padding: 20, marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h3 style={{ margin: "0 0 4px" }}>Резервное копирование</h3>
          <p style={{ margin: 0, fontSize: 13, color: "var(--ink-muted)" }}>
            Создаёт реальный локальный снимок базы данных (команда H2 <code>BACKUP TO</code>).
          </p>
        </div>
        <button className="btn btn-primary" type="button" onClick={createBackup} disabled={creating}>
          {creating ? "Создаём…" : "Создать резервную копию"}
        </button>
      </div>

      <div className="card table-wrap">
        <table>
          <thead><tr><th>Файл</th><th>Размер</th><th>Дата</th></tr></thead>
          <tbody>
            {backups.map((b) => (
              <tr key={b.name}>
                <td>{b.name}</td>
                <td>{formatSize(b.sizeBytes)}</td>
                <td>{new Date(b.createdAtEpochMs).toLocaleString("ru-RU")}</td>
              </tr>
            ))}
            {backups.length === 0 && <tr><td colSpan={3} style={{ color: "var(--ink-muted)" }}>Резервных копий пока нет.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
