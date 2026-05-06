import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PAPER_STATUS_META } from "../../constants/statuses";

export default function AdminDashboardPage() {
  const [users, setUsers] = useState([]);
  const [papers, setPapers] = useState([]);

  useEffect(() => {
    setUsers(JSON.parse(localStorage.getItem("conference_cms_users")) || []);
    setPapers(JSON.parse(localStorage.getItem("articles")) || []);
  }, []);

  const stats = [
    { label: "Пользователи", value: users.length, icon: "👥", color: "indigo" },
    { label: "Рукописи", value: papers.length, icon: "📄", color: "emerald" },
    { label: "Авторы", value: users.filter(u => u.roles?.includes("author")).length, icon: "✍️", color: "teal" },
    { label: "Председатели", value: users.filter(u => u.roles?.includes("chair")).length, icon: "🏛️", color: "amber" },
  ];

  const colorStyles = {
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    teal: "bg-teal-50 text-teal-600 border-teal-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
  };

  const recentUsers = [...users].slice(-5).reverse();

  return (
    <div className="max-w-6xl">
      {/* Заголовок */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
        <div>
          <h1 className="heading-lg mb-2">Панель управления</h1>
          <p className="text-slate-500 font-medium">Глобальный обзор платформы и управление ресурсами.</p>
        </div>
        <div className="flex gap-4">
          <Link to="/admin/users" className="btn-secondary h-12 text-[10px] uppercase tracking-widest px-6">
            Пользователи
          </Link>
          <Link to="/admin/conferences/create" className="btn-primary h-12 text-[10px] uppercase tracking-widest px-6">
            + Конференция
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
        {/* Последние пользователи */}
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-10 py-8 border-b border-slate-50">
            <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Новые пользователи</h2>
            <Link to="/admin/users" className="text-[10px] font-black text-emerald-600 hover:text-emerald-700 uppercase tracking-widest">
              Смотреть всех →
            </Link>
          </div>
          {recentUsers.length === 0 ? (
            <div className="p-12 text-center text-slate-400 font-medium">Нет данных</div>
          ) : (
            <div className="divide-y divide-slate-50">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-4 px-10 py-5 hover:bg-slate-50/50 transition-colors group">
                  <div className="w-12 h-12 rounded-2xl bg-[#0F172A] flex items-center justify-center text-white font-black text-sm shadow-xl shadow-slate-200 group-hover:rotate-6 transition-transform">
                    {(user.fullName || user.email)[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-slate-900 truncate tracking-tight">{user.fullName || user.email}</p>
                    <p className="text-[10px] font-bold text-slate-400 truncate uppercase tracking-widest">{user.email}</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                    {user.roles?.[0] || "—"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Последние статьи */}
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-10 py-8 border-b border-slate-50">
            <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Свежие рукописи</h2>
            <Link to="/chair/conferences/1/papers" className="text-[10px] font-black text-emerald-600 hover:text-emerald-700 uppercase tracking-widest">
              Все работы →
            </Link>
          </div>
          {papers.length === 0 ? (
            <div className="p-12 text-center text-slate-400 font-medium">Нет данных</div>
          ) : (
            <div className="divide-y divide-slate-50">
              {[...papers].slice(-5).reverse().map((paper, i) => {
                const statusMeta = PAPER_STATUS_META[paper.status];
                return (
                  <div key={i} className="flex items-center justify-between px-10 py-5 hover:bg-slate-50/50 transition-colors group">
                    <div className="flex-1 min-w-0 mr-4">
                      <p className="text-sm font-black text-slate-900 truncate tracking-tight group-hover:text-emerald-600 transition-colors">{paper.title}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{paper.authorName || paper.author}</p>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100 px-3 py-1 rounded-full group-hover:border-emerald-100 group-hover:text-emerald-600">
                       {statusMeta?.label || paper.status}
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
