import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PAPER_STATUS, PAPER_STATUS_META } from "../../constants/statuses";
import { ROLES } from "../../constants/roles";
import { papersApi } from "../../services/api/papersApi";
import { usersApi } from "../../services/api/usersApi";
import { assignmentsApi } from "../../services/api/assignmentsApi";
import { reviewsApi } from "../../services/api/reviewsApi";

const statusColors = {
  [PAPER_STATUS.PENDING_REVIEW]: "bg-blue-50 text-blue-600 border-blue-100",
  [PAPER_STATUS.UNDER_REVIEW]: "bg-amber-50 text-amber-600 border-amber-100",
  [PAPER_STATUS.REVISION_REQUIRED]: "bg-orange-50 text-orange-600 border-orange-100",
  [PAPER_STATUS.ACCEPTED]: "bg-emerald-50 text-emerald-600 border-emerald-100",
  [PAPER_STATUS.REJECTED]: "bg-rose-50 text-rose-600 border-rose-100",
};

function ScoreBar({ label, value }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-slate-400">
        <span>{label}</span>
        <span>{value}/10</span>
      </div>
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${value * 10}%` }}></div>
      </div>
    </div>
  );
}

export default function ChairPaperDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [availableReviewers, setAvailableReviewers] = useState([]);
  const [selectedReviewerId, setSelectedReviewerId] = useState("");
  const [paper, setPaper] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  async function loadData() {
    setLoading(true);
    try {
      // Fetch paper first, it's critical
      const paperData = await papersApi.getById(id);
      setPaper(paperData);

      // Fetch other data in parallel, but handle their failures independently
      const [usersData, reviewsData, assignmentsData] = await Promise.allSettled([
        usersApi.getAll(),
        reviewsApi.getByPaper(id),
        assignmentsApi.getByPaper(id)
      ]);

      if (usersData.status === 'fulfilled') {
        setAvailableReviewers(usersData.value.filter(u => u.systemRole === "reviewer"));
      }

      if (reviewsData.status === 'fulfilled') {
        setReviews(reviewsData.value || []);
      }

      if (assignmentsData.status === 'fulfilled') {
        setAssignments(assignmentsData.value || []);
      }

    } catch (err) {
      console.error("Critical error loading paper", err);
      setPaper(null);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest">Загрузка...</div>;
  if (!paper) return <div className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest">Рукопись не найдена</div>;

  const statusMeta = PAPER_STATUS_META[paper.status] || { label: paper.status };
  const statusColor = statusColors[paper.status] || "bg-slate-100 text-slate-600 border-slate-200";

  function handleDownload() {
    window.open(`http://localhost:8080/api/papers/${paper.id}/download`, "_blank");
  }

  async function handleDecision(newStatus) {
    try {
      await papersApi.updateStatus(id, newStatus);
      setPaper(prev => ({ ...prev, status: newStatus }));
      setMessage(`Статус изменён на "${PAPER_STATUS_META[newStatus]?.label}"`);
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Ошибка обновления статуса");
    }
  }

  async function handleAssignReviewer() {
    if (!selectedReviewerId) {
      alert("Выберите рецензента");
      return;
    }

    setAssigning(true);
    try {
      await assignmentsApi.create({
        paperId: paper.id,
        reviewerId: selectedReviewerId
      });

      setMessage("Рецензент назначен!");
      setSelectedReviewerId("");

      // Reload data to see new assignments
      const [updatedPaper, updatedAssignments] = await Promise.all([
        papersApi.getById(id),
        assignmentsApi.getByPaper(id)
      ]);
      setPaper(updatedPaper);
      setAssignments(updatedAssignments);

      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Failed to assign reviewer", err);
      alert(err.message || "Не удалось назначить рецензента");
    } finally {
      setAssigning(false);
    }
  }

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-12">
         <button onClick={() => navigate(-1)} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">← Назад к списку</button>
         <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusColor}`}>
           {statusMeta.label}
         </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
           <div className="bg-white rounded-[48px] border border-slate-100 p-10 sm:p-12 shadow-sm">
              <h1 className="text-4xl font-black text-slate-900 mb-6 tracking-tighter leading-tight">{paper.title}</h1>
              <div className="flex flex-wrap gap-8 text-[10px] font-black uppercase tracking-widest text-slate-300 border-b border-slate-50 pb-8 mb-8">
                 <span>Автор: <span className="text-slate-900">{paper.submittingAuthor?.fullName || paper.userId || "—"}</span></span>
                 <span>Конференция: <span className="text-emerald-600">{paper.conference?.title || paper.conferenceId}</span></span>
                 <span>Подана: <span className="text-slate-900">{new Date(paper.submittedAt || paper.createdAt).toLocaleString("ru-RU")}</span></span>
              </div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-4">Аннотация</h3>
              <p className="text-slate-600 leading-relaxed font-medium italic bg-slate-50/30 p-8 rounded-3xl border border-slate-50 shadow-inner">
                "{paper.abstractText || paper.abstract}"
              </p>
           </div>

           {/* Reviews Section */}
           <div className="bg-white rounded-[48px] border border-slate-100 p-10 sm:p-12 shadow-sm">
              <h2 className="text-xl font-black text-slate-900 mb-10 tracking-tight uppercase">Рецензии экспертов</h2>

              {reviews.length === 0 ? (
                <div className="py-20 text-center border-2 border-dashed border-slate-50 rounded-[32px]">
                   <p className="text-slate-300 font-bold text-[10px] uppercase tracking-widest">Рецензии ещё не поданы</p>
                </div>
              ) : (
                <div className="space-y-10">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="bg-slate-50/50 rounded-[32px] p-8 border border-slate-100 relative overflow-hidden">
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-lg shadow-sm">👤</div>
                           <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Рецензент</p>
                              <p className="text-sm font-black text-slate-900 tracking-tight">{rev.reviewer?.fullName || "Анонимный эксперт"}</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Итог</p>
                           <p className="text-2xl font-black text-slate-900 tracking-tighter">{rev.overallScore}/10</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-10">
                        <ScoreBar label="Оригинал." value={rev.originalityScore} />
                        <ScoreBar label="Техн. кач." value={rev.technicalScore} />
                        <ScoreBar label="Ясность" value={rev.clarityScore} />
                        <ScoreBar label="Релевант." value={rev.relevanceScore} />
                      </div>

                      <div className="space-y-6">
                        <div>
                           <h4 className="text-[8px] font-black text-emerald-600 uppercase tracking-widest mb-2">Комментарий для автора</h4>     
                           <p className="text-sm text-slate-600 leading-relaxed font-medium italic">"{rev.comments}"</p>
                        </div>
                        {rev.privateComments && (
                          <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100">
                             <h4 className="text-[8px] font-black text-amber-600 uppercase tracking-widest mb-2">Приватные заметки для председателя</h4>
                             <p className="text-sm text-amber-800 leading-relaxed font-medium italic">"{rev.privateComments}"</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
           </div>

           {/* Assignment Section */}
           <div className="bg-white rounded-[48px] border border-slate-100 p-10 shadow-sm">
              <h2 className="text-xl font-black text-slate-900 mb-10 tracking-tight uppercase">Назначение рецензентов</h2>

              <div className="flex flex-col md:flex-row gap-4 items-end mb-10">
                <div className="flex-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Выбрать эксперта</label>    
                  <select
                    value={selectedReviewerId}
                    onChange={(e) => setSelectedReviewerId(e.target.value)}
                    className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
                  >
                    <option value="">Выберите из списка...</option>
                    {availableReviewers.map(u => (
                      <option key={u.id} value={u.id}>{u.fullName} ({u.email})</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleAssignReviewer}
                  disabled={assigning || !selectedReviewerId}
                  className="h-14 px-10 bg-[#0F172A] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-600 transition-all disabled:opacity-50 shadow-xl shadow-slate-200"
                >
                  {assigning ? "Назначение..." : "Назначить"}
                </button>
              </div>

              {assignments.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-6">Уже назначены:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {assignments.map((asgn) => (
                      <div key={asgn.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">      
                        <div>
                          <p className="text-sm font-black text-slate-900">{asgn.reviewer?.fullName || `ID: ${asgn.reviewerId}`}</p>
                          <p className={`text-[10px] font-bold uppercase tracking-widest ${asgn.isSubmitted ? "text-emerald-600" : "text-amber-500"}`}>
                             {asgn.isSubmitted ? "Рецензия подана" : "Ожидается"}
                          </p>
                        </div>
                        {asgn.isSubmitted && <span className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white text-xs font-black">✓</span>}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-10 text-center border-2 border-dashed border-slate-50 rounded-3xl">
                   <p className="text-slate-300 font-bold text-[10px] uppercase tracking-widest">Рецензенты пока не назначены</p>
                </div>
              )}
           </div>
        </div>

        <div className="space-y-8">
           {/* Manuscript Download */}
           {paper.filePath && (
             <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Рукопись</h3>
                <button 
                  onClick={handleDownload}
                  className="w-full py-4 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all border border-emerald-100 flex items-center justify-center gap-2"
                >
                  📥 Скачать PDF
                </button>
             </div>
           )}

           {/* Actions */}
           <div className="bg-[#0F172A] rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-8 relative z-10">Финальное решение</h3>
              <div className="space-y-3 relative z-10">
                 <button onClick={() => handleDecision(PAPER_STATUS.ACCEPTED)} className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-emerald-500/20 active:scale-95">✅ Принять</button>
                 <button onClick={() => handleDecision(PAPER_STATUS.REVISION_REQUIRED)} className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all active:scale-95">✏️ На доработку</button>
                 <button onClick={() => handleDecision(PAPER_STATUS.REJECTED)} className="w-full py-4 bg-slate-800 hover:bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all active:scale-95">❌ Отклонить</button>
              </div>
           </div>
        </div>
      </div>

      {message && (
        <div className="fixed bottom-10 right-10 p-6 bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-3xl shadow-2xl shadow-emerald-500/10 animate-slide-in z-50">
          {message}
        </div>
      )}
    </div>
  );
}
