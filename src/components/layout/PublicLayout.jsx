import { Outlet, Link } from "react-router-dom";

export function PublicLayout() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">Conference CMS</div>
        <nav className="topnav">
          <Link to="/">Главная</Link>
          <Link to="/login">Вход</Link>
          <Link to="/register">Регистрация</Link>
        </nav>
      </header>

      <main className="page-content">
        <Outlet />
      </main>
    </div>
  );
}
