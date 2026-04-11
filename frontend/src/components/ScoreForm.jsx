import { useState } from "react";
import { Send, Lightbulb, Mic, BarChart3, TrendingUp, Bot, Globe, Rocket, CheckCircle } from "lucide-react";
import Modal from "./Modal";

const CRITERIA = [
  { key: "originality", label: "Originality of Business Idea", icon: Lightbulb },
  { key: "presentation_clarity", label: "Presentation Clarity", icon: Mic },
  { key: "financial_analysis", label: "Financial Analysis", icon: BarChart3 },
  { key: "marketing_strategies", label: "Marketing Strategies", icon: TrendingUp },
  { key: "ai_integration", label: "AI Integration", icon: Bot },
  { key: "sdgs_alignment", label: "UN SDGs Alignment", icon: Globe },
  { key: "scalability", label: "Scalability / Expansion", icon: Rocket },
];

const getScoreColor = (val) => {
  const n = parseFloat(val);
  if (isNaN(n) || val === "") return "border-ink-800";
  if (n <= 5) return "border-red-500 bg-red-500/5";
  if (n <= 10) return "border-orange-500 bg-orange-500/5";
  if (n <= 15) return "border-emerald-500 bg-emerald-500/5";
  return "border-ember-400 bg-ember-400/5";
};

const getScoreLabel = (val) => {
  const n = parseFloat(val);
  if (isNaN(n) || val === "") return "";
  if (n <= 5) return "Low";
  if (n <= 10) return "Average";
  if (n <= 15) return "Good";
  return "Excellent";
};

export default function ScoreForm({ onSubmit, loading }) {
  const [scores, setScores] = useState(CRITERIA.reduce((a, c) => ({ ...a, [c.key]: "" }), {}));
  const [comments, setComments] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (key, val) => {
    const n = parseFloat(val);
    if (val === "" || (n >= 0 && n <= 20)) setScores(p => ({ ...p, [key]: val }));
  };

  const filled = CRITERIA.filter(c => scores[c.key] !== "").length;
  const total = Object.values(scores).reduce((s, v) => s + (parseFloat(v) || 0), 0);
  const progress = (filled / CRITERIA.length) * 100;

  const handleSubmit = () => {
    for (const c of CRITERIA) {
      if (scores[c.key] === "") {
        setError(`Please fill "${c.label}"`);
        return;
      }
    }
    setError("");
    setShowConfirm(true);
  };

  const confirmSubmit = () => {
    const parsed = {};
    for (const c of CRITERIA) parsed[c.key] = parseFloat(scores[c.key]);
    setShowConfirm(false);
    onSubmit({ ...parsed, comments });
  };

  return (
    <div className="space-y-3">
      {/* Progress */}
      <div className="bg-void-800/40 border border-ink-900/30 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-ink-500 tracking-wider uppercase">Completion</span>
          <span className="text-xs font-mono text-ink-400">{filled} / {CRITERIA.length}</span>
        </div>
        <div className="h-1.5 bg-void-900 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-500 ${filled === CRITERIA.length ? 'bg-emerald-400' : 'bg-ember-400'}`}
            style={{ width: `${progress}%` }} />
        </div>
      </div>

      {CRITERIA.map((c, i) => {
        const Icon = c.icon;
        return (
          <div key={c.key} className={`flex items-center gap-4 bg-void-800/40 border rounded-xl p-4 animate-slide-up transition-all duration-300 ${getScoreColor(scores[c.key])}`} style={{ animationDelay: `${i * 60}ms` }}>
            <div className="w-9 h-9 rounded-lg bg-ember-500/10 border border-ember-500/20 flex items-center justify-center flex-shrink-0">
              <Icon className="w-4 h-4 text-ember-400" />
            </div>
            <div className="flex-1">
              <label className="text-sm text-ink-200 font-medium block">{c.label}</label>
              {scores[c.key] !== "" && (
                <span className={`text-[10px] tracking-wider uppercase ${parseFloat(scores[c.key]) <= 5 ? 'text-red-400' : parseFloat(scores[c.key]) <= 10 ? 'text-orange-400' : parseFloat(scores[c.key]) <= 15 ? 'text-emerald-400' : 'text-ember-400'}`}>
                  {getScoreLabel(scores[c.key])}
                </span>
              )}
            </div>
            <input type="number" min="0" max="20" step="0.5" value={scores[c.key]}
              onChange={e => handleChange(c.key, e.target.value)}
              className="w-20 bg-void-900 border border-ink-800 rounded-lg px-3 py-2 text-center text-ink-100 font-mono text-sm focus:border-ember-400 focus:outline-none focus:ring-1 focus:ring-ember-400/30 transition-all"
              placeholder="0-20" />
            {scores[c.key] !== "" && <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
          </div>
        );
      })}

      <div className="flex justify-end px-4 py-2">
        <span className="font-mono text-sm text-ink-400">Total: <span className="text-ember-400 font-semibold text-lg">{total.toFixed(1)}</span> <span className="text-ink-600">/ 140</span></span>
      </div>

      <div className="bg-void-800/40 border border-ink-900/30 rounded-xl p-4">
        <label className="text-sm text-ink-400 mb-2 block">Comments</label>
        <textarea value={comments} onChange={e => setComments(e.target.value)} rows={3}
          className="w-full bg-void-900 border border-ink-800 rounded-lg px-4 py-3 text-ink-200 text-sm resize-none focus:border-ember-400 focus:outline-none focus:ring-1 focus:ring-ember-400/30 transition-all"
          placeholder="Observations, strengths, areas for improvement..." />
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">{error}</div>
      )}

      <button onClick={handleSubmit} disabled={loading || filled < CRITERIA.length}
        className="w-full py-4 bg-gradient-to-r from-ember-400 via-ember-500 to-ember-600 text-void-900 font-bold text-sm tracking-wide uppercase rounded-xl hover:shadow-xl hover:shadow-ember-500/20 transition-all duration-500 active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2">
        <Send className="w-4 h-4" />
        {loading ? "Submitting..." : "Submit Evaluation"}
      </button>

      <Modal show={showConfirm} type="warning" title="Confirm Submission"
        message={`You are about to submit your evaluation with a total score of ${total.toFixed(1)}/140. This action cannot be undone.`}
        confirmText="Submit" cancelText="Review Again"
        onClose={() => setShowConfirm(false)} onConfirm={confirmSubmit} />
    </div>
  );
}