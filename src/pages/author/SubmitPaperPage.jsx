import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { conferencesApi } from "../../services/api/conferencesApi";
import { papersApi } from "../../services/api/papersApi";

export default function SubmitPaperPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [conferenceId, setConferenceId] = useState("");
  const [fileName, setFileName] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [conferences, setConferences] = useState([]);

  useEffect(() => {
    loadConferences();
  }, []);

  async function loadConferences() {
    try {
      const data = await conferencesApi.getAll();
      setConferences(data);
    } catch (err) {
      console.error("Failed to load conferences", err);
    }
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setError("Пожалуйста, выберите PDF файл");
      e.target.value = "";
      return;
    }
    setFileName(file.name);
    setPdfFile(file);
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || abstract.trim().length < 50 || !conferenceId || !pdfFile) {
      setError("Пожалуйста, заполните все поля (минимум 50 символов в аннотации)");
      return;
    }

    setLoading(true);
    try {
      const newPaper = await papersApi.create({
        title: title.trim(),
        abstractText: abstract.trim(),
        userId: user.id,
        conferenceId: conferenceId
      });

      if (pdfFile) {
        await papersApi.uploadPdf(newPaper.id, pdfFile);
      }
      
      navigate("/papers");
    } catch (err) {
      setError(err.message || "Не удалось отправить статью");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-12">
        <h1 className="heading-lg mb-2">Подать новую рукопись</h1>
        <p className="text-slate-500 font-medium">Готовы поделиться своей работой с мировым сообществом?</p>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 p-10 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Название статьи</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Влияние ИИ на разработку ПО..."
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Целевая конференция</label>
                <select
                  value={conferenceId}
                  onChange={e => setConferenceId(e.target.value)}
                  className="input-field bg-white appearance-none"
                >
                  <option value="">Выберите событие</option>
                  {conferences.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Загрузить PDF</label>
                <label className="relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-200 rounded-[24px] cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/30 transition-all group">
                  <div className="text-center">
                    <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white mx-auto mb-3 group-hover:scale-110 transition-transform">
                      ↑
                    </div>
                    <p className="text-xs font-bold text-slate-900 truncate max-w-[200px] px-2">{fileName || "Нажмите для выбора файла"}</p>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">Только PDF • Макс 10МБ</p>
                  </div>
                  <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
                </label>
              </div>
            </div>

            <div className="flex flex-col">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Аннотация</label>
              <textarea
                value={abstract}
                onChange={e => setAbstract(e.target.value)}
                placeholder="Краткое описание результатов вашего исследования..."
                className="input-field flex-1 min-h-[250px] resize-none leading-relaxed"
              />
              <div className="flex justify-between mt-2 px-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{abstract.length} символов</p>
                {abstract.length < 50 && <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">Мин. 50 символов</p>}
              </div>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold rounded-2xl">
              {error}
            </div>
          )}

          <div className="flex items-center gap-4 pt-4 border-t border-slate-50">
            <button type="submit" disabled={loading} className="btn-primary h-14 px-10">
              {loading ? "Обработка..." : "Подать рукопись"}
            </button>
            <button type="button" onClick={() => navigate("/papers")} className="btn-secondary h-14 px-10">
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
