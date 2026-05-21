import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ROLES } from "../../constants/roles";
import { conferencesApi } from "../../services/api/conferencesApi";

export default function ChairConferenceSettingsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [conference, setConference] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [venue, setVenue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("upcoming");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadConference();
  }, [id]);

  async function loadConference() {
    setLoading(true);
    try {
      const found = await conferencesApi.getById(id);
      
      // Security check
      const isAdmin = user?.systemRole === ROLES.ADMIN;
      const isOwner = user?.systemRole === ROLES.CHAIR && found.chairmanId === user.id;

      if (!isAdmin && !isOwner) {
        navigate("/403");
        return;
      }

      setConference(found);
      setTitle(found.title || "");
      setDescription(found.description || "");
      setVenue(found.venue || "");
      setStartDate(found.startDate || "");
      setEndDate(found.endDate || "");
      setStatus(found.status || "upcoming");
    } catch (err) {
      setError("Конференция не найдена");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSuccess("");
    setError("");
    
    try {
      await conferencesApi.update(id, {
        title,
        description,
        venue,
        startDate,
        endDate,
        status
      });
      setSuccess("Изменения сохранены!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Не удалось сохранить изменения");
    }
  }

  if (error) return <div className="p-8 text-red-600 font-bold">{error}</div>;
  if (loading || !conference) return <div className="p-8 text-slate-400 font-bold uppercase tracking-widest text-center">Загрузка...</div>;

  return (
    <div className="max-w-3xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Настройки конференции</h1>
          <p className="text-slate-500 mt-1 text-[10px] font-black uppercase tracking-widest">Управление параметрами события</p>
        </div>
        <button 
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-black uppercase tracking-widest rounded-xl transition"
        >
          ← Назад
        </button>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-10">
        <form onSubmit={handleSubmit} className="space-y-8">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Статус конференции</label>
              <div className="flex gap-4">
                {['upcoming', 'active', 'completed'].map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                      status === s 
                      ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200' 
                      : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    {s === 'upcoming' ? 'Предстоит' : s === 'active' ? 'Идет' : 'Завершена'}
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Название</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="input-field font-bold"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Место проведения</label>
              <input
                type="text"
                value={venue}
                onChange={e => setVenue(e.target.value)}
                className="input-field font-bold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Дата начала</label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="input-field font-bold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Дата окончания</label>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="input-field font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Описание</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={4}
              className="input-field font-bold resize-none leading-relaxed"
            />
          </div>

          {success && (
            <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest px-6 py-4 rounded-2xl">
              {success}
            </div>
          )}

          {error && !success && (
            <div className="bg-rose-50 border border-rose-100 text-rose-700 text-[10px] font-black uppercase tracking-widest px-6 py-4 rounded-2xl">
              {error}
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-5 bg-slate-900 hover:bg-emerald-600 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl transition-all shadow-xl shadow-slate-200"
            >
              Сохранить изменения
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
