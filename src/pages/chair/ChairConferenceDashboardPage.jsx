import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { PAPER_STATUS, PAPER_STATUS_META } from "../../constants/statuses";
import { useAuth } from "../../hooks/useAuth";
import { ROLES } from "../../constants/roles";
import { conferencesApi } from "../../services/api/conferencesApi";
import { papersApi } from "../../services/api/papersApi";

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

export default function ChairConferenceDashboardPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [papers, setPapers] = useState([]);
  const [conference, setConference] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && user) {
      loadData();
    }
  }, [id, user]);

  async function loadData() {
    setLoading(true);
    try {
      const found = await conferencesApi.getById(id);
      
      // Security check
      const isAdmin = user?.systemRole === "admin" || (user?.roles && user.roles.includes("admin"));
      const isChair = (found.conferenceChairs || []).some(chair => 
        chair.user?.id === user.id || chair.id === user.id
      ) || found.chairmanId === user.id;

      if (!isAdmin && !isChair) {
        navigate("/403");
        return;
      }

      setConference(found);

      const papersData = await papersApi.getByConference(id);
      setPapers(papersData);
    } catch (err) {
      console.error("Failed to load data", err);
      if (err.status === 404) navigate("/404");
    } finally {
      setLoading(false);
    }
  }

  const stats = [
    { label: "Всего статей", value: papers.length, icon: "📄", color: "blue" },
    { label: "На рецензии", value: papers.filter(p => p.status === PAPER_STATUS.UNDER_REVIEW).length, icon: "🔍", color: "yellow" },
    { label: "Принято", value: papers.filter(p => p.status === PAPER_STATUS.ACCEPTED).length, icon: "✅", color: "green" },
    { label: "Отклонено", value: papers.filter(p => p.status === PAPER_STATUS.REJECTED).length, icon: "❌", color: "red" },
    { label: "Ожидают решения", value: papers.filter(p => p.status === PAPER_STATUS.SUBMITTED).length, icon: "⏳", color: "purple" },
    { label: "Доработка", value: papers.filter(p => p.status === PAPER_STATUS.REVISION).length, icon: "✏️", color: "orange" },
  ];

  const colorMap = {
    blue: "bg-blue-50 text-blue-600",
    yellow: "bg-yellow-50 text-yellow-600",
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
  };

  const recentPapers = [...papers].slice(-5).reverse();

  if (!conference) return null;

  return (
    <div>
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Кабинет председателя</h1>
          <p className="text-slate-500 mt-1 text-[10px] font-black uppercase tracking-widest">
            Конференция: <span className="text-slate-900">{conference.title}</span>
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to={`/chair/conferences/${id}/settings`}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-black uppercase tracking-widest rounded-lg transition"
          >
            Настройки
          </Link>
          <Link
            to={`/chair/conferences/${id}/papers`}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition"
          >
            Все статьи →
          </Link>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-4 ${colorMap[stat.color]}`}>
              <span className="text-xl">{stat.icon}</span>
            </div>
            <p className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Последние статьи */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-10 py-8 border-b border-slate-50">
          <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Последние заявки</h2>
          <Link to={`/chair/conferences/${id}/papers`} className="text-[10px] font-black text-emerald-600 hover:text-emerald-700 uppercase tracking-widest">
            Смотреть все →
          </Link>
        </div>

        {recentPapers.length === 0 ? (
          <div className="p-20 text-center">
            <div className="text-5xl mb-6">📭</div>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">Статей пока нет</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {recentPapers.map((paper, i) => {
              const statusMeta = PAPER_STATUS_META[paper.status] || PAPER_STATUS_META[PAPER_STATUS.SUBMITTED];
              const statusColor = statusColors[paper.status] || statusColors.submitted;
              return (
                <div key={i} className="flex items-center justify-between px-10 py-6 hover:bg-slate-50/50 transition-colors group">
                  <div>
                    <p className="text-sm font-black text-slate-900 group-hover:text-emerald-600 transition-colors tracking-tight">{paper.title}</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
                      {paper.authorName || paper.author} · {paper.submittedAt}
                    </p>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-current opacity-80 ${statusColor}`}>
                    {statusMeta.label}
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