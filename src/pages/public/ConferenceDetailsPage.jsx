import { useParams, Link } from "react-router-dom";

export default function ConferenceDetailsPage() {
  const { id } = useParams();

  // Данные на русском
  const conference = {
    1: {
      title: "ICSE 2025",
      fullTitle: "Международная конференция по программной инженерии",
      description: "ICSE является ведущим форумом для исследователей, практиков и преподавателей, где они могут представить и обсудить последние инновации, тенденции, опыт и проблемы в области программной инженерии.",
      deadline: "15 июня 2025",
      location: "Лиссабон, Португалия",
      topics: ["Методологии разработки", "Тестирование и верификация", "ИИ в программной инженерии", "Облачные вычисления"]
    },
    2: {
      title: "AI Symposium 2025",
      fullTitle: "Симпозиум по искусственному интеллекту и машинному обучению",
      description: "Ежегодный симпозиум, посвященный передовым исследованиям в области ИИ, глубокого обучения и их практического применения в различных отраслях.",
      deadline: "1 июля 2025",
      location: "Токио, Япония",
      topics: ["Глубокое обучение", "Обработка естественного языка", "Компьютерное зрение", "Этика ИИ"]
    },
    3: {
      title: "VLDB 2025",
      fullTitle: "Конференция по очень большим базам данных",
      description: "VLDB — это престижная ежегодная международная конференция по технологиям баз данных и данных, охватывающая вопросы управления данными, баз данных и информационных систем.",
      deadline: "20 июля 2025",
      location: "Сидней, Австралия",
      topics: ["Масштабируемые системы", "Аналитика больших данных", "Безопасность данных", "NoSQL и NewSQL"]
    }
  }[id] || {
    title: "Конференция не найдена",
    fullTitle: "Запрошенная конференция не существует",
    description: "",
    deadline: "",
    location: "",
    topics: []
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <Link to="/" className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 hover:text-slate-900 mb-12 inline-block transition-colors">← На главную</Link>
      
      <div className="bg-white rounded-[48px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-[#0F172A] px-12 py-20 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
          <h1 className="text-5xl font-black mb-4 tracking-tighter">{conference.title}</h1>
          <p className="text-emerald-400 text-xl font-medium tracking-tight">{conference.fullTitle}</p>
        </div>
        
        <div className="p-12 sm:p-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
            <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Дедлайн</p>
              <p className="text-slate-900 text-xl font-black tracking-tight">{conference.deadline}</p>
            </div>
            <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Место</p>
              <p className="text-slate-900 text-xl font-black tracking-tight">{conference.location}</p>
            </div>
            <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Статус</p>
              <p className="text-emerald-600 text-xl font-black tracking-tight uppercase">Открыто</p>
            </div>
          </div>

          <div className="mb-20">
            <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tighter">О конференции</h2>
            <p className="text-slate-500 text-lg leading-relaxed font-medium">{conference.description}</p>
          </div>

          <div className="mb-20">
            <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tighter">Основные темы</h2>
            <div className="flex flex-wrap gap-3">
              {conference.topics.map((topic, i) => (
                <span key={i} className="px-6 py-3 bg-emerald-50 text-emerald-700 rounded-2xl text-xs font-black uppercase tracking-widest border border-emerald-100">
                  {topic}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            <Link to="/login" className="btn-emerald h-16 px-12 text-sm uppercase tracking-widest">
              Подать статью
            </Link>
            <Link to={`/conferences/${id}/program`} className="btn-secondary h-16 px-12 text-sm uppercase tracking-widest">
              Программа
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
