import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PAPER_STATUS_META } from "../../constants/statuses";
import { usersApi } from "../../services/api/usersApi";
import { conferencesApi } from "../../services/api/conferencesApi";
import { papersApi } from "../../services/api/papersApi";

export default function AdminDashboardPage() {
  const [users, setUsers] = useState([]);
  const [papers, setPapers] = useState([]);
  const [conferences, setConferences] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [usersData, confsData] = await Promise.all([
        usersApi.getAll(),
        conferencesApi.getAll()
      ]);
      setUsers(usersData);
      setConferences(confsData);
      
      try {
        const papersData = await papersApi.getAll();
        setPapers(papersData);
      } catch (err) {
        console.warn("Could not fetch global papers list", err);
      }
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteConference(id) {
    if (!window.confirm("Вы уверены что хотите удалить конференцию?")) return;
    
    try {
      await conferencesApi.delete(id);
      setConferences(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      alert("Не удалось удалить конференцию");
    }
  }

  const stats = [
    { label: "Пользователи", value: users.length, icon: "👥", color: "indigo" },
    { label: "Конференции", value: conferences.length, icon: "🏛️", color: "emerald" },
    { label: "Рукописи", value: papers.length, icon: "📄", color: "teal" },
    { label: "Председатели", value: users.filter(u => u.systemRole === "chair" || (u.roles && u.roles.includes("chair"))).length, icon: "👑", color: "amber" },
  ];

  const colorStyles = {
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    teal: "bg-teal-50 text-teal-600 border-teal-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
  };

  return (
    <div className="max-w-6xl">
      {/* Заголовок */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
        <div>
          <h1 className="heading-lg mb-2">Глобальная панель</h1>
          <p className="text-slate-500 font-medium">Управление всей экосистемой академических конференций.</p>
        </div>
        <div className="flex gap-4">
          <Link to="/admin/users" className="btn-secondary h-12 text-[10px] uppercase tracking-widest px-6">
            Пользователи
          </Link>
          <Link to="/admin/conferences/create" className="btn-primary h-12 text-[10px] uppercase tracking-widest px-6">
            + Создать событие
          </Link>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat) => (
          <div key={stat.label} className={`bg-white rounded-[32px] p-8 border transition-all hover:shadow-xl hover:shadow-slate-200/50 group ${colorStyles[stat.color]}`}>
            <div className="flex items-center justify-between mb-6">
              <span className="text-3xl group-hover:scale-110 transition-transform">{stat.icon}</span>
              <span className="text-[10px] font-black uppercase tracking-widest opacity-40 italic">Система</span>
            </div>
            <p className="text-5xl font-black text-slate-900 mb-1 tracking-tighter">{stat.value}</p>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.1em]">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Список конференций */}
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-10 py-8 border-b border-slate-50">
            <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Конференции</h2>
            <Link to="/admin/conferences/create" className="text-[10px] font-black text-emerald-600 hover:text-emerald-700 uppercase tracking-widest">
              Добавить →
            </Link>
          </div>
          {conferences.length === 0 ? (
            <div className="p-12 text-center text-slate-400 font-medium">
               {loading ? "Загрузка..." : "Нет активных конференций"}
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {conferences.map((conf) => (
                <div key={conf.id} className="flex items-center justify-between px-10 py-5 hover:bg-slate-50/50 transition-colors group">
                  <div className="flex-1 min-w-0 mr-4">
                    <p className="text-sm font-black text-slate-900 truncate tracking-tight">{conf.title}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Место: {conf.venue || "—"}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link to={`/conferences/${conf.id}`} className="p-2 text-emerald-300 hover:text-emerald-600 transition-colors">👁️</Link>
                    <button 
                      onClick={() => handleDeleteConference(conf.id)}
                      className="p-2 text-rose-300 hover:text-rose-600 transition-colors"
                      title="Удалить конференцию"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Свежие рукописи */}
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-10 py-8 border-b border-slate-50">
            <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Свежие рукописи</h2>
            <Link to="/admin/papers" className="text-[10px] font-black text-emerald-600 hover:text-emerald-700 uppercase tracking-widest">
              Все работы →
            </Link>
          </div>
          {papers.length === 0 ? (
            <div className="p-12 text-center text-slate-400 font-medium">
               {loading ? "Загрузка..." : "Нет данных"}
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {[...papers].slice(-5).reverse().map((paper, i) => {
                return (
                  <div key={i} className="flex items-center justify-between px-10 py-5 hover:bg-slate-50/50 transition-colors group">
                    <div className="flex-1 min-w-0 mr-4">
                      <p className="text-sm font-black text-slate-900 truncate tracking-tight group-hover:text-emerald-600 transition-colors">{paper.title}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Автор ID: {paper.userId || paper.authorId}</p>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100 px-3 py-1 rounded-full">
                       {PAPER_STATUS_META[paper.status]?.label || paper.status}
                    </span>
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
