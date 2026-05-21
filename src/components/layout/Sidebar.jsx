import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ROLES } from "../../constants/roles";

export function Sidebar() {
  const { user } = useAuth();
  const userRole = user?.systemRole || "";

  const roleLinks = {
    [ROLES.AUTHOR]: [
      { path: "/author/dashboard", label: "Дашборд" },
      { path: "/papers/submit", label: "Подать статью" },
      { path: "/papers", label: "Мои работы" },
      { path: "/profile/edit", label: "Настройки" },
    ],
    [ROLES.REVIEWER]: [
      { path: "/reviewer/dashboard", label: "Назначения" },
    ],
    [ROLES.CHAIR]: [
      { path: "/chair/dashboard", label: "Управление" },
    ],
    [ROLES.ADMIN]: [
      { path: "/admin/dashboard", label: "Система" },
      { path: "/admin/users", label: "Пользователи" },
      { path: "/admin/conferences/create", label: "Конференция" },
    ],
  };

  const links = roleLinks[userRole] || [];

  return (
    <aside className="w-80 bg-white border-r border-slate-50 min-h-full">
      <div className="p-10">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-10 px-4">
          Навигация
        </p>
        <nav className="space-y-3">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center px-5 py-5 rounded-[20px] text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                  isActive
                    ? "bg-[#0F172A] text-white shadow-2xl shadow-slate-200 translate-x-1"
                    : "text-slate-400 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}
