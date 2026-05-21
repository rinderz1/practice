import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { papersApi } from "../../services/api/papersApi";
import { reviewsApi } from "../../services/api/reviewsApi";

function ScoreInput({ label, description, value, onChange }) {
  return (
    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</p>
          <p className="text-xs text-slate-500 font-medium">{description}</p>
        </div>
        <span className="text-3xl font-black text-[#0F172A] bg-white w-14 h-14 flex items-center justify-center rounded-xl shadow-sm border border-slate-100">{value}</span>
      </div>
      <input
        type="range"
        min="0"
        max="10"
        step="1"
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
      />
      <div className="flex justify-between mt-2 px-1">
        <span className="text-[8px] font-black text-slate-300 uppercase">0</span>
        <span className="text-[8px] font-black text-slate-300 uppercase">5</span>
        <span className="text-[8px] font-black text-slate-300 uppercase">10</span>
      </div>
    </div>
  );
}

export default function ReviewSubmissionPage() {
  const { id: paperId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [paper, setPaper] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Form state
  const [scores, setScores] = useState({
    originalityScore: 5,
    technicalScore: 5,
    clarityScore: 5,
    relevanceScore: 5,
    overallScore: 5
  });
  const [comments, setComments] = useState("");
  const [privateComments, setPrivateComments] = useState("");

  useEffect(() => {
    if (paperId) loadPaper();
  }, [paperId]);

  async function loadPaper() {
    setLoading(true);
    try {
      const data = await papersApi.getById(paperId);
      setPaper(data);
    } catch (err) {
      console.error("Failed to load paper", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (comments.trim().length < 10) {
      setError("Пожалуйста, напишите более развернутый комментарий для автора");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const reviewData = {
        paperId: Number(paperId),
        reviewerId: Number(user?.id),
        ...scores,
        comments: comments.trim(),
        privateComments: privateComments.trim()
      };

      await reviewsApi.create(reviewData);
      
      setMessage("Рецензия отправлена!");
      setTimeout(() => {
        navigate("/reviewer/dashboard");
      }, 2000);
    } catch (err) {
      console.error("Failed to submit review", err);
      setError(err.message || "Не удалось отправить рецензию");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest">Загрузка...</div>;
  if (!paper) return <div className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest">Статья не найдена</div>;

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-12">
        <button onClick={() => navigate(-1)} className="text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-slate-900 transition-colors mb-6">← Назад</button>
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-tight mb-2">Написать рецензию</h1>
        <p className="text-slate-500 font-medium text-lg italic">"{paper.title}"</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Scores Grid */}
        <div className="bg-white rounded-[48px] border border-slate-100 p-10 sm:p-12 shadow-sm">
          <h2 className="text-xl font-black text-[#0F172A] uppercase tracking-tight mb-10">Критерии оценки (0-10)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ScoreInput 
              label="Оригинальность" 
              description="Насколько идея статьи является новой и уникальной?"
              value={scores.originalityScore}
              onChange={v => setScores(s => ({ ...s, originalityScore: v }))}
            />
            <ScoreInput 
              label="Техническое качество" 
              description="Методология, точность данных и корректность выводов."
              value={scores.technicalScore}
              onChange={v => setScores(s => ({ ...s, technicalScore: v }))}
            />
            <ScoreInput 
              label="Ясность изложения" 
              description="Качество языка, структура и понятность текста."
              value={scores.clarityScore}
              onChange={v => setScores(s => ({ ...s, clarityScore: v }))}
            />
            <ScoreInput 
              label="Соответствие тематике" 
              description="Насколько работа подходит под профиль конференции?"
              value={scores.relevanceScore}
              onChange={v => setScores(s => ({ ...s, relevanceScore: v }))}
            />
            <div className="md:col-span-2 mt-4">
              <ScoreInput 
                label="ОБЩАЯ ОЦЕНКА" 
                description="Ваш итоговый вердикт по данной научной работе."
                value={scores.overallScore}
                onChange={v => setScores(s => ({ ...s, overallScore: v }))}
              />
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-[48px] border border-slate-100 p-10 sm:p-12 shadow-sm space-y-10">
          <div>
            <label className="block text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-4 ml-1">Комментарии для автора *</label>
            <textarea
              value={comments}
              onChange={e => setComments(e.target.value)}
              placeholder="Опишите сильные и слабые стороны, дайте рекомендации по улучшению..."
              rows={8}
              className="w-full p-8 bg-slate-50 border border-slate-100 rounded-[32px] text-slate-700 leading-relaxed focus:outline-none focus:border-emerald-500 focus:bg-white transition-all shadow-inner"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 ml-1">Приватные заметки для председателя</label>
            <textarea
              value={privateComments}
              onChange={e => setPrivateComments(e.target.value)}
              placeholder="Заметки, которые не увидит автор (например, сомнения в этичности)..."
              rows={4}
              className="w-full p-8 bg-slate-50 border border-slate-100 rounded-[32px] text-slate-700 leading-relaxed focus:outline-none focus:border-slate-900 focus:bg-white transition-all shadow-inner"
            />
          </div>
        </div>

        {error && (
          <div className="p-6 bg-rose-50 border border-rose-100 text-rose-600 rounded-3xl text-sm font-bold flex items-center gap-4">
            <span className="w-2 h-2 bg-rose-600 rounded-full animate-pulse"></span>
            {error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-6 pt-6">
          <button 
            type="submit" 
            disabled={submitting}
            className="w-full sm:w-auto h-20 px-16 bg-[#0F172A] text-white text-xs font-black uppercase tracking-[0.3em] rounded-[24px] hover:bg-emerald-600 transition-all active:scale-95 shadow-2xl shadow-slate-200 disabled:opacity-50"
          >
            {submitting ? "Отправка..." : "Отправить рецензию"}
          </button>
          <button 
            type="button"
            onClick={() => navigate(-1)}
            className="text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-rose-500 transition-colors"
          >
            Отмена
          </button>
        </div>
      </form>

      {message && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 p-8 bg-emerald-500 text-white text-xs font-black uppercase tracking-[0.2em] rounded-3xl shadow-2xl shadow-emerald-500/20 animate-slide-in z-50">
          {message}
        </div>
      )}
    </div>
  );
}
