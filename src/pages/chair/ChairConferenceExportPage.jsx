import { useState } from "react";
import { PAPER_STATUS, PAPER_STATUS_META } from "../../constants/statuses";

export default function ChairConferenceExportPage() {
  const [exported, setExported] = useState(false);

  const papers = JSON.parse(localStorage.getItem("articles")) || [];
  const accepted = papers.filter(p => p.status === PAPER_STATUS.ACCEPTED);
  const all = papers;

  function exportCSV(data, filename) {
    if (data.length === 0) { alert("Нет данных для экспорта"); return; }

    const headers = ["Название", "Автор", "Конференция", "Статус", "Дата подачи", "Файл"];
    const rows = data.map(p => [
      `"${p.title || ""}"`,
      `"${p.authorName || p.author || ""}"`,
      `"${p.conferenceName || ""}"`,
      `"${PAPER_STATUS_META[p.status]?.label || p.status || ""}"`,
      `"${p.submittedAt || ""}"`,
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
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition"
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
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition"
            >
              ⬇️ Скачать CSV
            </button>
          </div>
        </div>

        {/* Предпросмотр */}
        {accepted.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Предпросмотр принятых статей</h3>
            <div className="divide-y divide-slate-100">
              {accepted.map((p, i) => (
                <div key={i} className="py-3">
                  <p className="text-sm font-medium text-slate-900">{p.title}</p>
                  <p className="text-xs text-slate-400">{p.authorName || p.author} · {p.submittedAt}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}