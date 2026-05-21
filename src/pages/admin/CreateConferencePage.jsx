import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CONF_STATUS } from "../../constants/statuses";
import { usersApi } from "../../services/api/usersApi";
import { conferencesApi } from "../../services/api/conferencesApi";

export default function CreateConferencePage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [venue, setVenue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [submissionDeadline, setSubmissionDeadline] = useState("");
  const [chairmanId, setChairmanId] = useState("");
  
  const [chairmen, setChairmen] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadChairmen();
  }, []);

  async function loadChairmen() {
    try {
      const users = await usersApi.getAll();
      const filtered = users.filter(u => u.systemRole === "chair");
      setChairmen(filtered);
    } catch (err) {
      console.error("Failed to load chairmen", err);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !submissionDeadline || !venue.trim()) {
      setError("Пожалуйста, заполните обязательные поля (Название, Описание, Место, Дедлайн)");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Get creator ID from localStorage as per instruction
      const authData = JSON.parse(localStorage.getItem("conference_cms_auth"));
      const creatorId = authData?.id;

      if (!creatorId) {
        throw new Error("User not authenticated");
      }

      await conferencesApi.create(creatorId, {
        title: title.trim(),
        description: description.trim(),
        venue: venue.trim(),
        startDate,
        endDate,
        submissionDeadline,
        status: CONF_STATUS.UPCOMING,
        // Since the backend might expect the chairmanId in the body or elsewhere, 
        // and we have a select for it, let's pass it in the body as well if the backend supports it.
        // The user says "Председатель определяется по полю conferenceChairs", 
        // so we might need to send that.
        conferenceChairs: chairmanId ? [{ id: chairmanId }] : []
      });
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message || "Не удалось создать конференцию");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="heading-lg mb-2">Создать конференцию</h1>
          <p className="text-slate-500 font-medium">Спроектируйте новое научное событие мирового уровня.</p>
        </div>
        <Link to="/admin/dashboard" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">
          ← Отмена
        </Link>
      </div>

      <div className="bg-white rounded-[48px] border border-slate-100 p-10 sm:p-16 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-10">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Основная информация */}
            <div className="space-y-8">
              <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-4">Основные данные</h3>
              
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Название события *</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="напр. Global Tech AI 2026"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Место проведения *</label>
                <input
                  type="text"
                  value={venue}
                  onChange={e => setVenue(e.target.value)}
                  placeholder="напр. Москва, онлайн"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Председатель *</label>
                <select
                  value={chairmanId}
                  onChange={e => setChairmanId(e.target.value)}
                  className="input-field bg-white appearance-none"
                >
                  <option value="">Выберите из списка...</option>
                  {chairmen.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.fullName} ({c.email})
                    </option>
                  ))}
                </select>
                {chairmen.length === 0 && <p className="mt-2 text-[10px] text-rose-400 font-bold uppercase italic">Сначала создайте пользователя с ролью "chair"</p>}
              </div>
            </div>

            {/* Даты */}
            <div className="space-y-8">
              <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-4">Сроки проведения</h3>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Начало</label>
                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="input-field" />
                 </div>
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Конец</label>
                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="input-field" />
                 </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-rose-400 uppercase tracking-widest mb-3 ml-1">Дедлайн подачи *</label>
                <input
                  type="date"
                  value={submissionDeadline}
                  onChange={e => setSubmissionDeadline(e.target.value)}
                  className="input-field border-rose-100 bg-rose-50/30"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Описание конференции *</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Подробно опишите цели и задачи мероприятия..."
              rows={6}
              className="input-field resize-none leading-relaxed"
            />
          </div>

          {error && (
            <div className="p-5 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold rounded-2xl flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-rose-600 rounded-full animate-pulse"></span>
              {error}
            </div>
          )}

          <div className="pt-10 border-t border-slate-50 flex items-center gap-6">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary h-16 px-12 text-[10px] uppercase tracking-widest"
            >
              {loading ? "Создание..." : "Опубликовать конференцию"}
            </button>
            <Link to="/admin/dashboard" className="text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-slate-900 transition-colors">
              Отмена
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
}
