import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-slate-50 sticky top-0 z-50">
      <div className="px-10 h-24 flex items-center justify-between max-w-[1600px] mx-auto">

        <Link to="/" className="flex items-center gap-4 group">
          <div className="w-12 h-12 bg-[#0F172A] rounded-[18px] flex items-center justify-center text-white font-black group-hover:bg-emerald-500 transition-all group-hover:rotate-6 shadow-xl shadow-slate-200">
            P
          </div>
          <span className="font-black text-[#0F172A] uppercase tracking-tighter text-xl group-hover:text-emerald-600 transition-colors">Portal</span>
        </Link>

        <div className="flex items-center gap-10">
          {user && (
            <div className="flex items-center gap-5 py-2 px-2 rounded-2xl hover:bg-slate-50/50 transition-colors cursor-default group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-[#0F172A] leading-none mb-1 group-hover:text-emerald-600 transition-colors">{user.fullName || user.email}</p>
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">{user.roles?.[0]}</p>
              </div>
              <div className="w-12 h-12 rounded-[18px] bg-slate-50 flex items-center justify-center text-[#0F172A] font-black border border-slate-100 shadow-sm group-hover:border-emerald-200 transition-colors">
                {(user.fullName || user.email)[0].toUpperCase()}
              </div>
            </div>
          )}

          <div className="h-8 w-px bg-slate-100 mx-2"></div>

          <button
            onClick={handleLogout}
            className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 hover:text-rose-500 transition-colors"
          >
            Выйти
          </button>
        </div>

      </div>
    </header>
  );
}
