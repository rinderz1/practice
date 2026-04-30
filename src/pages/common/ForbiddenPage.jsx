import { Link } from "react-router-dom";

export default function ForbiddenPage() {
  return (
    <div>
      <h1>403 — Доступ запрещён</h1>
      <p>У вас нет прав для этой страницы или действия.</p>
      <Link to="/">Вернуться на главную</Link>
    </div>
  );
}
