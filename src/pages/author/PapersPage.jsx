import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PAPER_STATUS, PAPER_STATUS_META } from "../../constants/statuses";
import { useAuth } from "../../hooks/useAuth";
import { papersApi } from "../../services/api/papersApi";

const statusColors = {
  [PAPER_STATUS.PENDING_REVIEW]: "bg-blue-100 text-blue-600 border-blue-100",
  [PAPER_STATUS.UNDER_REVIEW]: "bg-amber-50 text-amber-600 border-amber-100",
  [PAPER_STATUS.REVISION_REQUIRED]: "bg-orange-100 text-orange-600 border-orange-100",
  [PAPER_STATUS.ACCEPTED]: "bg-emerald-50 text-emerald-600 border-emerald-100",
  [PAPER_STATUS.REJECTED]: "bg-rose-50 text-rose-600 border-rose-100",
};

export default function PapersPage() {
  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadPapers();
    }
  }, [user?.id]);

  async function loadPapers() {
    setLoading(true);
    try {
      const data = await papersApi.getByAuthor(user.id);
      setArticles(data);
    } catch (err) {
      console.error("Failed to load author papers", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
        <div>
          <h1 className="heading-lg mb-2">Моя библиотека</h1>
          <p className="text-slate-500 font-medium">Ваш личный архив научных публикаций и текущих заявок.</p>
        </div>
        <Link to="/papers/submit" className="btn-emerald px-8 h-14 uppercase tracking-widest text-[10px] font-black">
          + Подать рукопись
        </Link>
      </div>

      {loading && <p className="text-center py-20 text-slate-400 font-bold uppercase text-[10px]">Загрузка...</p>}

      {!loading && articles.length === 0 ? (
        <div className="bg-white rounded-[48px] border border-slate-100 p-24 text-center shadow-sm">
          <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center text-4xl mx-auto mb-8">
            📄
          </div>
          <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter uppercase">Архив пуст</h3>
          <p className="text-slate-400 mb-10 max-w-sm mx-auto font-medium leading-relaxed">Начните свой научный путь, подав первую статью на одну из наших конференций.</p>
          <Link to="/papers/submit" className="btn-primary px-10 h-16">Подать первую статью</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {!loading && articles.map((article) => {
            const statusMeta = PAPER_STATUS_META[article.status] || { label: article.status };
            const statusColor = statusColors[article.status] || "bg-slate-100 text-slate-600";

            return (
              <div key={article.id} className="bg-white rounded-[40px] border border-slate-100 p-10 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.06)] transition-all group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusColor}`}>
                        {statusMeta.label}
                      </span>
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{article.createdAt || article.submittedAt}</span>
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors tracking-tighter leading-tight">{article.title}</h3>
                  </div>
                  <Link to={`/papers/${article.id}`} className="shrink-0 px-6 py-4 bg-slate-50 rounded-2xl hover:bg-slate-900 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest shadow-sm">
                    Подробнее
                  </Link>
                </div>

                <p className="text-slate-500 text-sm mb-10 leading-relaxed line-clamp-2 max-w-4xl font-medium italic">
                   "{article.abstractText || article.abstract}"
                </p>

                <div className="flex flex-wrap items-center gap-8 pt-8 border-t border-slate-50">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white text-sm font-black shadow-lg shadow-slate-200 group-hover:rotate-6 transition-transform">
                        {user?.fullName?.[0]?.toUpperCase() || "A"}
                     </div>
                     <div>
                        <p className="text-xs font-black text-slate-900 leading-none mb-1">{user?.fullName}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Автор</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">
                        📍 Конференция ID: {article.conferenceId}
                     </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
