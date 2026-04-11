import { useState, useEffect } from "react";
import API from "../../api/axios";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => { API.get("/dashboard").then(r => setStats(r.data)); }, []);

  if (!stats) return <div className="flex justify-center py-20"><div className="w-6 h-6 border-2 border-ember-400 border-t-transparent rounded-full animate-spin" /></div>;

  const cards = [
    { label: "Teams", value: stats.total_teams, color: "from-blue-500/20 to-blue-600/5 border-blue-500/20" },
    { label: "Judges", value: stats.total_judges, color: "from-emerald-500/20 to-emerald-600/5 border-emerald-500/20" },
    { label: "Submissions", value: `${stats.total_submitted}/${stats.total_expected}`, color: "from-ember-500/20 to-ember-600/5 border-ember-500/20" },
    { label: "Progress", value: stats.progress, color: "from-purple-500/20 to-purple-600/5 border-purple-500/20" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="font-display text-3xl text-ink-100 mb-10">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {cards.map((c, i) => (
          <div key={c.label} className={`bg-gradient-to-br ${c.color} border rounded-2xl p-6 animate-slide-up`} style={{ animationDelay: `${i * 100}ms` }}>
            <p className="text-xs text-ink-500 tracking-widest uppercase">{c.label}</p>
            <p className="font-display text-3xl text-ink-100 mt-2">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-void-800/40 border border-ink-900/30 rounded-2xl p-6">
        <h2 className="font-display text-xl text-ink-200 mb-4">Missing Evaluations <span className="text-ink-600 font-mono text-sm">({stats.missing.length})</span></h2>
        {stats.missing.length === 0 ? (
          <p className="text-emerald-400 text-sm py-4 text-center">All evaluations submitted ✓</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-ink-500 text-xs tracking-widest uppercase border-b border-ink-900/50">
                  <th className="pb-3">Team</th><th className="pb-3">Judge</th>
                </tr>
              </thead>
              <tbody>
                {stats.missing.map((m, i) => (
                  <tr key={i} className="border-b border-ink-900/20 text-ink-300 hover:bg-void-800/50">
                    <td className="py-3">{m.team}</td><td className="py-3">{m.judge}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}