import { useNavigate } from "react-router-dom";
import { Clock, CheckCircle, ChevronRight, Calendar } from "lucide-react";

export default function TeamCard({ team, evaluated }) {
  const navigate = useNavigate();

  const formatDate = (d) => {
    if (!d) return "";
    const date = new Date(d + "T00:00:00");
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  return (
    <div className={`group relative bg-void-800/50 backdrop-blur border rounded-xl p-5 transition-all duration-500 hover:-translate-y-1 ${evaluated ? 'border-emerald-800/40' : 'border-ink-900/50 hover:border-ember-400/20'}`}>
      {evaluated && <div className="absolute top-4 right-4"><CheckCircle className="w-4 h-4 text-emerald-400" /></div>}

      <div className="mb-3">
        <h3 className="font-display text-lg text-ink-100 group-hover:text-ember-400 transition-colors">{team.name}</h3>
        <p className="text-sm text-ink-400 mt-0.5">{team.company}</p>
      </div>

      <div className="flex items-center gap-3 text-xs text-ink-500 font-mono">
        <span className="flex items-center gap-1.5 bg-void-900 px-2 py-1 rounded">
          <Calendar className="w-3 h-3" />
          {formatDate(team.date)}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="w-3 h-3" />
          {team.start_time} - {team.end_time}
        </span>
      </div>

      {!evaluated && (
        <button onClick={() => navigate(`/judge/evaluate/${team._id}`)}
          className="mt-4 w-full py-2.5 bg-gradient-to-r from-ember-500 to-ember-600 text-void-900 font-semibold text-sm rounded-lg hover:shadow-lg hover:shadow-ember-500/20 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2">
          Evaluate <ChevronRight className="w-4 h-4" />
        </button>
      )}
      {evaluated && (
        <div className="mt-4 text-center py-2 text-xs text-emerald-400/70 tracking-widest uppercase border border-emerald-800/30 rounded-lg flex items-center justify-center gap-2">
          <CheckCircle className="w-3 h-3" /> Submitted
        </div>
      )}
    </div>
  );
}