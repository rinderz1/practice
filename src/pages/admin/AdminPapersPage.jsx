import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PAPER_STATUS, PAPER_STATUS_META } from "../../constants/statuses";
import { papersApi } from "../../services/api/papersApi";

const statusColors = {
  [PAPER_STATUS.DRAFT]: "bg-slate-100 text-slate-600 border-slate-200",
  [PAPER_STATUS.SUBMITTED]: "bg-blue-50 text-blue-600 border-blue-100",
  [PAPER_STATUS.UNDER_REVIEW]: "bg-amber-50 text-amber-600 border-amber-100",
  [PAPER_STATUS.REVIEWED]: "bg-purple-50 text-purple-600 border-purple-100",
  [PAPER_STATUS.ACCEPTED]: "bg-emerald-50 text-emerald-600 border-emerald-100",
  [PAPER_STATUS.REJECTED]: "bg-rose-50 text-rose-600 border-rose-100",
  [PAPER_STATUS.REVISION]: "bg-orange-50 text-orange-600 border-orange-100",
};

export default function AdminPapersPage() {
  const navigate = useNavigate();
  const [papers, setPapers] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPapers();
  }, []);

  async function loadPapers() {
    setLoading(true);
    try {
      const data = await papersApi.getAll();
      setPapers(data);
    } catch (err) {
      console.error("Failed to load papers", err);
    } finally {
      setLoading(false);
    }
  }

  const filtered = filter === "all"
    ? papers
    : papers.filter(p => p.status === filter);

  const filterOptions = [
    { label: "Все", value: "all" },
    { label: "Ожидают", value: PAPER_STATUS.SUBMITTED },
    { label: "На рецензии", value: PAPER_STATUS.UNDER_REVIEW },
    { label: "Принято", value: PAPER_STATUS.ACCEPTED },
    { label: "Отклонено", value: PAPER_STATUS.REJECTED },
  ];

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="heading-lg mb-2">Все рукописи</h1>
          <p className="text-slate-500 font-medium">Глобальный мониторинг всех поданных работ в системе.</p>
        </div>
        <button 
          onClick={() => navigate("/admin/dashboard")}
          className="btn-secondary h-12 px-6 text-[10px] uppercase tracking-widest"
        >
          ← Панель
        </button>
      </div>

      <div className="flex gap-3 flex-wrap mb-10">
        {filterOptions.map(opt => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              filter === opt.value
                ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
                : "bg-white border border-slate-100 text-slate-400 hover:text-slate-900"
            }`}
          >
            {opt.label} ({opt.value === "all" ? papers.length : papers.filter(p => p.status === opt.value).length})
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Статья</th>
              <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Автор</th>
              <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Конференция</th>
              <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Статус</th>
              <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Действие</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map((paper) => {
              const statusMeta = PAPER_STATUS_META[paper.status] || { label: paper.status };
              const statusColor = statusColors[paper.status] || "bg-slate-100 text-slate-600";
              return (
                <tr key={paper.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-10 py-6 max-w-xs">
                    <p className="text-sm font-black text-slate-900 tracking-tight leading-tight group-hover:text-emerald-600 transition-colors truncate">{paper.title}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{paper.submittedAt}</p>
                  </td>
                  <td className="px-10 py-6">
                    <p className="text-xs font-bold text-slate-900">{paper.authorName || paper.author}</p>
                  </td>
                  <td className="px-10 py-6">
                    <p className="text-xs font-bold text-slate-500">{paper.conferenceName || "—"}</p>
                  </td>
                  <td className="px-10 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusColor}`}>
                      {statusMeta.label}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <Link to={`/papers/${paper.id}`} className="text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700 transition-colors">
                      Просмотр →
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-20 text-center">
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Ничего не найдено</p>
          </div>
        )}
      </div>
    </div>
  );
}
