import { useState } from "react";

export default function ChairConferenceSettingsPage() {
  const saved = JSON.parse(localStorage.getItem("conferenceSettings")) || {};

  const [title, setTitle] = useState(saved.title || "ICSE 2025");
  const [description, setDescription] = useState(saved.description || "");
  const [deadline, setDeadline] = useState(saved.deadline || "");
  const [reviewDeadline, setReviewDeadline] = useState(saved.reviewDeadline || "");
  const [maxReviewers, setMaxReviewers] = useState(saved.maxReviewers || 3);
  const [success, setSuccess] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    localStorage.setItem("conferenceSettings", JSON.stringify({
      title, description, deadline, reviewDeadline, maxReviewers
    }));
    setSuccess("Настройки сохранены!");
    setTimeout(() => setSuccess(""), 3000);
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Настройки конференции</h1>
        <p className="text-slate-500 mt-1 text-sm">Управляйте параметрами и дедлайнами</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Название конференции</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Описание</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Дедлайн подачи</label>
              <input
                type="date"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Дедлайн рецензий</label>
              <input
                type="date"
                value={reviewDeadline}
                onChange={e => setReviewDeadline(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Максимум рецензентов на статью
            </label>
            <input
              type="number"
              min={1}
              max={10}
              value={maxReviewers}
              onChange={e => setMaxReviewers(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
            />
          </div>

          {success && (
            <div className="bg-green-50 border border-green-100 text-green-700 text-sm px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition text-sm"
            >
              Сохранить настройки
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}