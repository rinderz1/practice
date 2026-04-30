import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';

function App() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-blue-600 text-white py-6">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold">Платформа академического рецензирования</h1>
          <p className="mt-4 text-lg">Подайте статью. Получите рецензию. Опубликуйтесь.</p>
          <div className="mt-6 space-x-4">
            <button className="bg-white text-blue-600 font-semibold py-2 px-4 rounded shadow hover:bg-gray-200">Подать статью</button>
            <button className="bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow hover:bg-blue-800">Посмотреть конференции</button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-10">
        <h2 className="text-2xl font-semibold text-center mb-6">Открытые конференции</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <span className="text-sm text-blue-600 font-semibold">Информатика</span>
            <h3 className="text-xl font-bold mt-2">ICSE 2025</h3>
            <p className="text-gray-600">Международная конференция по программной инженерии</p>
            <p className="text-gray-500 mt-2">Дедлайн: 15 июня</p>
            <p className="text-gray-500">12 статей</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <span className="text-sm text-green-600 font-semibold">ИИ</span>
            <h3 className="text-xl font-bold mt-2">AI Symposium</h3>
            <p className="text-gray-600">Симпозиум по искусственному интеллекту и машинному обучению</p>
            <p className="text-gray-500 mt-2">Дедлайн: 1 июля</p>
            <p className="text-gray-500">8 статей</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <span className="text-sm text-teal-600 font-semibold">Базы данных</span>
            <h3 className="text-xl font-bold mt-2">VLDB 2025</h3>
            <p className="text-gray-600">Конференция по большим базам данных и системам</p>
            <p className="text-gray-500 mt-2">Дедлайн: 20 июля</p>
            <p className="text-gray-500">5 статей</p>
          </div>
        </div>
      </main>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);