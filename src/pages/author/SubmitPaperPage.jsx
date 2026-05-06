import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { PAPER_STATUS } from "../../constants/statuses";

const conferences = [
  { id: 1, title: "ICSE 2025 — Software Engineering" },
  { id: 2, title: "AI Symposium — Artificial Intelligence" },
  { id: 3, title: "VLDB 2025 — Data Systems" },
];

export default function SubmitPaperPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [conferenceId, setConferenceId] = useState("");
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file");
      e.target.value = "";
      return;
    }
    setFileName(file.name);
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || abstract.trim().length < 50 || !conferenceId || !fileName) {
      setError("Please fill in all fields correctly");
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 800));

    const articles = JSON.parse(localStorage.getItem("articles")) || [];
    const conference = conferences.find(c => c.id === Number(conferenceId));

    const newPaper = {
      id: Date.now().toString(),
      title: title.trim(),
      abstract: abstract.trim(),
      conferenceId: Number(conferenceId),
      conferenceName: conference?.title || "",
      fileName,
      author: user?.email,
      authorName: user?.fullName || user?.email,
      status: PAPER_STATUS.SUBMITTED,
      submittedAt: new Date().toLocaleDateString("en-US"),
    };

    articles.push(newPaper);
    localStorage.setItem("articles", JSON.stringify(articles));
    setLoading(false);
    navigate("/papers");
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-12">
        <h1 className="heading-lg mb-2">Submit New Manuscript</h1>
        <p className="text-slate-500 font-medium">Ready to share your work with the global community?</p>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 p-10 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Paper Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="The impact of AI on software development..."
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Target Conference</label>
                <select
                  value={conferenceId}
                  onChange={e => setConferenceId(e.target.value)}
                  className="input-field bg-white appearance-none"
                >
                  <option value="">Select an event</option>
                  {conferences.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Upload PDF</label>
                <label className="relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-200 rounded-[24px] cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/30 transition-all group">
                  <div className="text-center">
                    <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white mx-auto mb-3 group-hover:scale-110 transition-transform">
                      ↑
                    </div>
                    <p className="text-xs font-bold text-slate-900">{fileName || "Click to browse file"}</p>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">PDF only • Max 10MB</p>
                  </div>
                  <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
                </label>
              </div>
            </div>

            <div className="flex flex-col">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Abstract</label>
              <textarea
                value={abstract}
                onChange={e => setAbstract(e.target.value)}
                placeholder="A concise summary of your research findings..."
                className="input-field flex-1 min-h-[250px] resize-none leading-relaxed"
              />
              <div className="flex justify-between mt-2 px-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{abstract.length} characters</p>
                {abstract.length < 50 && <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">Min 50 required</p>}
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
              {loading ? "Processing..." : "Submit Manuscript"}
            </button>
            <button type="button" onClick={() => navigate("/papers")} className="btn-secondary h-14 px-10">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
