import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";

export function Topbar() {
  const { user, logout } = useAuth();

  return (
    <header className="topbar topbar-dashboard">
      <div className="brand">Conference CMS</div>
      <div className="topbar-actions">
        {user && (
          <span className="topbar-user">
            {user.fullName || user.email} ({user.roles?.join(", ")})
          </span>
        )}
        <Link to="/">На сайт</Link>
        <button type="button" onClick={logout} className="button button--ghost">
          Выйти
        </button>
      </div>
    </header>
  );
}
