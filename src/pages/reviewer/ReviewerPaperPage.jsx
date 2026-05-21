import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { PAPER_STATUS_META, PAPER_STATUS } from "../../constants/statuses";
import { papersApi } from "../../services/api/papersApi";

const statusColors = {
  submitted: "bg-blue-100 text-blue-600",
  under_review: "bg-yellow-100 text-yellow-600",
  reviewed: "bg-purple-100 text-purple-600",
  accepted: "bg-green-100 text-green-600",
  rejected: "bg-red-100 text-red-600",
};

export default function ReviewerPaperPage() {
  const { id } = useParams();
  const { user } = useAuth();
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
      console.error("Failed to load paper", err);
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
          onClick={() => navigate("/reviewer/dashboard")}
          className="text-blue-600 hover:underline text-sm"
        >
          Вернуться к списку
        </button>
      </div>
    );
  }

  const statusMeta = PAPER_STATUS_META[paper.status] || { label: paper.status };
  const statusColor = statusColors[paper.status] || statusColors.submitted;

  // Assuming reviews are part of the paper object from backend
  const myReview = (paper.reviews || []).find(r => r.reviewerId === user?.id);

  return (
    <div className="max-w-3xl">
      {/* Назад */}
      <button
        onClick={() => navigate("/reviewer/dashboard")}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition mb-6"
      >
        ← Назад к назначениям
      </button>

      {/* Заголовок */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{paper.title}</h1>
          <p className="text-slate-500 text-sm mt-1">Статья для рецензирования</p>
        </div>
        <span className={`shrink-0 px-3 py-1 rounded-full text-sm font-semibold ${statusColor}`}>
          {statusMeta.label}
        </span>
      </div>

      {/* Статус рецензии */}
      {myReview?.isSubmitted && (
        <div className="bg-green-50 border border-green-100 rounded-xl p-4 mb-6 flex items-center gap-3">
          <span className="text-2xl">✅</span>
          <div>
            <p className="font-semibold text-green-800 text-sm">Рецензия отправлена</p>
            <p className="text-green-600 text-xs mt-0.5">Вы уже завершили рецензирование этой статьи</p>
          </div>
        </div>
      )}

      {/* Информация */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-4">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Информация о статье</h2>
        <div className="space-y-3">
          <div className="flex gap-3">
            <span className="text-sm text-slate-400 w-32 shrink-0">Автор</span>
            <span className="text-sm text-slate-900">
               {/* Data is hidden for reviewers in blind review, but we show what we have */}
               {paper.authorName || "Анонимный автор"}
            </span>
          </div>
          <div className="flex gap-3">
            <span className="text-sm text-slate-400 w-32 shrink-0">Конференция</span>
            <span className="text-sm text-slate-900">{paper.conferenceName || `ID: ${paper.conferenceId}`}</span>
          </div>
          <div className="flex gap-3">
            <span className="text-sm text-slate-400 w-32 shrink-0">Дата подачи</span>
            <span className="text-sm text-slate-900">{paper.createdAt || paper.submittedAt || "—"}</span>
          </div>
          {paper.fileName && (
            <div className="flex gap-3">
              <span className="text-sm text-slate-400 w-32 shrink-0">PDF файл</span>
              <span className="text-sm text-blue-600">📄 {paper.fileName}</span>
            </div>
          )}
        </div>
      </div>

      {/* Аннотация */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Аннотация</h2>
        <p className="text-sm text-slate-700 leading-relaxed">{paper.abstractText || paper.abstract || paper.description || "—"}</p>
      </div>

      {/* Действия */}
      <div className="flex gap-3">
        {myReview?.isSubmitted ? (
          <Link
            to={`/reviewer/papers/${id}/review`}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition"
          >
            👁️ Просмотреть рецензию
          </Link>
        ) : (
          <Link
            to={`/reviewer/papers/${id}/review`}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition"
          >
            ✍️ Написать рецензию
          </Link>
        )}
        <button
          onClick={() => navigate("/reviewer/dashboard")}
          className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition"
        >
          Назад
        </button>
      </div>
    </div>
  );
}
