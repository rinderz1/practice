import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ROLES } from "../../constants/roles";

const roleLinks = {
  [ROLES.AUTHOR]: [
    { path: "/dashboard", label: "Мои статьи" },
    { path: "/papers/submit", label: "Подать статью" },
    { path: "/profile/edit", label: "Профиль" },
  ],
  [ROLES.REVIEWER]: [
    { path: "/reviewer/dashboard", label: "Назначения" },
  ],
  [ROLES.CHAIR]: [
    { path: "/chair/conferences/1", label: "Моя конференция" },
  ],
  [ROLES.ADMIN]: [
    { path: "/admin/dashboard", label: "Обзор" },
    { path: "/admin/users", label: "Пользователи" },
  ],
};

export function Sidebar() {
  const { user } = useAuth();
  const userRoles = user?.roles || [];
  const links = userRoles.flatMap((role) => roleLinks[role] || []);

  return (
    <aside className="sidebar">
      <div className="sidebar-section">Меню</div>
      <nav className="sidebar-nav">
        {links.length === 0 && <div>Нет доступных разделов</div>}
        {links.map((link) => (
          <NavLink key={link.path} to={link.path} className="sidebar-link">
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
