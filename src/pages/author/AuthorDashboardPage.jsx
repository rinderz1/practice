import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { PAPER_STATUS, PAPER_STATUS_META } from "../../constants/statuses";
import { papersApi } from "../../services/api/papersApi";

export default function AuthorDashboardPage() {
  const { user } = useAuth();
  const [myPapers, setMyPapers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadData();
    }
  }, [user?.id]);

  async function loadData() {
    setLoading(true);
    try {
      const data = await papersApi.getByAuthor(user.id);
      setMyPapers(data);
    } catch (err) {
      console.error("Failed to load author dashboard data", err);
    } finally {
      setLoading(false);
    }
  }

  const stats = [
    { 
      label: "Всего статей", 
      value: myPapers.length, 
      icon: "📄", 
      color: "emerald" 
    },
    { 
      label: "На проверке", 
      value: myPapers.filter(a => a.status === PAPER_STATUS.PENDING_REVIEW || a.status === PAPER_STATUS.UNDER_REVIEW).length, 
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
      label: "Доработка", 
      value: myPapers.filter(a => a.status === PAPER_STATUS.REVISION_REQUIRED).length, 
      icon: "✏️", 
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
      <div className="flex flex-col lg:flex-row justify-between gap-10 mb-12">
        <div>
          <h1 className="heading-lg mb-2">
            С возвращением, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">{user?.fullName?.split(' ')[0] || 'Ученый'}</span>.
          </h1>
          <p className="text-slate-500 font-medium">Отслеживайте прогресс ваших исследований и заявок.</p>
        </div>

        {/* Уведомления (Mocked for now as API not available) */}
        <div className="lg:w-80 shrink-0">
           <div className="bg-white rounded-[32px] border border-slate-100 p-6 shadow-sm overflow-hidden h-full">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 px-2">Система</h3>
              <p className="text-[10px] text-slate-300 italic px-2">Уведомления будут доступны в следующей версии API</p>
           </div>
        </div>
      </div>

      {loading && <p className="p-10 text-center text-slate-400 font-bold uppercase tracking-widest">Загрузка данных...</p>}

      {/* Сетка статистики */}
      {!loading && (
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
      )}

      {/* Карточки действий */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
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

      {/* Мои статьи мини-список */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
         <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Последние статьи</h2>
            <Link to="/papers" className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Все работы →</Link>
         </div>
         {!loading && myPapers.length === 0 ? (
           <div className="p-20 text-center text-slate-400 text-sm font-medium italic">Вы еще не подали ни одной статьи</div>
         ) : (
           <div className="divide-y divide-slate-50">
             {myPapers.slice(0, 3).map(paper => {
               const meta = PAPER_STATUS_META[paper.status] || { label: paper.status };
               return (
                 <div key={paper.id} className="p-8 hover:bg-slate-50 transition-colors flex items-center justify-between">
                    <div>
                       <p className="text-sm font-black text-slate-900 mb-1">{paper.title}</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Конференция ID: {paper.conferenceId} · {paper.createdAt || paper.submittedAt}</p>
                    </div>
                    <span className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-600">
                       {meta.label}
                    </span>
                 </div>
               );
             })}
           </div>
         )}
      </div>
    </div>
  );
}
