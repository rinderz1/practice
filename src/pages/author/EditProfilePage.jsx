import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

export default function EditProfilePage() {
  const { user } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email] = useState(user?.email || "");
  const [affiliation, setAffiliation] = useState(user?.affiliation || "");
  const [orcid, setOrcid] = useState(user?.orcid || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!fullName.trim()) { setError("Пожалуйста, введите ФИО"); return; }

    setLoading(true);
    setError("");

    await new Promise(r => setTimeout(r, 600));

    const users = JSON.parse(localStorage.getItem("conference_cms_users")) || [];
    const updated = users.map(u =>
      u.id === user.id
        ? { ...u, fullName: fullName.trim(), affiliation, orcid, bio }
        : u
    );
    localStorage.setItem("conference_cms_users", JSON.stringify(updated));

    const currentUser = JSON.parse(localStorage.getItem("conference_cms_auth")) || {};
    localStorage.setItem("conference_cms_auth", JSON.stringify({
      ...currentUser,
      fullName: fullName.trim(),
    }));

    setLoading(false);
    setSuccess("Ваш профиль успешно обновлён!");
    setTimeout(() => setSuccess(""), 3000);
  }

  return (
    <div className="max-w-4xl">
      {/* Заголовок */}
      <div className="mb-12">
        <h1 className="heading-lg mb-2">Настройки профиля</h1>
        <p className="text-slate-500 font-medium">Персонализируйте свои данные для научного сообщества.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Аватар и краткая сводка */}
        <div className="space-y-6">
           <div className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm text-center">
              <div className="relative inline-block mb-8">
                 <div className="w-24 h-24 rounded-[32px] bg-[#0F172A] flex items-center justify-center text-white font-black text-4xl shadow-2xl shadow-slate-200 mx-auto">
                    {(fullName || email)[0].toUpperCase()}
                 </div>
                 <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-2xl border-4 border-white flex items-center justify-center text-white text-xs shadow-lg">
                    ✓
                 </div>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-1 tracking-tighter leading-tight">{fullName || email}</h3>
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-8">{user?.roles?.[0]}</p>
              
              <div className="pt-8 border-t border-slate-50 flex flex-col gap-3">
                 <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">ID Аккаунта</div>
                 <code className="bg-slate-50 py-2 px-4 rounded-xl text-xs font-bold text-slate-400">#{user?.id?.slice(-8)}</code>
              </div>
           </div>
        </div>

        {/* Форма редактирования */}
        <div className="lg:col-span-2">
           <div className="bg-white rounded-[48px] border border-slate-100 p-10 sm:p-12 shadow-sm">
             <form onSubmit={handleSubmit} className="space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div>
                   <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">ФИО / Псевдоним</label>
                   <input
                     type="text"
                     value={fullName}
                     onChange={e => setFullName(e.target.value)}
                     placeholder="Д-р Александр Райт"
                     className="input-field"
                   />
                 </div>

                 <div>
                   <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">Email (Основной)</label>
                   <input
                     type="email"
                     value={email}
                     disabled
                     className="input-field bg-slate-50 text-slate-400 cursor-not-allowed border-transparent"
                   />
                 </div>

                 <div>
                   <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">Организация</label>
                   <input
                     type="text"
                     value={affiliation}
                     onChange={e => setAffiliation(e.target.value)}
                     placeholder="Университет исследований"
                     className="input-field"
                   />
                 </div>

                 <div>
                   <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">ORCID ID</label>
                   <input
                     type="text"
                     value={orcid}
                     onChange={e => setOrcid(e.target.value)}
                     placeholder="0000-0002-XXXX-XXXX"
                     className="input-field"
                   />
                 </div>
               </div>

               <div>
                 <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">Биография / О себе</label>
                 <textarea
                   value={bio}
                   onChange={e => setBio(e.target.value)}
                   placeholder="Расскажите о ваших научных интересах..."
                   rows={5}
                   className="input-field resize-none leading-relaxed"
                 />
               </div>

               {error && (
                 <div className="p-5 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold rounded-2xl flex items-center gap-3">
                   <span className="w-1.5 h-1.5 bg-rose-600 rounded-full animate-pulse"></span>
                   {error}
                 </div>
               )}

               {success && (
                 <div className="p-5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold rounded-2xl flex items-center gap-3">
                   <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
                   {success}
                 </div>
               )}

               <div className="pt-6 border-t border-slate-50 flex items-center gap-6">
                 <button
                   type="submit"
                   disabled={loading}
                   className="btn-emerald h-14 px-10 text-xs uppercase tracking-widest"
                 >
                   {loading ? "Сохранение..." : "Обновить профиль"}
                 </button>
                 <button type="button" onClick={() => window.history.back()} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">
                    Отмена
                 </button>
               </div>
             </form>
           </div>
        </div>
      </div>
    </div>
  );
}
