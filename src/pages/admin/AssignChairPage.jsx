import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function AssignChairPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setUsers(JSON.parse(localStorage.getItem("conference_cms_users")) || []);
  }, []);

  function handleAssign(userId) {
    const updated = users.map(u =>
      u.id === userId
        ? { ...u, roles: [...new Set([...(u.roles || []), "chair"])] }
        : u
    );
    localStorage.setItem("conference_cms_users", JSON.stringify(updated));
    setUsers(updated);
    setMessage("Пользователь назначен председателем!");
    setTimeout(() => setMessage(""), 3000);
  }

  function handleRemove(userId) {
    const updated = users.map(u =>
      u.id === userId
        ? { ...u, roles: (u.roles || []).filter(r => r !== "chair") }
        : u
    );
    localStorage.setItem("conference_cms_users", JSON.stringify(updated));
    setUsers(updated);
    setMessage("Роль председателя снята");
    setTimeout(() => setMessage(""), 3000);
  }

  const filtered = users.filter(u =>
    !u.roles?.includes("admin") &&
    (
      (u.fullName || "").toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    )
  );

  const chairs = filtered.filter(u => u.roles?.includes("chair"));
  const others = filtered.filter(u => !u.roles?.includes("chair"));

  return (
    <div className="max-w-2xl">
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Назначить председателя</h1>
          <p className="text-slate-500 mt-1 text-sm">Конференция #{id}</p>
        </div>
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition"
        >
          ← Назад
        </button>
      </div>

      {/* Сообщение */}
      {message && (
        <div className="mb-6 px-4 py-3 bg-green-50 border border-green-100 text-green-700 text-sm rounded-lg">
          {message}
        </div>
      )}

      {/* Поиск */}
      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍  Поиск по имени или email..."
          className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
        />
      </div>

      {/* Текущие председатели */}
      {chairs.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-4">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Текущие председатели</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {chairs.map(user => (
              <div key={user.id} className="flex items-center gap-4 px-6 py-4">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold shrink-0">
                  {(user.fullName || user.email)[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">{user.fullName || "—"}</p>
                  <p className="text-xs text-slate-400">{user.email}</p>
                </div>
                <span className="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full font-semibold">
                  Председатель
                </span>
                <button
                  onClick={() => handleRemove(user.id)}
                  className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-lg transition"
                >
                  Снять
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Остальные пользователи */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">Пользователи</h2>
        </div>
        {others.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">Пользователи не найдены</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {others.map(user => (
              <div key={user.id} className="flex items-center gap-4 px-6 py-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">
                  {(user.fullName || user.email)[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">{user.fullName || "—"}</p>
                  <p className="text-xs text-slate-400">{user.email}</p>
                  <p className="text-xs text-slate-400">{user.roles?.join(", ")}</p>
                </div>
                <button
                  onClick={() => handleAssign(user.id)}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg transition"
                >
                  + Назначить
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}