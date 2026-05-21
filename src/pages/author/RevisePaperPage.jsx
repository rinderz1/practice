import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PAPER_STATUS } from "../../constants/statuses";
import { papersApi } from "../../services/api/papersApi";

export default function RevisePaperPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [paper, setPaper] = useState(null);
  const [fileName, setFileName] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
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
        <button onClick={() => navigate("/papers")} className="text-blue-600 hover:underline text-sm">
          Вернуться к списку
        </button>
      </div>
    );
  }

  const isRevisionRequired = paper.status === PAPER_STATUS.REVISION_REQUIRED || paper.status === "revision";

  if (!isRevisionRequired) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">🚫</div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Доработка не требуется</h2>
        <p className="text-slate-500 text-sm mb-6">Эта статья не находится в статусе доработки</p>
        <button
          onClick={() => navigate("/papers")}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition"
        >
          К моим статьям
        </button>
      </div>
    );
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setError("Загрузите файл в формате PDF");
      e.target.value = "";
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Файл не должен превышать 10 МБ");
      e.target.value = "";
      return;
    }
    setFileName(file.name);
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!fileName) { setError("Загрузите PDF файл"); return; }

    setLoading(true);
    setError("");

    try {
      // Backend only supports status update in the spec, but we might need to send more.
      // Assuming updateStatus moves it back to UNDER_REVIEW or PENDING_REVIEW
      await papersApi.updateStatus(id, PAPER_STATUS.UNDER_REVIEW || "under_review");
      navigate("/papers");
    } catch (err) {
      setError("Не удалось отправить доработку");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      {/* Назад */}
      <button
        onClick={() => navigate("/papers")}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition mb-6"
      >
        ← Назад к статьям
      </button>

      {/* Заголовок */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Загрузить доработку</h1>
        <p className="text-slate-500 mt-1 text-sm">Загрузите исправленную версию статьи</p>
      </div>

      {/* Инфо о статье */}
      <div className="bg-orange-50 border border-orange-100 rounded-xl p-5 mb-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl">✏️</span>
          <div>
            <p className="font-semibold text-orange-800 text-sm">Требуется доработка</p>
            <p className="text-orange-700 text-sm mt-1">{paper.title}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Загрузка PDF */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Новая версия PDF <span className="text-red-500">*</span>
            </label>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition">
              {fileName ? (
                <div className="text-center">
                  <div className="text-2xl mb-1">📄</div>
                  <p className="text-sm font-medium text-blue-600">{fileName}</p>
                  <p className="text-xs text-slate-400 mt-1">Нажмите чтобы изменить</p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-2xl mb-1">⬆️</div>
                  <p className="text-sm font-medium text-slate-600">Нажмите для загрузки PDF</p>
                  <p className="text-xs text-slate-400 mt-1">Максимальный размер: 10 МБ</p>
                </div>
              )}
              <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
            </label>
          </div>

          {/* Комментарий */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Комментарий к доработке
            </label>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Опишите что было исправлено..."
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm resize-none"
            />
          </div>

          {/* Ошибка */}
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Кнопки */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-60 text-sm"
            >
              {loading ? "Отправляем..." : "Отправить доработку"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/papers")}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition text-sm"
            >
              Отмена
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}