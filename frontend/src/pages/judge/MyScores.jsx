import { useState, useEffect } from "react";
import API from "../../api/axios";

export default function MyScores() {
  const [scores, setScores] = useState([]);
  const [teams, setTeams] = useState({});

  useEffect(() => {
    const load = async () => {
      const [s, t] = await Promise.all([API.get("/scores/mine"), API.get("/teams")]);
      setScores(s.data);
      const map = {};
      t.data.forEach(tm => map[tm._id] = tm);
      setTeams(map);
    };
    load();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="font-display text-3xl text-ink-100 mb-2">My Evaluations</h1>
      <p className="text-ink-500 text-sm mb-10">{scores.length} submitted</p>

      {scores.length === 0 && <p className="text-ink-600 text-center py-20 font-display text-xl">No evaluations yet</p>}

      <div className="space-y-4">
        {scores.map((s, i) => {
          const team = teams[s.team_id];
          return (
            <div key={s._id} className="bg-void-800/40 border border-ink-900/30 rounded-xl p-5 animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-display text-lg text-ink-100">{team?.name || "—"}</h3>
                  <p className="text-sm text-ink-500">{team?.company}</p>
                </div>
                <span className="font-mono text-ember-400 text-xl font-bold">{s.total_score}</span>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {[
                  ["ORI", s.originality], ["PRE", s.presentation_clarity], ["FIN", s.financial_analysis],
                  ["MKT", s.marketing_strategies], ["AI", s.ai_integration], ["SDG", s.sdgs_alignment], ["SCA", s.scalability]
                ].map(([l, v]) => (
                  <div key={l} className="bg-void-900/60 rounded-lg p-2 text-center">
                    <p className="text-[10px] text-ink-600 tracking-wider">{l}</p>
                    <p className="text-sm text-ink-200 font-mono font-medium">{v}</p>
                  </div>
                ))}
              </div>
              {s.comments && <p className="mt-3 text-xs text-ink-500 italic border-t border-ink-900/30 pt-3">"{s.comments}"</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}