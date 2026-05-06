import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { PAPER_STATUS } from "../../constants/statuses";

export default function AuthorDashboardPage() {
  const { user } = useAuth();
  
  const articles = JSON.parse(localStorage.getItem("articles")) || [];
  const myPapers = articles.filter(a => a.author === user?.email);

  const stats = [
    { 
      label: "Всего статей", 
      value: myPapers.length, 
      icon: "📄", 
      color: "emerald" 
    },
    { 
      label: "На рецензии", 
      value: myPapers.filter(a => a.status === PAPER_STATUS.UNDER_REVIEW || a.status === PAPER_STATUS.SUBMITTED).length, 
      icon: "🔍", 
      color: "amber" 
    },
    { 
      label: "Принято", 
      value: myPapers.filter(a => a.status === PAPER_STATUS.ACCEPTED).length, 
      icon: "✅", 
      color: "teal" 
    },
    { 
      label: "Отклонено", 
      value: myPapers.filter(a => a.status === PAPER_STATUS.REJECTED).length, 
      icon: "❌", 
      color: "rose" 
    },
  ];

  const colorStyles = {
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    teal: "bg-teal-50 text-teal-600 border-teal-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100",
  };

  return (
    <div className="max-w-6xl">
      {/* Приветствие */}
      <div className="mb-12">
        <h1 className="heading-lg mb-2">
          С возвращением, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">{user?.fullName?.split(' ')[0] || 'Ученый'}</span>.
        </h1>
        <p className="text-slate-500 font-medium">Отслеживайте прогресс ваших исследований и заявок.</p>
      </div>

      {/* Сетка статистики */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat) => (
          <div key={stat.label} className={`bg-white rounded-[32px] p-8 border transition-all hover:shadow-2xl hover:shadow-slate-200/50 group ${colorStyles[stat.color]}`}>
            <div className="flex items-center justify-between mb-6">
              <span className="text-3xl group-hover:scale-110 transition-transform">{stat.icon}</span>
              <span className="text-[10px] font-black uppercase tracking-widest opacity-40 italic">Статистика</span>
            </div>
            <p className="text-5xl font-black text-slate-900 mb-1 tracking-tighter">{stat.value}</p>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.1em]">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Карточки действий */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Link
          to="/papers/submit"
          className="md:col-span-2 group relative overflow-hidden bg-[#0F172A] rounded-[48px] p-12 transition-all hover:scale-[1.01] hover:shadow-2xl hover:shadow-emerald-500/10"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px] group-hover:bg-emerald-500/20 transition-colors"></div>
          
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="w-16 h-16 bg-emerald-500 rounded-[20px] flex items-center justify-center text-3xl mb-8 shadow-2xl shadow-emerald-500/40 group-hover:rotate-6 transition-transform">
                ✍️
              </div>
              <h3 className="text-4xl font-black text-white mb-4 tracking-tighter">Новая заявка</h3>
              <p className="text-slate-400 max-w-sm font-medium leading-relaxed">Готовы поделиться своими открытиями? Начните путь к публикации вашей следующей статьи прямо сейчас.</p>
            </div>
            <div className="mt-12 flex items-center gap-3 text-emerald-400 font-black text-xs uppercase tracking-[0.2em]">
              Начать процесс <span>→</span>
            </div>
          </div>
        </Link>

        <Link
          to="/papers"
          className="group bg-white border border-slate-100 rounded-[48px] p-12 transition-all hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)]"
        >
          <div className="w-16 h-16 bg-slate-50 rounded-[20px] flex items-center justify-center text-3xl mb-8 group-hover:bg-slate-900 group-hover:text-white transition-all group-hover:-rotate-3">
            📂
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tighter">Библиотека</h3>
          <p className="text-slate-500 text-sm font-medium mb-10 leading-relaxed">Управляйте всеми вашими активными и архивными рукописями.</p>
          <div className="text-slate-300 font-black text-xs uppercase tracking-[0.2em] group-hover:text-slate-900 transition-colors">
            Смотреть все <span>→</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
