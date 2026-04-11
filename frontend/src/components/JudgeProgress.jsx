import { useState, useEffect } from "react";
import API from "../api/axios";

export default function JudgeProgress() {
  const [total, setTotal] = useState(0);
  const [done, setDone] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const [t, s] = await Promise.all([API.get("/teams"), API.get("/scores/mine")]);
        setTotal(t.data.length);
        setDone(s.data.length);
      } catch {}
    };
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  if (total === 0) return null;

  const pct = Math.round((done / total) * 100);

  return (
    <div className="flex items-center gap-3">
      <div className="w-24 h-1.5 bg-void-900 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${pct === 100 ? 'bg-emerald-400' : 'bg-ember-400'}`}
          style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-mono text-ink-500">{done}/{total}</span>
    </div>
  );
}