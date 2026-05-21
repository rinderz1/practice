import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PAPER_STATUS_META, PAPER_STATUS } from "../../constants/statuses";
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

function ScoreBar({ label, value }) {
  const percent = (value / 10) * 100;
  return (
    <div>
      <div className="flex justify-between text-xs text-slate-600 mb-1">
        <span>{label}</span>
        <span className="font-semibold">{value}/10</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2">
        <div
          className="bg-blue-500 h-2 rounded-full transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export default function PaperReviewsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [paper, setPaper] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  async function loadData() {
    setLoading(true);
    try {
      const data = await papersApi.getById(id);
      setPaper(data);
    } catch (err) {
      console.error("Failed to load paper reviews", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest">Загрузка...</div>;

  if (!paper) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">📄</div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Статья не найдена</h2>
        <button
          onClick={() => navigate("/papers")}
          className="text-blue-600 hover:underline text-sm"
        >
          Вернуться к списку
        </button>
      </div>
    );
  }

  const paperReviews = (paper.reviews || []).filter(r => r.isSubmitted || r.status === "submitted" || true); // Assuming they are submitted if they exist here

  const statusMeta = PAPER_STATUS_META[paper.status] || PAPER_STATUS_META[PAPER_STATUS.SUBMITTED];
  const statusColor = statusColors[paper.status] || statusColors.submitted;

  const avgScore = paperReviews.length > 0
    ? (paperReviews.reduce((sum, r) => sum + (r.overallScore || 0), 0) / paperReviews.length).toFixed(1)
    : null;

  return (
    <div className="max-w-3xl">
      {/* Назад */}
      <button
        onClick={() => navigate("/papers")}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition mb-6"
      >
        ← Назад к статьям
      </button>

      {/* Заголовок */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{paper.title}</h1>
          <p className="text-slate-500 text-sm mt-1">Рецензии на вашу статью</p>
        </div>
        <span className={`shrink-0 px-3 py-1 rounded-full text-sm font-semibold ${statusColor}`}>
          {statusMeta.label}
        </span>
      </div>

      {/* Сводка */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5 text-center">
          <p className="text-3xl font-bold text-slate-900">{paperReviews.length}</p>
          <p className="text-xs text-slate-400 mt-1">Рецензий</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 text-center">
          <p className="text-3xl font-bold text-blue-600">{avgScore || "—"}</p>
          <p className="text-xs text-slate-400 mt-1">Средний балл</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 text-center">
          <p className="text-3xl font-bold text-slate-900">{statusMeta.label}</p>
          <p className="text-xs text-slate-400 mt-1">Статус</p>
        </div>
      </div>

      {/* Рецензии */}
      {paperReviews.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <div className="text-4xl mb-3">📋</div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Рецензий пока нет</h3>
          <p className="text-slate-400 text-sm">
            Рецензии появятся после того как рецензент завершит проверку
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {paperReviews.map((review, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900">Рецензент #{i + 1}</h3>
                <span className="text-sm text-slate-400">{review.submittedAt || "—"}</span>
              </div>

              {/* Оценки */}
              <div className="space-y-3 mb-5">
                <ScoreBar label="Оригинальность" value={review.originalityScore || 0} />
                <ScoreBar label="Техническое качество" value={review.technicalScore || 0} />
                <ScoreBar label="Ясность изложения" value={review.clarityScore || 0} />
                <ScoreBar label="Общая оценка" value={review.overallScore || 0} />
              </div>

              {/* Комментарии */}
              {review.comments && (
                <div className="border-t border-slate-100 pt-4">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Комментарии
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">{review.comments}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}