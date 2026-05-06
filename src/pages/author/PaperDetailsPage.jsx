import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { PAPER_STATUS, PAPER_STATUS_META } from "../../constants/statuses";

const statusColors = {
  [PAPER_STATUS.DRAFT]: "bg-slate-100 text-slate-600 border-slate-200",
  [PAPER_STATUS.SUBMITTED]: "bg-emerald-50 text-emerald-600 border-emerald-100",
  [PAPER_STATUS.UNDER_REVIEW]: "bg-amber-50 text-amber-600 border-amber-100",
  [PAPER_STATUS.ACCEPTED]: "bg-teal-50 text-teal-600 border-teal-100",
  [PAPER_STATUS.REJECTED]: "bg-rose-50 text-rose-600 border-rose-100",
};

export default function PaperDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const articles = JSON.parse(localStorage.getItem("articles")) || [];
  const paper = articles.find(a => a.id === id);

  if (!paper) {
    return (
      <div className="bg-white rounded-[48px] border border-slate-100 p-24 text-center shadow-sm">
        <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter">Статья не найдена</h2>
        <p className="text-slate-400 mb-10 font-medium">Запрошенная рукопись не существует или была удалена.</p>
        <button onClick={() => navigate("/papers")} className="btn-primary h-16 px-10">Вернуться в библиотеку</button>
      </div>
    );
  }

  const statusMeta = PAPER_STATUS_META[paper.status] || PAPER_STATUS_META[PAPER_STATUS.SUBMITTED];
  const statusColor = statusColors[paper.status] || "bg-slate-100 text-slate-600 border-slate-200";

  return (
    <div className="max-w-6xl mx-auto pb-24 px-4">
      <button onClick={() => navigate("/papers")} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 hover:text-slate-900 transition-all mb-12">
        ← Вернуться в библиотеку
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <div className="bg-white rounded-[48px] border border-slate-100 p-12 sm:p-16 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
             
             <div className="flex items-center gap-4 mb-8">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusColor}`}>
                  {statusMeta.label}
                </span>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{paper.submittedAt}</span>
             </div>
             <h1 className="text-5xl font-black text-slate-900 leading-[1.1] mb-12 tracking-tighter">{paper.title}</h1>
             
             <div className="space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-4">Аннотация</h3>
                <p className="text-slate-600 leading-relaxed text-xl font-medium italic bg-slate-50/50 p-10 rounded-[32px] border border-slate-100 shadow-inner">
                  {paper.abstract || paper.description}
                </p>
             </div>
          </div>

          <div className="bg-[#0F172A] rounded-[48px] p-12 text-white relative overflow-hidden group shadow-2xl shadow-slate-200">
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 transition-transform duration-700 group-hover:scale-110"></div>
             <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
                <div>
                   <h3 className="text-3xl font-black mb-3 tracking-tighter">Файл рукописи</h3>
                   <p className="text-slate-400 font-medium text-lg">Загрузите полную версию статьи для ознакомления.</p>
                </div>
                <button className="h-16 px-10 bg-emerald-500 hover:bg-emerald-400 text-[#0F172A] font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl transition-all active:scale-95 shadow-xl shadow-emerald-500/20 whitespace-nowrap">
                   Скачать PDF (1.2 MB)
                </button>
             </div>
          </div>
        </div>

        <div className="space-y-8">
           <div className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 mb-8">Сведения об авторе</h3>
              <div className="flex items-center gap-5 mb-10">
                 <div className="w-16 h-16 bg-[#0F172A] rounded-[24px] flex items-center justify-center text-white font-black text-2xl shadow-2xl shadow-slate-200">
                    {paper.authorName ? paper.authorName[0] : paper.author[0]}
                 </div>
                 <div>
                    <p className="font-black text-slate-900 leading-none mb-2 text-xl tracking-tight">{paper.authorName || "Автор"}</p>
                    <p className="text-xs font-bold text-slate-400">{paper.author}</p>
                 </div>
              </div>
              <div className="pt-8 border-t border-slate-50 space-y-6">
                 <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Организация</span>
                    <span className="font-bold text-slate-900 tracking-tight">Научно-исследовательский университет</span>
                 </div>
                 <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Orcid ID</span>
                    <span className="font-bold text-slate-900 tracking-tight">0000-0002-1825-0097</span>
                 </div>
              </div>
           </div>

           <div className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 mb-8">Детали события</h3>
              <div className="space-y-6">
                 <div>
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-2">Конференция</p>
                    <p className="font-black text-slate-900 tracking-tighter text-2xl leading-tight">{paper.conferenceName || "Global Research 2025"}</p>
                 </div>
                 <div className="pt-8 border-t border-slate-50">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Статус заявки</p>
                    <p className="text-sm font-medium text-slate-500 leading-relaxed italic">
                       {paper.status === PAPER_STATUS.SUBMITTED && "Ваша рукопись успешно подана и в данный момент проходит первичную проверку."}
                       {paper.status === PAPER_STATUS.ACCEPTED && "Поздравляем! Ваша статья принята для очного доклада на конференции."}
                       {paper.status === PAPER_STATUS.REJECTED && "К сожалению, рукопись не была выбрана для текущего события."}
                       {paper.status === PAPER_STATUS.UNDER_REVIEW && "Рукопись передана внешним рецензентам для оценки качества."}
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
