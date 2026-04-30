export default function HomePage() {
  const conferences = [
    {
      id: 1,
      tag: "Информатика",
      tagColor: "bg-blue-100 text-blue-700",
      title: "ICSE 2025",
      description: "Международная конференция по программной инженерии",
      deadline: "15 июня",
      papers: "12 статей"
    },
    {
      id: 2,
      tag: "ИИ",
      tagColor: "bg-green-100 text-green-700",
      title: "AI Symposium",
      description: "Симпозиум по искусственному интеллекту и машинному обучению",
      deadline: "1 июля",
      papers: "8 статей"
    },
    {
      id: 3,
      tag: "Базы данных",
      tagColor: "bg-teal-100 text-teal-700",
      title: "VLDB 2025",
      description: "Конференция по большим базам данных и системам",
      deadline: "20 июля",
      papers: "5 статей"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="mb-8">
            <span className="inline-block px-4 py-2 bg-white bg-opacity-80 rounded-full text-sm font-semibold text-blue-600 mb-6">
              Платформа академического рецензирования
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Подайте статью.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Получите рецензию.</span><br />
            Опубликуйтесь.
          </h1>

          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            Единая платформа для авторов, рецензентов и организаторов конференций. Управляйте процессом рецензирования быстро и эффективно.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              Подать статью
            </button>
            <button className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:shadow-xl border-2 border-blue-200 transform hover:scale-105 transition-all duration-300">
              Посмотреть конференции
            </button>
          </div>
        </div>
      </section>

      {/* Conferences Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Открытые конференции</h2>
          <p className="text-xl text-slate-600">Выберите интересующую вас область и подайте свою работу</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {conferences.map((conf) => (
            <div
              key={conf.id}
              className="bg-white rounded-xl shadow-md hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden group"
            >
              {/* Card Header */}
              <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:h-3 transition-all duration-300"></div>

              <div className="p-8">
                {/* Tag */}
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${conf.tagColor} mb-4`}>
                  {conf.tag}
                </span>

                {/* Title */}
                <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {conf.title}
                </h3>

                {/* Description */}
                <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                  {conf.description}
                </p>

                {/* Meta Info */}
                <div className="space-y-3 mb-8 pb-8 border-b border-slate-200">
                  <div className="flex items-center text-slate-600">
                    <span className="text-sm font-semibold mr-2">📅</span>
                    <span className="text-sm">Дедлайн: <strong>{conf.deadline}</strong></span>
                  </div>
                  <div className="flex items-center text-slate-600">
                    <span className="text-sm font-semibold mr-2">📄</span>
                    <span className="text-sm">{conf.papers}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                    Подать работу
                  </button>
                  <button className="w-full px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors">
                    Подробнее
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Почему выбирают нас</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold mb-3">Безопасность</h3>
              <p className="text-slate-300">Защищённое хранилище данных с соблюдением всех стандартов конфиденциальности</p>
            </div>

            <div className="p-8 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-3">Скорость</h3>
              <p className="text-slate-300">Быстрое рецензирование и обработка работ с минимальной задержкой</p>
            </div>

            <div className="p-8 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-bold mb-3">Глобальность</h3>
              <p className="text-slate-300">Работа с авторами и рецензентами со всего мира на одной платформе</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
