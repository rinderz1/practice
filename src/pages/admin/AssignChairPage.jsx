import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ROLES } from "../../constants/roles";
import { addNotification } from "../../helpers/notifications";
import { conferencesApi } from "../../services/api/conferencesApi";
import { usersApi } from "../../services/api/usersApi";

export default function AssignChairPage() {
  const { id: conferenceId } = useParams();
  const navigate = useNavigate();
  
  const [conference, setConference] = useState(null);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [conferenceId]);

  async function loadData() {
    setLoading(true);
    try {
      const [confData, usersData] = await Promise.all([
        conferencesApi.getById(conferenceId),
        usersApi.getAll()
      ]);
      setConference(confData);
      setUsers(usersData);
    } catch (err) {
      console.error("Failed to load data", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="p-20 text-center">Загрузка...</div>;
  if (!conference) return <div className="p-20 text-center">Конференция не найдена</div>;

  const potentialChairmen = users.filter(u => u.systemRole === "chair" || (u.roles && u.roles.includes("chair")));
  const potentialReviewers = users.filter(u => u.systemRole === "reviewer" || (u.roles && u.roles.includes("reviewer")));

  async function updateConference(updates) {
    try {
      const updated = await conferencesApi.update(conferenceId, { ...conference, ...updates });
      setConference(updated);
      return updated;
    } catch (err) {
      console.error("Failed to update conference", err);
      setMessage("Ошибка при обновлении");
      setTimeout(() => setMessage(""), 3000);
      throw err;
    }
  }

  async function handleAssignChair(user) {
    try {
      // Backend expects conferenceChairs as a list of users
      await updateConference({ 
        conferenceChairs: [{ id: user.id, fullName: user.fullName, email: user.email }]
      });
      // addNotification(user.id, `Вы назначены председателем конференции: ${conference.title}`, "info");
      setMessage(`Председатель ${user.fullName} назначен!`);
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {}
  }

  async function handleToggleReviewer(userId) {
    const currentIds = (conference.reviewerIds || []).map(id => typeof id === 'object' ? id.id : id);
    let updatedIds;
    let action = "";

    if (currentIds.includes(userId)) {
      updatedIds = currentIds.filter(id => id !== userId);
      action = "удален из списка";
    } else {
      updatedIds = [...currentIds, userId];
      action = "добавлен в список";
      // addNotification(userId, `Вы назначены рецензентом на конференцию: ${conference.title}`, "info");
    }

    try {
      await updateConference({ reviewerIds: updatedIds });
      setMessage(`Рецензент успешно ${action}`);
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {}
  }

  // Helper to check if a user is a chair
  const currentChairId = conference.conferenceChairs?.[0]?.user?.id || conference.conferenceChairs?.[0]?.id || conference.chairmanId;
  const currentChairName = conference.conferenceChairs?.[0]?.user?.fullName || conference.conferenceChairs?.[0]?.fullName || conference.chairmanName;
  const currentChairEmail = conference.conferenceChairs?.[0]?.user?.email || conference.conferenceChairs?.[0]?.email || conference.chairmanEmail;

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
           <button onClick={() => navigate("/admin/dashboard")} className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-900 hover:text-white transition-all">←</button>
           <div>
              <h1 className="heading-lg mb-1">Управление командой</h1>
              <p className="text-slate-500 font-medium text-sm">{conference.title}</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Председатель */}
        <div className="space-y-8">
           <div className="flex items-center gap-3">
              <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Председатель (Chairman)</h2>
              <div className="h-px flex-1 bg-slate-100"></div>
           </div>

           <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Текущий выбор:</p>
              <div className="flex items-center gap-4 p-6 bg-[#0F172A] rounded-[32px] text-white shadow-xl shadow-slate-200 mb-10">
                 <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center font-black text-xl">
                    {currentChairName?.[0] || "?"}
                 </div>
                 <div>
                    <p className="font-black text-lg leading-tight">{currentChairName || "Не назначен"}</p>
                    <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">{currentChairEmail || "выберите из списка ниже"}</p>
                 </div>
              </div>

              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                 {potentialChairmen.map(u => (
                    <button
                      key={u.id}
                      onClick={() => handleAssignChair(u)}
                      className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all ${
                        currentChairId == u.id 
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700" 
                          : "border-slate-50 bg-slate-50/50 hover:bg-white hover:border-slate-200 hover:shadow-lg"
                      }`}
                    >
                      <div className="text-left">
                         <p className="text-sm font-black tracking-tight">{u.fullName}</p>
                         <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest">{u.email}</p>
                      </div>
                      {currentChairId == u.id && <span className="text-emerald-500 font-black">✓</span>}
                    </button>
                 ))}
              </div>
           </div>
        </div>

        {/* Рецензенты */}
        <div className="space-y-8">
           <div className="flex items-center gap-3">
              <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Пул Рецензентов (Reviewers)</h2>
              <div className="h-px flex-1 bg-slate-100"></div>
           </div>

           <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Назначено: {(conference.reviewerIds || []).length}</p>
              </div>

              <div className="grid grid-cols-1 gap-3 max-h-[550px] overflow-y-auto pr-2">
                 {potentialReviewers.map(u => {
                    const isSelected = (conference.reviewerIds || []).some(id => (typeof id === 'object' ? id.id : id) === u.id);
                    return (
                      <button
                        key={u.id}
                        onClick={() => handleToggleReviewer(u.id)}
                        className={`w-full flex items-center gap-4 p-5 rounded-2xl border transition-all ${
                          isSelected 
                            ? "border-emerald-500 bg-emerald-50 shadow-sm" 
                            : "border-slate-50 bg-slate-50/50 hover:bg-white hover:border-slate-200"
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${isSelected ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                           {isSelected ? "✓" : u.fullName?.[0]}
                        </div>
                        <div className="text-left flex-1 min-w-0">
                           <p className={`text-sm font-black tracking-tight ${isSelected ? 'text-emerald-700' : 'text-slate-900'}`}>{u.fullName}</p>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">{u.email}</p>
                        </div>
                        <div className={`w-12 h-6 rounded-full relative transition-colors ${isSelected ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                           <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isSelected ? 'right-1' : 'left-1'}`}></div>
                        </div>
                      </button>
                    );
                 })}
              </div>
           </div>
        </div>
      </div>

      {message && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 p-6 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-3xl shadow-2xl animate-slide-in z-50">
          {message}
        </div>
      )}
    </div>
  );
}
