import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

function ScoreBar({ label, value }) {
  return (
    <div>
      <div className="flex justify-between text-xs text-slate-600 mb-1">
        <span>{label}</span>
        <span className="font-semibold">{value}/10</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2">
        <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(value / 10) * 100}%` }} />
      </div>
    </div>
  );
}

export default function ChairPaperDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const articles = JSON.parse(localStorage.getItem("articles")) || [];
  const paperIndex = articles.findIndex(a => a.id === id);
  const paper = articles[paperIndex];

  const reviews = JSON.parse(localStorage.getItem("reviews")) || [];
  const paperReviews = reviews.filter(r => r.paperId === id && r.isSubmitted);

  const users = JSON.parse(localStorage.getItem("conference_cms_users")) || [];
  const reviewers = users.filter(u => u.roles?.includes("reviewer"));

  const assignments = JSON.parse(localStorage.getItem("assignments")) || [];
  const paperAssignments = assignments.filter(a => a.paperId === id);

  if (!paper) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">📄</div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Статья не найдена</h2>
        <button onClick={() => navigate("/chair/conferences/1/papers")} className="text-blue-600 hover:underline text-sm">
          Назад
        </button>
      </div>
    );
  }

  const statusMeta = PAPER_STATUS_META[paper.status] || PAPER_STATUS_META[PAPER_STATUS.SUBMITTED];
  const statusColor = statusColors[paper.status] || statusColors.submitted;

  const avgScore = paperReviews.length > 0
    ? (paperReviews.reduce((sum, r) => sum + (r.overallScore || 0), 0) / paperReviews.length).toFixed(1)
    : null;

  function handleStatusChange(newStatus) {
    const updated = [...articles];
    updated[paperIndex] = { ...updated[paperIndex], status: newStatus };
    localStorage.setItem("articles", JSON.stringify(updated));
    setMessage(`Статус изменён на "${PAPER_STATUS_META[newStatus]?.label}"`);
    setTimeout(() => setMessage(""), 3000);
  }

  function handleAssignReviewer(reviewerId) {
    const already = paperAssignments.find(a => a.reviewerId === reviewerId);
    if (already) { setMessage("Рецензент уже назначен"); return; }

    const updated = [...assignments, { paperId: id, reviewerId, assignedAt: new Date().toLocaleDateString("ru-RU") }];
    localStorage.setItem("assignments", JSON.stringify(updated));

    const updatedArticles = [...articles];
    if (updatedArticles[paperIndex].status === PAPER_STATUS.SUBMITTED) {
      updatedArticles[paperIndex] = { ...updatedArticles[paperIndex], status: PAPER_STATUS.UNDER_REVIEW };
      localStorage.setItem("articles", JSON.stringify(updatedArticles));
    }

    setMessage("Рецензент назначен!");
    setTimeout(() => setMessage(""), 3000);
    window.location.reload();
  }

  return (
    <div className="max-w-3xl">
      {/* Назад */}
      <button
        onClick={() => navigate("/chair/conferences/1/papers")}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition mb-6"
      >
        ← Назад к статьям
      </button>

      {/* Заголовок */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{paper.title}</h1>
          <p className="text-slate-500 text-sm mt-1">{paper.authorName || paper.author} · {paper.submittedAt}</p>
        </div>
        <span className={`shrink-0 px-3 py-1 rounded-full text-sm font-semibold ${statusColor}`}>
          {statusMeta.label}
        </span>
      </div>

      {/* Сообщение */}
      {message && (
        <div className="mb-6 px-4 py-3 bg-green-50 border border-green-100 text-green-700 text-sm rounded-lg">
          {message}
        </div>
      )}

      {/* Аннотация */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-4">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Аннотация</h2>
        <p className="text-sm text-slate-700 leading-relaxed">{paper.abstract || paper.description || "—"}</p>
      </div>

      {/* Назначить рецензента */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-4">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Рецензенты</h2>

        {paperAssignments.length > 0 && (
          <div className="mb-4 space-y-2">
            {paperAssignments.map((a, i) => {
              const reviewer = users.find(u => u.id === a.reviewerId);
              const hasReview = paperReviews.find(r => r.reviewerId === a.reviewerId);
              return (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{reviewer?.fullName || reviewer?.email || a.reviewerId}</p>
                    <p className="text-xs text-slate-400">Назначен: {a.assignedAt}</p>
                  </div>
                  {hasReview
                    ? <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">✅ Рецензия сдана</span>
                    : <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">⏳ Ожидается</span>
                  }
                </div>
              );
            })}
          </div>
        )}

        {reviewers.length === 0 ? (
          <p className="text-sm text-slate-400">Нет доступных рецензентов</p>
        ) : (
          <div>
            <p className="text-xs text-slate-400 mb-2">Назначить рецензента:</p>
            <div className="flex flex-wrap gap-2">
              {reviewers.map(r => {
                const assigned = paperAssignments.find(a => a.reviewerId === r.id);
                return (
                  <button
                    key={r.id}
                    onClick={() => handleAssignReviewer(r.id)}
                    disabled={!!assigned}
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {r.fullName || r.email} {assigned ? "✓" : "+"}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Рецензии */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Рецензии</h2>
          {avgScore && (
            <span className="text-sm font-bold text-blue-600">Средний балл: {avgScore}</span>
          )}
        </div>

        {paperReviews.length === 0 ? (
          <p className="text-sm text-slate-400">Рецензий пока нет</p>
        ) : (
          <div className="space-y-4">
            {paperReviews.map((review, i) => (
              <div key={i} className="border border-slate-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-slate-900">Рецензент #{i + 1}</p>
                  <span className="text-xs text-slate-400">{review.submittedAt}</span>
                </div>
                <div className="space-y-2 mb-3">
                  <ScoreBar label="Оригинальность" value={review.originalityScore || 0} />
                  <ScoreBar label="Техническое качество" value={review.technicalScore || 0} />
                  <ScoreBar label="Ясность" value={review.clarityScore || 0} />
                  <ScoreBar label="Общая оценка" value={review.overallScore || 0} />
                </div>
                {review.comments && (
                  <div className="border-t border-slate-100 pt-3">
                    <p className="text-xs font-semibold text-slate-400 mb-1">Комментарии</p>
                    <p className="text-sm text-slate-700">{review.comments}</p>
                  </div>
                )}
                {review.privateNotes && (
                  <div className="border-t border-slate-100 pt-3 mt-3">
                    <p className="text-xs font-semibold text-orange-400 mb-1">🔒 Приватные заметки</p>
                    <p className="text-sm text-slate-700">{review.privateNotes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Решение */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Принять решение</h2>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => handleStatusChange(PAPER_STATUS.ACCEPTED)}
            className="px-4 py-2.5 bg-green-50 hover:bg-green-100 text-green-700 text-sm font-semibold rounded-lg transition"
          >
            ✅ Принять
          </button>
          <button
            onClick={() => handleStatusChange(PAPER_STATUS.REVISION)}
            className="px-4 py-2.5 bg-orange-50 hover:bg-orange-100 text-orange-700 text-sm font-semibold rounded-lg transition"
          >
            ✏️ Запросить доработку
          </button>
          <button
            onClick={() => handleStatusChange(PAPER_STATUS.REJECTED)}
            className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 text-sm font-semibold rounded-lg transition"
          >
            ❌ Отклонить
          </button>
          <button
            onClick={() => handleStatusChange(PAPER_STATUS.UNDER_REVIEW)}
            className="px-4 py-2.5 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 text-sm font-semibold rounded-lg transition"
          >
            🔍 На рецензию
          </button>
        </div>
      </div>
    </div>
  );
}