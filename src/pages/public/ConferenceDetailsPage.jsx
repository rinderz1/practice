import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { CONF_STATUS_META, PAPER_STATUS } from "../../constants/statuses";
import { conferencesApi } from "../../services/api/conferencesApi";
import { papersApi } from "../../services/api/papersApi";

export default function ConferenceDetailsPage() {
  const { id } = useParams();
  const [conference, setConference] = useState(null);
  const [publishedPapers, setPublishedPapers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  async function loadData() {
    setLoading(true);
    try {
      const [confData, papersData] = await Promise.all([
        conferencesApi.getById(id),
        papersApi.getByConference(id)
      ]);
      setConference(confData);
      setPublishedPapers(papersData.filter(p => p.status === PAPER_STATUS.ACCEPTED));
    } catch (err) {
      console.error("Failed to load conference details", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="max-w-5xl mx-auto px-6 py-32 text-center text-slate-400 font-bold uppercase tracking-widest">Загрузка...</div>;
  }

  if (!conference) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-32 text-center">
        <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">Конференция не найдена</h1>
        <Link to="/" className="text-emerald-600 font-black uppercase tracking-widest text-[10px]">Вернуться на главную</Link>
      </div>
    );
  }

  const statusMeta = CONF_STATUS_META[conference.status] || CONF_STATUS_META.upcoming;

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <Link to="/" className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 hover:text-slate-900 mb-12 inline-block transition-colors">← На главную</Link>
      
      <div className="bg-white rounded-[48px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-[#0F172A] px-12 py-20 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
          <h1 className="text-5xl font-black mb-4 tracking-tighter">{conference.title}</h1>
          <p className="text-emerald-400 text-xl font-medium tracking-tight italic opacity-80">{conference.theme || "Научное мероприятие"}</p>
        </div>
        
        <div className="p-12 sm:p-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
            <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Дедлайн подачи</p>
              <p className="text-slate-900 text-xl font-black tracking-tight">{conference.submissionDeadline || "—"}</p>
            </div>
            <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Организатор</p>
              <p className="text-slate-900 text-xl font-black tracking-tight">{conference.organizerFaculty || "Университет"}</p>
            </div>
            <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Статус</p>
              <p className="text-emerald-600 text-xl font-black tracking-tight uppercase">{statusMeta.label}</p>
            </div>
          </div>

          <div className="mb-20">
            <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tighter uppercase">О конференции</h2>
            <p className="text-slate-500 text-lg leading-relaxed font-medium">{conference.description}</p>
          </div>

          {/* Секция опубликованных статей */}
          {publishedPapers.length > 0 && (
            <div className="mb-20">
              <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tighter uppercase">Опубликованные статьи</h2>
              <div className="space-y-4">
                {publishedPapers.map(paper => (
                  <div key={paper.id} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:border-emerald-100 transition-colors group">
                    <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors tracking-tight">{paper.title}</h3>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4">Автор ID: {paper.userId || paper.authorId}</p>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6 italic">"{paper.abstractText}"</p>
                    <button className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:text-emerald-700 transition-colors">Скачать PDF ↓</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-6 border-t border-slate-50 pt-16">
            <Link to="/papers/submit" className="btn-emerald h-16 px-12 text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-500/20">
              Подать статью
            </Link>
            <Link to={`/conferences/${id}/program`} className="btn-secondary h-16 px-12 text-[10px] uppercase tracking-widest">
              Программа
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
