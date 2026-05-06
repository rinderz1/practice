import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { PAPER_STATUS_META, PAPER_STATUS } from "../../constants/statuses";

const statusColors = {
  [PAPER_STATUS.SUBMITTED]: "bg-emerald-50 text-emerald-600 border-emerald-100",
  [PAPER_STATUS.UNDER_REVIEW]: "bg-amber-50 text-amber-600 border-amber-100",
  [PAPER_STATUS.REVIEWED]: "bg-indigo-50 text-indigo-600 border-indigo-100",
  [PAPER_STATUS.ACCEPTED]: "bg-teal-50 text-teal-600 border-teal-100",
  [PAPER_STATUS.REJECTED]: "bg-rose-50 text-rose-600 border-rose-100",
};

export default function ReviewerDashboardPage() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const allPapers = JSON.parse(localStorage.getItem("articles")) || [];
    const allAssignments = JSON.parse(localStorage.getItem("assignments")) || [];
    const myAssignmentIds = allAssignments
      .filter(a => a.reviewerId === user?.id)
      .map(a => a.paperId);
    const myPapers = allPapers.filter(p => myAssignmentIds.includes(p.id));
    setAssignments(myPapers);
  }, [user]);

  const reviews = JSON.parse(localStorage.getItem("reviews")) || [];
  const submitted = reviews.filter(r => r.reviewerId === user?.id && r.isSubmitted).length;
  const pending = assignments.length - submitted;

  return (
    <div className="max-w-6xl">
      {/* Заголовок */}
      <div className="mb-12">
        <h1 className="heading-lg mb-2">
          Добро пожаловать, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">{user?.fullName?.split(' ')[0] || 'Рецензент'}</span>.
        </h1>
        <p className="text-slate-500 font-medium">Ваши назначения и активные рецензии.</p>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
          <div className="flex items-center justify-between mb-6">
             <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl group-hover:rotate-6 transition-transform">📄</div>
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 italic">Назначено</span>
          </div>
          <p className="text-5xl font-black text-slate-900 mb-1 tracking-tighter">{assignments.length}</p>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Всего статей</p>
        </div>

        <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
          <div className="flex items-center justify-between mb-6">
             <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-2xl group-hover:rotate-6 transition-transform text-amber-600">⏳</div>
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 italic">Ожидает</span>
          </div>
          <p className="text-5xl font-black text-slate-900 mb-1 tracking-tighter">{pending}</p>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">В процессе</p>
        </div>

        <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
          <div className="flex items-center justify-between mb-6">
             <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-2xl group-hover:rotate-6 transition-transform text-emerald-600">✅</div>
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 italic">Готово</span>
          </div>
          <p className="text-5xl font-black text-slate-900 mb-1 tracking-tighter">{submitted}</p>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Завершено</p>
        </div>
      </div>

      {/* Список статей */}
      <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-8 ml-2">Текущие назначения</h2>
      
      {assignments.length === 0 ? (
        <div className="bg-white rounded-[48px] border border-slate-100 p-24 text-center shadow-sm">
          <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center text-4xl mx-auto mb-8">📭</div>
          <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter">Нет назначений</h3>
          <p className="text-slate-400 font-medium">На данный момент у вас нет статей для рецензирования.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {assignments.map((paper) => {
            const statusMeta = PAPER_STATUS_META[paper.status] || PAPER_STATUS_META[PAPER_STATUS.SUBMITTED];
            const statusColor = statusColors[paper.status] || "bg-slate-100 text-slate-600";
            const myReview = reviews.find(r => r.paperId === paper.id && r.reviewerId === user?.id);

            return (
              <div key={paper.id} className="bg-white rounded-[40px] border border-slate-100 p-10 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.06)] transition-all group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusColor}`}>
                        {statusMeta.label}
                      </span>
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{paper.submittedAt}</span>
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors tracking-tighter leading-tight mb-4">{paper.title}</h3>
                    <p className="text-slate-500 text-sm font-medium line-clamp-2 max-w-4xl">{paper.abstract}</p>
                  </div>
                  
                  <div className="shrink-0 flex flex-col gap-3">
                    {myReview?.isSubmitted ? (
                      <div className="px-6 py-4 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-emerald-100 flex items-center gap-2">
                        <span>✓</span> Рецензия отправлена
                      </div>
                    ) : (
                      <Link
                        to={`/reviewer/papers/${paper.id}/review`}
                        className="px-6 py-4 bg-[#0F172A] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-all text-center shadow-lg shadow-slate-200"
                      >
                        ✍ Написать рецензию
                      </Link>
                    )}
                    <Link
                      to={`/reviewer/papers/${paper.id}`}
                      className="px-6 py-4 bg-white border border-slate-200 text-[#0F172A] text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-50 transition-all text-center"
                    >
                      📖 Читать статью
                    </Link>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-8 pt-8 mt-8 border-t border-slate-50">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 text-sm font-black shadow-inner">
                        {paper.authorName ? paper.authorName[0] : paper.author[0]}
                     </div>
                     <div>
                        <p className="text-xs font-black text-slate-900 leading-none mb-1">{paper.authorName || paper.author}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Автор</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">
                        📍 {paper.conferenceName || "Global Event"}
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
