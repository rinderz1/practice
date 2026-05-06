import { useNavigate } from "react-router-dom";

export default function ForbiddenPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center">
        <div className="w-32 h-32 bg-rose-50 text-rose-600 rounded-[40px] flex items-center justify-center text-5xl mx-auto mb-10 shadow-inner">
          🚫
        </div>
        <h1 className="heading-lg mb-4 uppercase tracking-tighter">Доступ ограничен</h1>
        <p className="text-slate-500 font-medium mb-12 leading-relaxed">
          У вас нет прав для просмотра этой страницы. Пожалуйста, убедитесь, что вы вошли под правильной ролью.
        </p>
        <button
          onClick={() => navigate("/")}
          className="w-full btn-primary h-16 uppercase tracking-[0.2em] text-xs font-black shadow-2xl shadow-slate-200"
        >
          Вернуться на главную
        </button>
      </div>
    </div>
  );
}
