import { useState } from "react";
import { Link } from "react-router-dom";
import { PAPER_STATUS, PAPER_STATUS_META } from "../../constants/statuses";
import { useAuth } from "../../hooks/useAuth";

const statusColors = {
  [PAPER_STATUS.DRAFT]: "bg-slate-100 text-slate-600 border-slate-200",
  [PAPER_STATUS.SUBMITTED]: "bg-emerald-50 text-emerald-600 border-emerald-100",
  [PAPER_STATUS.UNDER_REVIEW]: "bg-amber-50 text-amber-600 border-amber-100",
  [PAPER_STATUS.ACCEPTED]: "bg-teal-50 text-teal-600 border-teal-100",
  [PAPER_STATUS.REJECTED]: "bg-rose-50 text-rose-600 border-rose-100",
  [PAPER_STATUS.REVISION]: "bg-indigo-50 text-indigo-600 border-indigo-100",
};

export default function PapersPage() {
  const { user } = useAuth();
  const [articles, setArticles] = useState(JSON.parse(localStorage.getItem("articles")) || []);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const myPapers = articles
    .map((a, i) => ({ ...a, globalIndex: i }))
    .filter((a) => a.author === user?.email);

  function handleSave(index) {
    const updated = [...articles];
    updated[index] = { ...updated[index], title: editTitle, abstract: editDescription };
    localStorage.setItem("articles", JSON.stringify(updated));
    setArticles(updated);
    setEditingIndex(null);
  }

  return (
    <div className="max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
        <div>
          <h1 className="heading-lg mb-2">Мои рукописи</h1>
          <p className="text-slate-500 font-medium">Управляйте своими научными работами и отслеживайте их статус.</p>
        </div>
        <Link to="/papers/submit" className="btn-emerald px-8 h-14 uppercase tracking-widest text-xs">
          + Новая статья
        </Link>
      </div>

      {myPapers.length === 0 ? (
        <div className="bg-white rounded-[48px] border border-slate-100 p-24 text-center shadow-sm">
          <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center text-4xl mx-auto mb-8">
            📄
          </div>
          <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter">Нет активных заявок</h3>
          <p className="text-slate-400 mb-10 max-w-sm mx-auto font-medium leading-relaxed">Начните свой научный путь, подав первую статью на одну из наших конференций.</p>
          <Link to="/papers/submit" className="btn-primary px-10 h-16">Подать первую статью</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {myPapers.map((article) => {
            const idx = article.globalIndex;
            const statusMeta = PAPER_STATUS_META[article.status] || PAPER_STATUS_META[PAPER_STATUS.SUBMITTED];
            const statusColor = statusColors[article.status] || "bg-slate-100 text-slate-600";

            return (
              <div key={idx} className="bg-white rounded-[40px] border border-slate-100 p-10 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.06)] transition-all group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                {editingIndex === idx ? (
                  <div className="space-y-8">
                    <div>
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-2 block">Название статьи</label>
                       <input value={editTitle} onChange={e => setEditTitle(e.target.value)} className="input-field font-bold text-lg" />
                    </div>
                    <div>
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-2 block">Аннотация</label>
                       <textarea value={editDescription} onChange={e => setEditDescription(e.target.value)} rows={6} className="input-field resize-none leading-relaxed" />
                    </div>
                    <div className="flex gap-4">
                      <button onClick={() => handleSave(idx)} className="btn-primary px-10 h-14">Сохранить</button>
                      <button onClick={() => setEditingIndex(null)} className="btn-secondary px-10 h-14">Отмена</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusColor}`}>
                            {statusMeta.label}
                          </span>
                          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{article.submittedAt}</span>
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors tracking-tighter leading-tight">{article.title}</h3>
                      </div>
                      <Link to={`/papers/${article.id}`} className="shrink-0 px-6 py-4 bg-slate-50 rounded-2xl hover:bg-slate-900 hover:text-white transition-all text-xs font-black uppercase tracking-widest shadow-sm">
                        Подробнее
                      </Link>
                    </div>

                    <p className="text-slate-500 text-sm mb-10 leading-relaxed line-clamp-2 max-w-4xl font-medium">
                      {article.abstract || article.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-8 pt-8 border-t border-slate-50">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white text-sm font-black shadow-lg shadow-slate-200">
                            {article.authorName ? article.authorName[0] : article.author[0]}
                         </div>
                         <div>
                            <p className="text-xs font-black text-slate-900 leading-none mb-1">{article.authorName || article.author}</p>
                            <p className="text-[10px] font-bold text-slate-400">Основной автор</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-2">
                         <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">
                            📍 {article.conferenceName || "Global Event"}
                         </span>
                      </div>
                      <div className="flex-1"></div>
                      <div className="flex gap-6 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => { setEditingIndex(idx); setEditTitle(article.title); setEditDescription(article.abstract || article.description); }} className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 hover:text-slate-900 transition-colors">Изменить</button>
                         <button onClick={() => { if(confirm("Удалить рукопись?")) { const updated = articles.filter((_, i) => i !== idx); localStorage.setItem("articles", JSON.stringify(updated)); setArticles(updated); } }} className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-200 hover:text-rose-500 transition-colors">Удалить</button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
