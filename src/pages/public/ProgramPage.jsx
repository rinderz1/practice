import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { PAPER_STATUS } from "../../constants/statuses";
import { papersApi } from "../../services/api/papersApi";

export default function ProgramPage() {
  const { id } = useParams();
  const [acceptedPapers, setAcceptedPapers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  async function loadData() {
    setLoading(true);
    try {
      const data = await papersApi.getByConference(id);
      const filtered = data.filter(a => a.status === PAPER_STATUS.ACCEPTED);
      setAcceptedPapers(filtered);
    } catch (err) {
      console.error("Failed to load program", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <Link to={`/conferences/${id}`} className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 hover:text-slate-900 mb-12 inline-block transition-colors">← К деталям конференции</Link>
      
      <div className="mb-20">
        <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter">Программа конференции</h1>
        <p className="text-slate-400 text-xl font-medium">Список принятых работ и расписание выступлений</p>
      </div>

      {loading && <p className="text-center py-20 text-slate-400 font-bold uppercase text-[10px]">Загрузка...</p>}

      {!loading && (
        <div className="space-y-10">
          <div className="bg-emerald-50 border border-emerald-100 rounded-[32px] p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
            <h2 className="text-lg font-black text-emerald-900 mb-2 uppercase tracking-tight">Статус программы</h2>
            <p className="text-emerald-700 text-sm font-medium leading-relaxed">
              Программа находится в стадии формирования. Ниже представлен список предварительно принятых работ.
            </p>
          </div>

          {acceptedPapers.length === 0 ? (
            <div className="bg-white rounded-[48px] border border-slate-100 p-24 text-center shadow-sm">
              <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center text-4xl mx-auto mb-8">
                📅
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter">Список работ пуст</h3>
              <p className="text-slate-400 font-medium">На данный момент нет принятых работ для отображения в программе.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {acceptedPapers.map((paper) => (
                <div key={paper.id} className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.06)] transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-2xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors tracking-tighter">{paper.title}</h3>
                  </div>
                  <p className="text-slate-500 text-sm mb-8 line-clamp-2 leading-relaxed font-medium">{paper.abstractText || paper.abstract}</p>
                  <div className="flex items-center gap-6 pt-6 border-t border-slate-50">
                    <div className="flex items-center gap-2">
                       <span className="w-8 h-8 bg-[#0F172A] rounded-lg flex items-center justify-center text-white text-[10px] font-black">Доклад</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-900 text-xs font-black italic">
                          {(paper.authorName || paper.author || "U")[0]}
                       </div>
                       <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">{paper.authorName || paper.author}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="bg-white rounded-[48px] border border-slate-100 p-12 sm:p-16 shadow-sm">
            <h2 className="text-3xl font-black text-slate-900 mb-12 tracking-tighter">Расписание (Пример)</h2>
            <div className="space-y-12">
              <div className="flex gap-10 group">
                <div className="flex flex-col items-center">
                   <div className="w-14 h-14 rounded-[20px] bg-slate-900 text-white flex items-center justify-center text-xs font-black shadow-xl shadow-slate-200">09:00</div>
                   <div className="w-px h-full bg-slate-100 mt-4"></div>
                </div>
                <div className="pt-2">
                   <h4 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Регистрация участников</h4>
                   <p className="text-slate-400 text-sm font-medium">Холл главного корпуса • Приветственный кофе</p>
                </div>
              </div>
              <div className="flex gap-10 group">
                <div className="flex flex-col items-center">
                   <div className="w-14 h-14 rounded-[20px] bg-emerald-500 text-white flex items-center justify-center text-xs font-black shadow-xl shadow-emerald-200">10:00</div>
                   <div className="w-px h-full bg-slate-100 mt-4 opacity-0"></div>
                </div>
                <div className="pt-2">
                   <h4 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Открытие конференции</h4>
                   <p className="text-slate-400 text-sm font-medium">Главный зал • Приветственное слово организаторов</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
