import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { PAPER_STATUS, PAPER_STATUS_META } from "../../constants/statuses";
import { papersApi } from "../../services/api/papersApi";

export default function ChairConferenceExportPage() {
  const { id } = useParams();
  const [exported, setExported] = useState(false);
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  async function loadData() {
    setLoading(true);
    try {
      const data = await papersApi.getByConference(id);
      setPapers(data);
    } catch (err) {
      console.error("Failed to load papers for export", err);
    } finally {
      setLoading(false);
    }
  }

  const accepted = papers.filter(p => p.status === PAPER_STATUS.ACCEPTED);
  const all = papers;

  function exportCSV(data, filename) {
    if (data.length === 0) { alert("Нет данных для экспорта"); return; }

    const headers = ["Название", "Автор", "Конференция", "Статус", "Дата подачи", "Файл"];
    const rows = data.map(p => [
      `"${p.title || ""}"`,
      `"${p.authorName || p.author || p.userId || ""}"`,
      `"${p.conferenceName || p.conferenceId || ""}"`,
      `"${PAPER_STATUS_META[p.status]?.label || p.status || ""}"`,
      `"${p.submittedAt || p.createdAt || ""}"`,
      `"${p.fileName || ""}"`,
    ]);

    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    setExported(true);
    setTimeout(() => setExported(false), 3000);
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Экспорт данных</h1>
        <p className="text-slate-500 mt-1 text-sm">Выгрузка статей конференции в CSV</p>
      </div>

      {loading && <p className="mb-6 text-slate-400 font-bold uppercase text-[10px]">Загрузка данных...</p>}

      {exported && (
        <div className="mb-6 px-4 py-3 bg-green-50 border border-green-100 text-green-700 text-sm rounded-lg">
          ✅ Файл успешно скачан
        </div>
      )}

      <div className="space-y-4">
        {/* Принятые статьи */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">Принятые статьи</h3>
              <p className="text-sm text-slate-500">Только статьи со статусом "Принята"</p>
              <p className="text-2xl font-bold text-green-600 mt-2">{accepted.length}</p>
            </div>
            <button
              onClick={() => exportCSV(accepted, "accepted_papers.csv")}
              disabled={loading}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition disabled:opacity-50"
            >
              ⬇️ Скачать CSV
            </button>
          </div>
        </div>

        {/* Все статьи */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">Все статьи</h3>
              <p className="text-sm text-slate-500">Полный список всех заявок</p>
              <p className="text-2xl font-bold text-blue-600 mt-2">{all.length}</p>
            </div>
            <button
              onClick={() => exportCSV(all, "all_papers.csv")}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition disabled:opacity-50"
            >
              ⬇️ Скачать CSV
            </button>
          </div>
        </div>

        {/* Предпросмотр */}
        {!loading && accepted.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Предпросмотр принятых статей</h3>
            <div className="divide-y divide-slate-100">
              {accepted.slice(0, 5).map((p, i) => (
                <div key={i} className="py-3">
                  <p className="text-sm font-medium text-slate-900">{p.title}</p>
                  <p className="text-xs text-slate-400">{p.authorName || p.author || p.userId} · {p.submittedAt || p.createdAt}</p>
                </div>
              ))}
              {accepted.length > 5 && <p className="text-xs text-slate-400 mt-2">... и еще {accepted.length - 5}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}