import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateConferencePage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [topic, setTopic] = useState("");
  const [deadline, setDeadline] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) { setError("Введите название конференции"); return; }
    if (!description.trim()) { setError("Введите описание"); return; }
    if (!deadline) { setError("Укажите дедлайн"); return; }

    setLoading(true);
    setError("");

    await new Promise(r => setTimeout(r, 600));

    const conferences = JSON.parse(localStorage.getItem("conferences")) || [];
    const newConference = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      topic: topic.trim(),
      deadline,
      status: "open",
      createdAt: new Date().toLocaleDateString("ru-RU"),
    };

    conferences.push(newConference);
    localStorage.setItem("conferences", JSON.stringify(conferences));

    setLoading(false);
    navigate("/admin/dashboard");
  }

  return (
    <div className="max-w-2xl">
      {/* Заголовок */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Создать конференцию</h1>
        <p className="text-slate-500 mt-1 text-sm">Заполните информацию о новой конференции</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Название */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Название <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="например: ICSE 2026"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
            />
          </div>

          {/* Описание */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Описание <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Краткое описание конференции"
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm resize-none"
            />
          </div>

          {/* Тематика */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Тематика
            </label>
            <input
              type="text"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="например: Программная инженерия"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
            />
          </div>

          {/* Дедлайн */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Дедлайн подачи <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={deadline}
              onChange={e => setDeadline(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
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
              {loading ? "Создаём..." : "Создать конференцию"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/dashboard")}
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