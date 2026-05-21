import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { PAPER_STATUS, PAPER_STATUS_META } from "../../constants/statuses";
import { conferencesApi } from "../../services/api/conferencesApi";
import { papersApi } from "../../services/api/papersApi";
import { usersApi } from "../../services/api/usersApi";

const statusColors = {
  [PAPER_STATUS.PENDING_REVIEW]: "bg-blue-100 text-blue-600",
  [PAPER_STATUS.UNDER_REVIEW]: "bg-yellow-100 text-yellow-600",
  [PAPER_STATUS.REVISION_REQUIRED]: "bg-orange-100 text-orange-600",
  [PAPER_STATUS.ACCEPTED]: "bg-green-100 text-green-600",
  [PAPER_STATUS.REJECTED]: "bg-red-100 text-red-600",
};

export default function ChairmanDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [conferences, setConferences] = useState([]);
  const [selectedConf, setSelectedConf] = useState(null);
  const [papers, setPapers] = useState([]);
  const [reviewers, setReviewers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadConferences();
  }, [user.id]);

  async function loadConferences() {
    setLoading(true);
    try {
      const all = await conferencesApi.getAll();
      const myConfs = all.filter(c => 
        (c.conferenceChairs || []).some(chair => chair.user?.id == user.id)
      );
      setConferences(myConfs);
      if (myConfs.length > 0) {
        setSelectedConf(myConfs[0]);
      }
    } catch (err) {
      console.error("Failed to load conferences", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (selectedConf) {
      loadConferenceData();
    }
  }, [selectedConf]);

  async function loadConferenceData() {
    try {
      const [papersData, usersData] = await Promise.all([
        papersApi.getByConference(selectedConf.id),
        usersApi.getAll()
      ]);
      setPapers(papersData);
      // Backend spec doesn't specify how reviewers are linked to conferences in detail, 
      // but assuming they have 'reviewer' role and are in reviewerIds list of the conference.
      const confReviewers = usersData.filter(u => 
        u.systemRole === "reviewer" && (selectedConf.reviewerIds || []).includes(u.id)
      );
      setReviewers(confReviewers);
    } catch (err) {
      console.error("Failed to load conference data", err);
    }
  }

  async function handleFinalDecision(paperId, decision) {
    try {
      await papersApi.updateStatus(paperId, decision);
      setPapers(prev => prev.map(p => p.id === paperId ? { ...p, status: decision } : p));
    } catch (err) {
      alert("Не удалось обновить статус статьи: " + (err.message || "Ошибка сервера"));
    }
  }

  if (loading) return <div className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest">Загрузка...</div>;

  if (conferences.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center text-4xl mb-8">
          🏛️
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter">Вам пока не назначена конференция</h2>
        <p className="text-slate-500 max-w-sm mx-auto font-medium leading-relaxed mb-10">
          Свяжитесь с администратором системы для получения прав на управление конференцией.
        </p>
        <Link to="/" className="btn-primary px-10 h-16">Вернуться на главную</Link>
      </div>
    );
  }

  const stats = [
    { label: "Всего статей", value: papers.length, icon: "📄", color: "indigo" },
    { label: "Рецензенты", value: reviewers.length, icon: "👥", color: "emerald" },
    { label: "На рецензии", value: papers.filter(p => p.status === PAPER_STATUS.UNDER_REVIEW).length, icon: "🔍", color: "amber" },
    { label: "Принято", value: papers.filter(p => p.status === PAPER_STATUS.ACCEPTED).length, icon: "✅", color: "teal" },
  ];

  const colorStyles = {
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    teal: "bg-teal-50 text-teal-600 border-teal-100",
  };

  return (
    <div className="max-w-6xl">
      {/* Селектор конференций */}
      {conferences.length > 1 && (
        <div className="flex gap-3 mb-12 overflow-x-auto pb-4">
          {conferences.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedConf(c)}
              className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                selectedConf?.id === c.id
                  ? "bg-[#0F172A] text-white shadow-xl shadow-slate-200"
                  : "bg-white border border-slate-100 text-slate-400 hover:text-slate-900"
              }`}
            >
              {c.title}
            </button>
          ))}
        </div>
      )}

      {/* Заголовок */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
        <div>
          <h1 className="heading-lg mb-2">{selectedConf?.title}</h1>
          <p className="text-slate-500 font-medium uppercase text-[10px] tracking-widest">
            Кабинет председателя
          </p>
        </div>
        <div className="flex gap-4">
          <Link to={`/chair/conferences/${selectedConf?.id}/settings`} className="btn-secondary h-12 text-[10px] uppercase tracking-widest px-6">
            Настройки
          </Link>
          <Link to={`/chair/conferences/${selectedConf?.id}/papers`} className="btn-primary h-12 text-[10px] uppercase tracking-widest px-6">
            Все статьи
          </Link>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat) => (
          <div key={stat.label} className={`bg-white rounded-[32px] p-8 border transition-all hover:shadow-xl hover:shadow-slate-200/50 group ${colorStyles[stat.color]}`}>
            <div className="flex items-center justify-between mb-6">
              <span className="text-3xl group-hover:scale-110 transition-transform">{stat.icon}</span>
              <span className="text-[10px] font-black uppercase tracking-widest opacity-40 italic">Конференция</span>
            </div>
            <p className="text-5xl font-black text-slate-900 mb-1 tracking-tighter">{stat.value}</p>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.1em]">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-10">
        {/* Список статей с управлением */}
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-10 py-8 border-b border-slate-50">
            <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Управление заявками</h2>
            <div className="flex gap-4">
               <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Всего: {papers.length}</span>
            </div>
          </div>
          {papers.length === 0 ? (
            <div className="p-20 text-center">
              <span className="text-5xl mb-6 block">📭</span>
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Статей пока нет</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {papers.map((paper) => {
                const statusMeta = PAPER_STATUS_META[paper.status] || { label: paper.status };
                const statusColor = statusColors[paper.status] || "bg-slate-100 text-slate-600";

                return (
                  <div key={paper.id} className="p-10 hover:bg-slate-50/50 transition-colors group">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-4 mb-3">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-current opacity-80 ${statusColor}`}>
                            {statusMeta.label}
                          </span>
                          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Автор ID: {paper.userId || paper.authorId}</span>
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-2 truncate tracking-tight group-hover:text-emerald-600 transition-colors">
                          {paper.title}
                        </h3>
                        <p className="text-slate-500 text-sm line-clamp-1 font-medium italic">{paper.abstractText || paper.abstract}</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        {paper.status === PAPER_STATUS.UNDER_REVIEW && (
                          <div className="flex gap-2">
                             <button
                                onClick={() => handleFinalDecision(paper.id, PAPER_STATUS.ACCEPTED)}
                                className="px-6 py-3 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                             >
                                ✅ Принять
                             </button>
                             <button
                                onClick={() => handleFinalDecision(paper.id, PAPER_STATUS.REVISION_REQUIRED)}
                                className="px-6 py-3 bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-orange-600 hover:text-white transition-all shadow-sm"
                             >
                                ✏️ Доработка
                             </button>
                             <button
                                onClick={() => handleFinalDecision(paper.id, PAPER_STATUS.REJECTED)}
                                className="px-6 py-3 bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                             >
                                ❌ Отклонить
                             </button>
                          </div>
                        )}

                        <Link
                          to={`/chair/papers/${paper.id}`}
                          className="px-6 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all shadow-sm"
                        >
                          Детали →
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
