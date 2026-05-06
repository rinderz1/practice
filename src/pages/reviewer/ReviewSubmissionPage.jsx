import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { PAPER_STATUS } from "../../constants/statuses";

function ScoreInput({ label, description, value, onChange }) {
  return (
    <div className="bg-slate-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-sm font-medium text-slate-700">{label}</p>
          <p className="text-xs text-slate-400">{description}</p>
        </div>
        <span className="text-2xl font-bold text-blue-600 w-12 text-center">{value}</span>
      </div>
      <input
        type="range"
        min="1"
        max="10"
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-blue-600"
      />
      <div className="flex justify-between text-xs text-slate-400 mt-1">
        <span>1 — Слабо</span>
        <span>10 — Отлично</span>
      </div>
    </div>
  );
}

export default function ReviewSubmissionPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const articles = JSON.parse(localStorage.getItem("articles")) || [];
  const paper = articles.find(a => a.id === id);

  const reviews = JSON.parse(localStorage.getItem("reviews")) || [];
  const existingReview = reviews.find(r => r.paperId === id && r.reviewerId === user?.id);

  const [originalityScore, setOriginalityScore] = useState(existingReview?.originalityScore || 5);
  const [technicalScore, setTechnicalScore] = useState(existingReview?.technicalScore || 5);
  const [clarityScore, setClarityScore] = useState(existingReview?.clarityScore || 5);
  const [overallScore, setOverallScore] = useState(existingReview?.overallScore || 5);
  const [comments, setComments] = useState(existingReview?.comments || "");
  const [privateNotes, setPrivateNotes] = useState(existingReview?.privateNotes || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!paper) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">📄</div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Статья не найдена</h2>
        <button onClick={() => navigate("/reviewer/dashboard")} className="text-blue-600 hover:underline text-sm">
          Назад
        </button>
      </div>
    );
  }

  async function handleSubmit(e, isDraft = false) {
    e.preventDefault();
    if (!isDraft && comments.trim().length < 20) {
      setError("Комментарий слишком короткий (минимум 20 символов)");
      return;
    }

    setLoading(true);
    setError("");
    await new Promise(r => setTimeout(r, 600));

    const newReview = {
      id: existingReview?.id || Date.now().toString(),
      paperId: id,
      reviewerId: user?.id,
      reviewerName: user?.fullName || user?.email,
      originalityScore,
      technicalScore,
      clarityScore,
      overallScore,
      comments,
      privateNotes,
      isSubmitted: !isDraft,
      submittedAt: !isDraft ? new Date().toLocaleDateString("ru-RU") : null,
    };

    const updatedReviews = reviews.filter(r => !(r.paperId === id && r.reviewerId === user?.id));
    updatedReviews.push(newReview);
    localStorage.setItem("reviews", JSON.stringify(updatedReviews));

    // Обновляем статус статьи если рецензия отправлена
    if (!isDraft) {
      const updatedArticles = articles.map(a =>
        a.id === id ? { ...a, status: PAPER_STATUS.REVIEWED } : a
      );
      localStorage.setItem("articles", JSON.stringify(updatedArticles));
    }

    setLoading(false);
    navigate("/reviewer/dashboard");
  }

  return (
    <div className="max-w-2xl">
      {/* Назад */}
      <button
        onClick={() => navigate(`/reviewer/papers/${id}`)}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition mb-6"
      >
        ← Назад к статье
      </button>

      {/* Заголовок */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Написать рецензию</h1>
        <p className="text-slate-500 text-sm mt-1">{paper.title}</p>
      </div>

      {/* Уже отправлена */}
      {existingReview?.isSubmitted && (
        <div className="bg-green-50 border border-green-100 rounded-xl p-4 mb-6">
          <p className="text-green-700 text-sm font-medium">✅ Рецензия уже отправлена — вы можете только просмотреть её</p>
        </div>
      )}

      <form className="space-y-6">
        {/* Оценки */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Оценки</h2>
          <div className="space-y-4">
            <ScoreInput
              label="Оригинальность"
              description="Насколько работа вносит новый вклад"
              value={originalityScore}
              onChange={setOriginalityScore}
            />
            <ScoreInput
              label="Техническое качество"
              description="Корректность методов и результатов"
              value={technicalScore}
              onChange={setTechnicalScore}
            />
            <ScoreInput
              label="Ясность изложения"
              description="Структура, язык и читабельность"
              value={clarityScore}
              onChange={setClarityScore}
            />
            <ScoreInput
              label="Общая оценка"
              description="Итоговая оценка работы"
              value={overallScore}
              onChange={setOverallScore}
            />
          </div>

          {/* Средний балл */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg text-center">
            <p className="text-xs text-slate-500">Средний балл</p>
            <p className="text-2xl font-bold text-blue-600">
              {((originalityScore + technicalScore + clarityScore + overallScore) / 4).toFixed(1)}
            </p>
          </div>
        </div>

        {/* Комментарии */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Комментарии</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Публичные комментарии <span className="text-red-500">*</span>
              </label>
              <textarea
                value={comments}
                onChange={e => setComments(e.target.value)}
                disabled={existingReview?.isSubmitted}
                placeholder="Подробные комментарии для автора (минимум 20 символов)"
                rows={5}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm resize-none disabled:bg-slate-50 disabled:text-slate-400"
              />
              <p className="text-xs text-slate-400 mt-1">{comments.length} символов</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Приватные заметки для председателя
              </label>
              <textarea
                value={privateNotes}
                onChange={e => setPrivateNotes(e.target.value)}
                disabled={existingReview?.isSubmitted}
                placeholder="Заметки видны только председателю"
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm resize-none disabled:bg-slate-50 disabled:text-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Ошибка */}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Кнопки */}
        {!existingReview?.isSubmitted && (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={e => handleSubmit(e, false)}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-60 text-sm"
            >
              {loading ? "Отправляем..." : "✅ Отправить рецензию"}
            </button>
            <button
              type="button"
              onClick={e => handleSubmit(e, true)}
              disabled={loading}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition text-sm"
            >
              💾 Сохранить черновик
            </button>
          </div>
        )}
      </form>
    </div>
  );
}