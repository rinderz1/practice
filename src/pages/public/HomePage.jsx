import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { CONF_STATUS } from "../../constants/statuses";
import { conferencesApi } from "../../services/api/conferencesApi";
import ConferenceCard from "../../components/ui/ConferenceCard";

export default function HomePage() {
  const { user } = useAuth();
  const [conferences, setConferences] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadConferences();
  }, []);

  async function loadConferences() {
    setLoading(true);
    try {
      const data = await conferencesApi.getAll();
      setConferences(data);
    } catch (err) {
      console.error("Failed to fetch conferences", err);
    } finally {
      setLoading(false);
    }
  }

  const activeConfs = conferences.filter(c => c.status === CONF_STATUS.ACTIVE);
  const upcomingConfs = conferences.filter(c => c.status === CONF_STATUS.UPCOMING);
  const archivedConfs = conferences.filter(c => c.status === CONF_STATUS.COMPLETED || c.status === CONF_STATUS.ARCHIVED);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center bg-[#0F172A] overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-10 animate-fade-in">
             <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
             <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Будущее науки уже здесь</span>
          </div>
          <h1 className="text-7xl md:text-8xl font-black text-white leading-[0.95] mb-10 tracking-tighter">
            Управляйте <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 italic">Наукой</span> <br/>
            Легко.
          </h1>
          <p className="text-slate-400 text-xl md:text-2xl mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            Единая платформа для организации конференций, рецензирования статей и публикации передовых исследований.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/register" className="btn-emerald h-20 px-12 text-sm uppercase tracking-widest shadow-2xl shadow-emerald-500/20">
              Стать автором
            </Link>
            <a href="#conferences" className="text-white font-black text-xs uppercase tracking-[0.3em] hover:text-emerald-400 transition-colors">
              Смотреть события ↓
            </a>
          </div>
        </div>
      </section>

      {/* Conferences Section */}
      <section id="conferences" className="py-32 px-6 bg-[#FBFBFC]">
        <div className="max-w-7xl mx-auto">
          
          {loading && <p className="text-center text-slate-400 font-bold uppercase tracking-widest">Загрузка событий...</p>}

          {/* Active */}
          {!loading && activeConfs.length > 0 && (
            <div className="mb-24">
              <div className="flex items-center gap-4 mb-12">
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Активные события</h2>
                <div className="h-px flex-1 bg-slate-100"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {activeConfs.map(c => <ConferenceCard key={c.id} conference={c} user={user} />)}
              </div>
            </div>
          )}

          {/* Upcoming */}
          {!loading && (
            <div className="mb-24">
              <div className="flex items-center gap-4 mb-12">
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Предстоящие</h2>
                <div className="h-px flex-1 bg-slate-100"></div>
              </div>
              {upcomingConfs.length === 0 ? (
                <p className="text-slate-400 font-medium italic">Пока нет новых анонсов</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {upcomingConfs.map(c => <ConferenceCard key={c.id} conference={c} user={user} />)}
                </div>
              )}
            </div>
          )}

          {/* Archive */}
          {!loading && archivedConfs.length > 0 && (
            <div>
              <div className="flex items-center gap-4 mb-12">
                <h2 className="text-4xl font-black text-slate-400 tracking-tighter uppercase">Архив</h2>
                <div className="h-px flex-1 bg-slate-100"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700">
                {archivedConfs.map(c => <ConferenceCard key={c.id} conference={c} user={user} />)}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 bg-white border-y border-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
            <div className="text-center group">
               <p className="text-7xl font-black text-slate-900 mb-4 group-hover:scale-110 transition-transform">120+</p>
               <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">Конференций в год</p>
               <p className="text-slate-400 mt-4 leading-relaxed text-sm font-medium">Охват всех научных областей от ИИ до медицины.</p>
            </div>
            <div className="text-center group">
               <p className="text-7xl font-black text-slate-900 mb-4 group-hover:scale-110 transition-transform">50k</p>
               <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em]">Рецензентов</p>
               <p className="text-slate-400 mt-4 leading-relaxed text-sm font-medium">Мировое сообщество экспертов для качественной оценки.</p>
            </div>
            <div className="text-center group">
               <p className="text-7xl font-black text-slate-900 mb-4 group-hover:scale-110 transition-transform">1M+</p>
               <p className="text-[10px] font-black text-teal-500 uppercase tracking-[0.3em]">Читателей</p>
               <p className="text-slate-400 mt-4 leading-relaxed text-sm font-medium">Объединение авторов и рецензентов со всего мира на одной платформе.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
