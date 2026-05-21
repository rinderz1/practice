export function Badge({ children, color = "emerald" }) {
  const colorClasses = {
    emerald: "bg-emerald-50 border-emerald-100 text-emerald-700",
    indigo: "bg-indigo-50 border-indigo-100 text-indigo-700",
    blue: "bg-blue-50 border-blue-100 text-blue-700",
    amber: "bg-amber-50 border-amber-100 text-amber-700",
  };

  return (
    <span className={`px-3 py-1 border text-[10px] font-black uppercase tracking-[0.15em] rounded-full ${colorClasses[color] || colorClasses.emerald}`}>
      {children}
    </span>
  );
}
