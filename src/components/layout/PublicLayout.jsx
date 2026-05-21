import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export function PublicLayout() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-[#FBFBFC] flex flex-col">
      {/* Шапка для публичных страниц */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="w-12 h-12 bg-[#0F172A] rounded-[18px] flex items-center justify-center text-white font-black group-hover:bg-emerald-500 transition-all group-hover:rotate-6 shadow-xl shadow-slate-200">
              P
            </div>
            <span className="font-black text-[#0F172A] uppercase tracking-tighter text-xl group-hover:text-emerald-600 transition-colors">Портал</span>
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            <Link to="/" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-colors">
              Главная
            </Link>
            <a href="/#conferences" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-colors">
              Конференции
            </a>
          </nav>

          <div className="flex items-center gap-6">
            {isAuthenticated ? (
              <div className="flex items-center gap-6">
                <Link
                  to={
                    user?.systemRole === 'admin' ? '/admin/dashboard' :
                    user?.systemRole === 'chair' ? '/chair/dashboard' :
                    user?.systemRole === 'reviewer' ? '/reviewer/dashboard' :
                    '/author/dashboard'
                  }
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  Личный кабинет
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-rose-500 transition-colors"
                >
                  Выйти
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-colors"
                >
                  Войти
                </Link>
                <Link
                  to="/register"
                  className="btn-primary py-3 px-6 h-12 text-[10px] uppercase tracking-widest"
                >
                  Регистрация
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Основной контент */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Подвал */}
      <footer className="bg-white border-t border-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-sm">P</div>
               <span className="font-black text-slate-900 uppercase tracking-tighter">Академический Портал</span>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
              © 2025 Все права защищены.
            </p>
            <div className="flex gap-8">
               <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest cursor-pointer hover:text-slate-900 transition-colors">Приватность</span>
               <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest cursor-pointer hover:text-slate-900 transition-colors">Условия</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
