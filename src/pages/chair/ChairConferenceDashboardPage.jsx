import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PAPER_STATUS, PAPER_STATUS_META } from "../../constants/statuses";

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
  const [papers, setPapers] = useState([]);

  useEffect(() => {
    const all = JSON.parse(localStorage.getItem("articles")) || [];
    setPapers(all);
  }, []);

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

  return (
    <div>
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Кабинет председателя</h1>
          <p className="text-slate-500 mt-1 text-sm">Статистика и управление конференцией</p>
        </div>
        <Link
          to="/chair/conferences/1/papers"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition"
        >
          Все статьи →
        </Link>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg mb-3 ${colorMap[stat.color]}`}>
              <span className="text-lg">{stat.icon}</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Последние статьи */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">Последние заявки</h2>
          <Link to="/chair/conferences/1/papers" className="text-sm text-blue-600 hover:underline">
            Смотреть все
          </Link>
        </div>

        {recentPapers.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-slate-500 text-sm">Статей пока нет</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentPapers.map((paper, i) => {
              const statusMeta = PAPER_STATUS_META[paper.status] || PAPER_STATUS_META[PAPER_STATUS.SUBMITTED];
              const statusColor = statusColors[paper.status] || statusColors.submitted;
              return (
                <div key={i} className="flex items-center justify-between px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{paper.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {paper.authorName || paper.author} · {paper.submittedAt}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
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