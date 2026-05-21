import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { ROLES, ROLE_LABELS } from "../../constants/roles";
import { usersApi } from "../../services/api/usersApi";

export default function UsersManagementPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    try {
      const data = await usersApi.getAll();
      setUsers(data);
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateRole(userId, newRole) {
    try {
      await usersApi.updateRole(userId, newRole);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, systemRole: newRole } : u));
    } catch (err) {
      alert("Не удалось обновить роль");
    }
  }

  const filteredUsers = users.filter(u =>
    (u.fullName || "").toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const availableRoles = [
    { id: ROLES.ADMIN, label: "Админ" },
    { id: ROLES.CHAIR, label: "Председатель" },
    { id: ROLES.REVIEWER, label: "Рецензент" },
    { id: ROLES.AUTHOR, label: "Автор" },
  ];

  return (
    <div className="max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div>
          <h1 className="heading-lg mb-2">Управление пользователями</h1>
          <p className="text-slate-500 font-medium">Изменяйте роли и права доступа участников системы.</p>
        </div>
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск по имени или email..."
            className="input-field pl-12"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Пользователь</th>
              <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Управление ролями</th>
              <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredUsers.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-10 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#0F172A] flex items-center justify-center text-white font-black shadow-xl shadow-slate-200 group-hover:rotate-6 transition-transform overflow-hidden">
                      {u.avatar ? <img src={u.avatar} className="w-full h-full object-cover" /> : (u.fullName || u.email)[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900 tracking-tight">{u.fullName || "—"}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-10 py-6">
                  <div className="flex flex-wrap gap-2">
                    {availableRoles.map(role => (
                      <button
                        key={role.id}
                        onClick={() => handleUpdateRole(u.id, role.id)}
                        className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${
                          u.systemRole === role.id
                            ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                            : "bg-white border-slate-100 text-slate-400 hover:border-slate-300"
                        }`}
                      >
                        {role.label}
                      </button>
                    ))}
                  </div>
                </td>
                <td className="px-10 py-6 text-right">
                  {/* Delete functionality removed as per current API specification */}
                  <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">Действия недоступны</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(loading || filteredUsers.length === 0) && (
           <div className="p-20 text-center text-slate-400 font-bold uppercase text-[10px] tracking-widest">
              {loading ? "Загрузка..." : "Пользователи не найдены"}
           </div>
        )}
      </div>
    </div>
  );
}
