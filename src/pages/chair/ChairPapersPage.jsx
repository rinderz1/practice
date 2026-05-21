import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { PAPER_STATUS, PAPER_STATUS_META } from "../../constants/statuses";
import { papersApi } from "../../services/api/papersApi";

const statusColors = {
  [PAPER_STATUS.PENDING_REVIEW]: "bg-blue-50 text-blue-600 border-blue-100",
  [PAPER_STATUS.UNDER_REVIEW]: "bg-amber-50 text-amber-600 border-amber-100",
  [PAPER_STATUS.REVISION_REQUIRED]: "bg-orange-50 text-orange-600 border-orange-100",
  [PAPER_STATUS.ACCEPTED]: "bg-emerald-50 text-emerald-600 border-emerald-100",
  [PAPER_STATUS.REJECTED]: "bg-rose-50 text-rose-600 border-rose-100",
};

export default function ChairPapersPage() {
  const { id: conferenceId } = useParams();
  const navigate = useNavigate();
  const [papers, setPapers] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPapers();
  }, [conferenceId]);

  async function loadPapers() {
    setLoading(true);
    try {
      const data = await papersApi.getByConference(conferenceId);
      setPapers(data);
    } catch (err) {
      console.error("Failed to load papers", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(paperId, newStatus) {
    try {
      await papersApi.updateStatus(paperId, newStatus);
      setPapers(prev => prev.map(p => p.id === paperId ? { ...p, status: newStatus } : p));
    } catch (err) {
      alert("Ошибка при смене статуса");
    }
  }

  const filtered = filter === "all" ? papers : papers.filter(p => p.status === filter);

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
           <button onClick={() => navigate("/chairman/dashboard")} className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-900 hover:text-white transition-all">←</button>
           <h1 className="heading-lg">Список заявок</h1>
        </div>
        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Конференция #{conferenceId}</span>
      </div>

      {loading && <p className="text-center p-10 text-slate-400 font-bold uppercase text-[10px]">Загрузка...</p>}

      {!loading && (
        <>
          <div className="flex gap-3 mb-10 overflow-x-auto pb-2">
            {["all", ...Object.values(PAPER_STATUS)].map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  filter === s ? "bg-slate-900 text-white shadow-lg" : "bg-white border border-slate-100 text-slate-400 hover:text-slate-900"
                }`}
              >
                {s === "all" ? "Все" : PAPER_STATUS_META[s]?.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6">
            {filtered.map(paper => {
              const meta = PAPER_STATUS_META[paper.status] || { label: paper.status };
              return (
                <div key={paper.id} className="bg-white rounded-[32px] border border-slate-100 p-8 hover:shadow-xl transition-all group">
                   <div className="flex items-center justify-between gap-6">
                      <div className="flex-1 min-w-0">
                         <div className="flex items-center gap-3 mb-2">
                            <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border ${statusColors[paper.status]}`}>
                               {meta.label}
                            </span>
                            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{paper.createdAt || paper.submittedAt}</span>
                         </div>
                         <h3 className="text-lg font-black text-slate-900 truncate tracking-tight">{paper.title}</h3>
                         <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Автор ID: {paper.userId || paper.authorId}</p>
                      </div>
                      <div className="flex items-center gap-4">
                         <Link to={`/chair/papers/${paper.id}`} className="px-6 py-3 bg-slate-50 text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                           Просмотр
                         </Link>
                         <button onClick={() => handleStatusChange(paper.id, PAPER_STATUS.ACCEPTED)} className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-500 hover:text-white transition-all">✓</button>
                      </div>
                   </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="p-20 text-center text-slate-300 font-black uppercase text-[10px] tracking-widest">Ничего не найдено</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
