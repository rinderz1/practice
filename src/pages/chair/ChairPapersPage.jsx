import { useState, useEffect } from "react";
import { PAPER_STATUS, PAPER_STATUS_META } from "../../constants/statuses";

const statusColors = {
  draft: "bg-slate-100 text-slate-600",
  submitted: "bg-blue-100 text-blue-600",
  under_review: "bg-yellow-100 text-yellow-600",
  reviewed: "bg-purple-100 text-purple-600",
  accepted: "bg-green-100 text-green-600",
  rejected: "bg-red-100 text-red-600",
  revision: "bg-orange-100 text-orange-600",
  withdrawn: "bg-gray-100 text-gray-500",
};

const filterOptions = [
  { value: "all", label: "Все статьи" },
  { value: PAPER_STATUS.SUBMITTED, label: "Ожидают" },
  { value: PAPER_STATUS.UNDER_REVIEW, label: "На рецензии" },
  { value: PAPER_STATUS.ACCEPTED, label: "Принятые" },
  { value: PAPER_STATUS.REJECTED, label: "Отклонённые" },
  { value: PAPER_STATUS.REVISION, label: "Доработка" },
];

export default function ChairPapersPage() {
  const [papers, setPapers] = useState([]);
  const [filter, setFilter] = useState("all");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setPapers(JSON.parse(localStorage.getItem("articles")) || []);
  }, []);

  function savePapers(updated) {
    localStorage.setItem("articles", JSON.stringify(updated));
    setPapers(updated);
  }

  function handleStatusChange(index, newStatus) {
    const updated = [...papers];
    updated[index] = { ...updated[index], status: newStatus };
    savePapers(updated);
    setMessage(`Статус изменён на "${PAPER_STATUS_META[newStatus]?.label}"`);
    setTimeout(() => setMessage(""), 3000);
  }

  const filtered = filter === "all"
    ? papers.map((p, i) => ({ ...p, globalIndex: i }))
    : papers.map((p, i) => ({ ...p, globalIndex: i })).filter(p => p.status === filter);

  return (
    <div>
      {/* Заголовок */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Статьи конференции</h1>
        <p className="text-slate-500 mt-1 text-sm">Просматривайте заявки и принимайте решения</p>
      </div>

      {/* Сообщение */}
      {message && (
        <div className="mb-6 px-4 py-3 bg-green-50 border border-green-100 text-green-700 text-sm rounded-lg">
          {message}
        </div>
      )}

      {/* Фильтры */}
      <div className="flex gap-2 flex-wrap mb-6">
        {filterOptions.map(opt => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === opt.value
                ? "bg-blue-600 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {opt.label}
            {opt.value === "all"
              ? ` (${papers.length})`
              : ` (${papers.filter(p => p.status === opt.value).length})`
            }
          </button>
        ))}
      </div>

      {/* Список статей */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-slate-500 text-sm">Нет статей в этой категории</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((paper) => {
            const statusMeta = PAPER_STATUS_META[paper.status] || PAPER_STATUS_META[PAPER_STATUS.SUBMITTED];
            const statusColor = statusColors[paper.status] || statusColors.submitted;

            return (
              <div key={paper.globalIndex} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 mr-4">
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">{paper.title}</h3>
                    <p className="text-slate-500 text-sm line-clamp-2">{paper.abstract}</p>
                  </div>
                  <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
                    {statusMeta.label}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-400 mb-5 pb-5 border-b border-slate-100">
                  <span>👤 {paper.authorName || paper.author}</span>
                  <span>🏛️ {paper.conferenceName || "—"}</span>
                  <span>📅 {paper.submittedAt || "—"}</span>
                  {paper.fileName && <span>📄 {paper.fileName}</span>}
                </div>

                {/* Смена статуса */}
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-sm font-medium text-slate-600">Решение:</span>
                  <button
                    onClick={() => handleStatusChange(paper.globalIndex, PAPER_STATUS.UNDER_REVIEW)}
                    className="px-3 py-1.5 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-lg transition"
                  >
                    🔍 На рецензию
                  </button>
                  <button
                    onClick={() => handleStatusChange(paper.globalIndex, PAPER_STATUS.ACCEPTED)}
                    className="px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-semibold rounded-lg transition"
                  >
                    ✅ Принять
                  </button>
                  <button
                    onClick={() => handleStatusChange(paper.globalIndex, PAPER_STATUS.REVISION)}
                    className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-semibold rounded-lg transition"
                  >
                    ✏️ Доработка
                  </button>
                  <button
                    onClick={() => handleStatusChange(paper.globalIndex, PAPER_STATUS.REJECTED)}
                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-lg transition"
                  >
                    ❌ Отклонить
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}