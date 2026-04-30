import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const isAuth = localStorage.getItem("isAuth") === "true";
  const role = localStorage.getItem("userRole") || "guest";

  function handleLogout() {
    localStorage.removeItem("isAuth");
    localStorage.removeItem("userEmail");
    navigate("/login");
  }

  return (
    <nav
      style={{
        display: "flex",
        gap: "16px",
        padding: "20px",
        backgroundColor: "#f0f0f0",
      }}
    >
      <Link to="/">Главная</Link>
      <Link to="/login">Вход</Link>
      <Link to="/register">Регистрация</Link>
      

      {isAuth && role === "author" && (
        <>
          <Link to="/papers">Статьи</Link>
          <Link to="/papers/submit">Подать статью</Link>
          <Link to="/dashboard">Кабинет</Link>
          <button onClick={handleLogout}>Выйти</button>
        </>
      )}

      {isAuth && role === "reviewer" && (
        <>
          <Link to="/reviewer/dashboard">Рецензирование</Link>
          <Link to="/dashboard">Кабинет</Link>
          <button onClick={handleLogout}>Выйти</button>
        </>
      )}

      {isAuth && role === "chair" && (
        <>
          <Link to="/chair/conferences/1">Конференция</Link>
          <Link to="/dashboard">Кабинет</Link>
          <button onClick={handleLogout}>Выйти</button>
        </>
      )}

      {isAuth && role === "admin" && (
        <>
          <Link to="/admin/dashboard">Админ</Link>
          <Link to="/dashboard">Кабинет</Link>
          <button onClick={handleLogout}>Выйти</button>
        </>
      )}
    </nav>
  );
}

export default Navbar;