import { Link } from "react-router-dom";
import { Badge } from "./Badge";
import { ROLES } from "../../constants/roles";
import { CONF_STATUS_META } from "../../constants/statuses";

export default function ConferenceCard({ conference, user, onEdit, onDelete }) {
  if (!conference) return null;

  const isAdmin = user?.systemRole === "admin" || (user?.roles && user.roles.includes("admin"));
  const isChair = (conference.conferenceChairs || []).some(chair => chair.user?.id === user?.id || chair.id === user?.id) || conference.chairmanId === user?.id;
  const canEdit = isAdmin || isChair;

  const statusMeta = CONF_STATUS_META[conference.status] || CONF_STATUS_META.upcoming;

  return (
    <div className="group relative bg-white rounded-[40px] p-10 border border-slate-100 transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(16,185,129,0.15)] hover:border-emerald-100 flex flex-col h-full">
      <div className="flex justify-between items-start mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0F172A] to-slate-700 flex items-center justify-center text-white shadow-xl shadow-slate-200 group-hover:rotate-6 transition-transform">
          <span className="text-2xl">🏛️</span>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
            conference.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
            conference.status === 'upcoming' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-50 text-slate-400 border-slate-200'
          }`}>
            {statusMeta.label}
          </span>
          {conference.location && <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">📍 {conference.location}</span>}
        </div>
      </div>
      
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 mb-3 block opacity-60">
        {conference.theme || conference.topic || "Общая тематика"}
      </span>
      
      <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-emerald-600 transition-colors tracking-tighter leading-tight">
        {conference.title}
      </h3>
      
      <p className="text-slate-500 text-sm mb-8 leading-relaxed font-medium line-clamp-3">
        {conference.description}
      </p>

      <div className="mt-auto">
        {/* Chairman Info */}
        <div className="mb-8 p-5 bg-slate-50 rounded-3xl border border-slate-50 group-hover:bg-emerald-50/30 group-hover:border-emerald-100 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-lg shadow-sm">
              👤
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Председатель</p>
              <p className="text-sm font-black text-slate-900 truncate tracking-tight">
                {conference.conferenceChairs?.[0]?.user?.fullName || 
                 conference.conferenceChairs?.[0]?.fullName || 
                 (conference.chairmanName !== "Председатель" ? conference.chairmanName : null) || 
                 "Не назначен"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col gap-1">
             <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Дедлайн подачи</span>
             <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">
               {conference.submissionDeadline || conference.deadline}
             </span>
          </div>
          {isAdmin && (
            <button
              onClick={() => onDelete && onDelete(conference.id)}
              className="w-10 h-10 flex items-center justify-center bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"
              title="Удалить конференцию"
            >
              🗑️
            </button>
          )}
        </div>

        <div className="flex gap-4">
          <Link 
            to={`/conferences/${conference.id}`}
            className="flex-1 py-4 bg-[#0F172A] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200 text-center"
          >
            Подробнее
          </Link>
          {canEdit && (
            <button 
              onClick={() => onEdit && onEdit(conference)}
              className="px-6 py-4 bg-white border border-slate-200 text-slate-900 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-50 transition-all shadow-sm"
            >
              ⚙️
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
