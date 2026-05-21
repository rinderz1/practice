import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ROLES } from "../../constants/roles";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) { setError("Пожалуйста, заполните все поля"); return; }
    setLoading(true);
    setError("");

    try {
      const user = await login(email, password);
      const role = user.systemRole;
      
      if (role === ROLES.ADMIN) {
        navigate("/admin/dashboard");
      } else if (role === ROLES.CHAIR) {
        navigate("/chair/dashboard");
      } else if (role === ROLES.REVIEWER) {
        navigate("/reviewer/dashboard");
      } else {
        navigate("/author/dashboard");
      }
    } catch (err) {
      setError(err.message || "Ошибка авторизации");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FBFBFC] flex">
      {/* Левая панель */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0F172A] relative overflow-hidden items-center justify-center p-16">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10 max-w-md">
          <h2 className="text-6xl font-black text-white leading-[1.1] mb-8 tracking-tighter">
            Вступайте в <br/>
            <span className="text-emerald-400 italic">Элитное</span> <br/>
            сообщество.
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed font-medium">
            Откройте для себя новое поколение систем управления академическими процессами и рецензированием.
          </p>
        </div>
      </div>

      {/* Правая панель с формой */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-20">
        <div className="w-full max-w-[440px]">
          <div className="mb-12 text-center lg:text-left">
            <Link to="/" className="inline-flex w-14 h-14 bg-slate-900 rounded-[20px] items-center justify-center text-white font-black mb-10 shadow-xl shadow-slate-200 hover:bg-emerald-600 transition-colors">
              P
            </Link>
            <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter">С возвращением</h1>
            <p className="text-slate-500 font-medium text-lg">Введите свои данные для доступа в портал.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">Электронная почта</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="scholar@university.edu"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field"
              />
            </div>

            {error && (
              <div className="p-5 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold rounded-2xl flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-rose-600 rounded-full animate-pulse"></span>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary h-16 mt-6 text-sm uppercase tracking-widest"
            >
              {loading ? "Авторизация..." : "Войти в портал"}
            </button>
          </form>

          <div className="mt-16 pt-10 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="text-sm text-slate-400 font-medium">Нет аккаунта?</p>
            <Link to="/register" className="text-xs font-black text-emerald-600 hover:text-emerald-700 transition-colors uppercase tracking-[0.2em]">
              Зарегистрироваться
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
