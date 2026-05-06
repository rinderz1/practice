import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function UsersManagementPage() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setUsers(JSON.parse(localStorage.getItem("conference_cms_users")) || []);
  }, []);

  function handleRoleChange(userId, newRole) {
    const updated = users.map(u => {
      if (u.id === userId) {
        return { ...u, roles: [newRole] };
      }
      return u;
    });
    localStorage.setItem("conference_cms_users", JSON.stringify(updated));
    setUsers(updated);
    setMessage("Роль пользователя обновлена");
    setTimeout(() => setMessage(""), 3000);
  }

  const roleLabels = {
    admin: "Администратор",
    chair: "Председатель",
    reviewer: "Рецензент",
    author: "Автор",
  };

  const roleColors = {
    admin: "bg-rose-50 text-rose-600 border-rose-100",
    chair: "bg-amber-50 text-amber-600 border-amber-100",
    reviewer: "bg-indigo-50 text-indigo-600 border-indigo-100",
    author: "bg-emerald-50 text-emerald-600 border-emerald-100",
  };

  return (
    <div className="max-w-6xl">
      <div className="mb-12">
        <h1 className="heading-lg mb-2">Управление пользователями</h1>
        <p className="text-slate-500 font-medium">Назначайте роли и управляйте доступом к системе.</p>
      </div>

      {message && (
        <div className="mb-8 p-5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold rounded-2xl flex items-center gap-3">
          <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
          {message}
        </div>
      )}

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Пользователь</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Текущая роль</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Действие</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#0F172A] flex items-center justify-center text-white font-black text-sm shadow-xl shadow-slate-200 group-hover:rotate-6 transition-transform">
                        {(u.fullName || u.email)[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 tracking-tight leading-tight">{u.fullName || u.email}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${roleColors[u.roles?.[0]] || roleColors.author}`}>
                      {roleLabels[u.roles?.[0]] || "Автор"}
                    </span>
                  </td>
                  <td className="px-10 py-6">
                    <select
                      value={u.roles?.[0] || "author"}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all cursor-pointer"
                    >
                      <option value="author">Автор</option>
                      <option value="reviewer">Рецензент</option>
                      <option value="chair">Председатель</option>
                      <option value="admin">Админ</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
