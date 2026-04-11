import { useState, useEffect } from "react";
import API from "../../api/axios";

export default function ManageJudges() {
  const [judges, setJudges] = useState([]);

  useEffect(() => { API.get("/auth/judges").then(r => setJudges(r.data)).catch(() => {}); }, []);

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="font-display text-3xl text-ink-100 mb-10">Jury Panel</h1>

      <div className="space-y-3">
        {judges.map((j, i) => (
          <div key={j._id} className="flex items-center justify-between bg-void-800/40 border border-ink-900/30 rounded-xl p-5 animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ember-400/20 to-ember-600/10 border border-ember-500/20 flex items-center justify-center font-display text-ember-400 font-semibold">
                {j.name.charAt(0)}
              </div>
              <div>
                <p className="text-ink-100 font-medium">{j.name}</p>
                <p className="text-xs text-ink-500">{j.email}</p>
              </div>
            </div>
            <span className={`text-xs px-3 py-1 rounded-full ${j.is_active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
              {j.is_active ? "Active" : "Inactive"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}