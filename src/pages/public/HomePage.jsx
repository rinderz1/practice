import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleApplyClick = () => {
    isAuthenticated ? navigate("/author/dashboard") : navigate("/login");
  };

  const conferences = [
    {
      id: 1,
      tag: "Программная инженерия",
      title: "ICSE 2025",
      location: "Лиссабон, Португалия",
      description: "Ведущий форум для исследователей и практиков для обсуждения инноваций.",
      deadline: "15 июня",
      color: "from-emerald-500 to-teal-600"
    },
    {
      id: 2,
      tag: "Искусственный интеллект",
      title: "AI Symposium",
      location: "Токио, Япония",
      description: "Фокус на глубоком обучении и практическом применении ИИ.",
      deadline: "01 июля",
      color: "from-indigo-500 to-purple-600"
    },
    {
      id: 3,
      tag: "Системы данных",
      title: "VLDB 2025",
      location: "Сидней, Австралия",
      description: "Международная конференция по очень большим базам данных.",
      deadline: "20 июля",
      color: "from-slate-700 to-slate-900"
    }
  ];

  return (
    <div className="min-h-screen bg-[#FBFBFC]">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(circle_at_50%_-20%,#e2e8f0,transparent)]"></div>
        
        <div className="relative max-w-6xl mx-auto text-center lg:text-left">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-3/5">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-[0.2em] mb-8 mx-auto lg:mx-0">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Прием заявок открыт
              </div>
              
              <h1 className="heading-xl mb-8">
                Будущее <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 italic">Научных</span> <br/>
                Публикаций.
              </h1>
              
              <p className="text-xl text-slate-500 max-w-lg mb-12 leading-relaxed font-medium mx-auto lg:mx-0">
                Бесшовный мост между авторами и рецензентами. Управляйте, рецензируйте и публикуйте с беспрецедентной скоростью.
              </p>

              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <button 
                  onClick={handleApplyClick}
                  className="px-10 py-5 bg-[#0F172A] text-white font-bold rounded-[20px] hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-95 shadow-2xl shadow-slate-200"
                >
                  Подать статью
                </button>
                <a href="#conferences" className="px-10 py-5 bg-white text-slate-900 font-bold rounded-[20px] border border-slate-200 hover:bg-slate-50 transition-all">
                  Смотреть события
                </a>
              </div>
            </div>
            
            <div className="lg:w-2/5 relative">
              <div className="aspect-square bg-gradient-to-br from-emerald-100 to-teal-50 rounded-[48px] rotate-6 absolute inset-0 -z-10 opacity-50"></div>
              <div className="bg-white p-10 rounded-[48px] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] border border-slate-50 -rotate-3 transition-transform hover:rotate-0 duration-700">
                <div className="space-y-6">
                  <div className="h-4 w-2/3 bg-slate-100 rounded-full"></div>
                  <div className="h-4 w-full bg-slate-50 rounded-full"></div>
                  <div className="h-40 w-full bg-emerald-50 rounded-[32px] border border-emerald-100 flex items-center justify-center relative overflow-hidden group">
                     <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                     <span className="text-5xl group-hover:scale-110 transition-transform duration-500">🔬</span>
                  </div>
                  <div className="pt-6 flex justify-between gap-4">
                    <div className="h-10 flex-1 bg-slate-900 rounded-xl"></div>
                    <div className="h-10 flex-1 bg-slate-100 rounded-xl"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conference Grid */}
      <section id="conferences" className="py-32 px-4 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-4 block">Предстоящие события</span>
            <h2 className="heading-lg">Открытые наборы</h2>
          </div>
          <p className="text-slate-400 font-medium max-w-xs text-sm">Найдите престижные площадки для ваших последних исследований.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {conferences.map((conf) => (
            <div
              key={conf.id}
              className="group relative bg-white rounded-[40px] p-10 border border-slate-100 transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(16,185,129,0.15)] hover:border-emerald-100"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${conf.color} mb-8 flex items-center justify-center text-white shadow-xl shadow-current/10`}>
                <span className="text-2xl">★</span>
              </div>
              
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 mb-3 block opacity-60">
                {conf.tag}
              </span>
              
              <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-emerald-600 transition-colors tracking-tighter">
                {conf.title}
              </h3>
              
              <p className="text-slate-500 text-sm mb-10 leading-relaxed font-medium">
                {conf.description}
              </p>

              <div className="flex flex-col gap-3 mb-10">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                   <span>Локация:</span>
                   <span className="text-slate-900">{conf.location}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                   <span>Дедлайн:</span>
                   <span className="font-black">{conf.deadline}</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={handleApplyClick}
                  className="flex-1 py-4 bg-slate-50 text-slate-900 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                >
                  Подать статью
                </button>
                <Link 
                  to={`/conferences/${conf.id}`}
                  className="p-4 bg-white border border-slate-100 rounded-2xl hover:border-emerald-500 hover:text-emerald-600 transition-all shadow-sm"
                >
                  →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-4 bg-[#0F172A] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[150px] translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-20">
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400 mb-4 block">Преимущества</span>
             <h2 className="text-5xl font-black tracking-tighter">Почему выбирают нас</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="p-12 rounded-[48px] bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800/50 transition-colors group">
              <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform">
                🔒
              </div>
              <h3 className="text-xl font-black mb-4 uppercase tracking-tight">Безопасность</h3>
              <p className="text-slate-400 leading-relaxed text-sm font-medium">Защищенное хранилище данных, соответствующее международным стандартам приватности.</p>
            </div>

            <div className="p-12 rounded-[48px] bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800/50 transition-colors group">
              <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform">
                ⚡
              </div>
              <h3 className="text-xl font-black mb-4 uppercase tracking-tight">Скорость</h3>
              <p className="text-slate-400 leading-relaxed text-sm font-medium">Быстрое рецензирование и обработка рукописей с минимальной задержкой.</p>
            </div>

            <div className="p-12 rounded-[48px] bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800/50 transition-colors group">
              <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform">
                🌍
              </div>
              <h3 className="text-xl font-black mb-4 uppercase tracking-tight">Глобальность</h3>
              <p className="text-slate-400 leading-relaxed text-sm font-medium">Объединение авторов и рецензентов со всего мира на одной платформе.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
