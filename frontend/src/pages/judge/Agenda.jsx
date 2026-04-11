import { useState, useEffect } from "react";
import API from "../../api/axios";
import TeamCard from "../../components/TeamCard";
import { CalendarDays, Filter } from "lucide-react";

export default function Agenda() {
  const [teams, setTeams] = useState([]);
  const [myScores, setMyScores] = useState([]);
  const [dateFilter, setDateFilter] = useState("");
  const [dates, setDates] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [t, s] = await Promise.all([
        API.get("/teams", { params: dateFilter ? { date: dateFilter } : {} }),
        API.get("/scores/mine"),
      ]);
      setTeams(t.data);
      setMyScores(s.data);

      // Extract unique dates
      if (!dateFilter) {
        const uniqueDates = [...new Set(t.data.map(tm => tm.date))].sort();
        setDates(uniqueDates);
      }
    };
    load();
  }, [dateFilter]);

  const evaluatedIds = myScores.map(s => s.team_id);

  const formatDate = (d) => {
    if (!d) return "All Dates";
    const date = new Date(d + "T00:00:00");
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="mb-10">
        <h1 className="font-display text-3xl text-ink-100">Evaluation Agenda</h1>
        <p className="text-ink-500 text-sm mt-1">{teams.length} teams — {evaluatedIds.length} evaluated</p>
      </div>

      <div className="flex items-center gap-2 mb-8 flex-wrap">
        <Filter className="w-4 h-4 text-ink-500" />
        <button onClick={() => setDateFilter("")}
          className={`px-4 py-2 text-sm rounded-lg transition-all duration-300 ${!dateFilter ? 'bg-ember-500 text-void-900 font-semibold shadow-lg shadow-ember-500/20' : 'bg-void-800/50 text-ink-400 border border-ink-900/30 hover:border-ink-700'}`}>
          All
        </button>
        {dates.map(d => (
          <button key={d} onClick={() => setDateFilter(d)}
            className={`px-4 py-2 text-sm rounded-lg transition-all duration-300 flex items-center gap-1.5 ${dateFilter === d ? 'bg-ember-500 text-void-900 font-semibold shadow-lg shadow-ember-500/20' : 'bg-void-800/50 text-ink-400 border border-ink-900/30 hover:border-ink-700'}`}>
            <CalendarDays className="w-3.5 h-3.5" /> {formatDate(d)}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {teams.map((team, i) => (
          <div key={team._id} className="animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
            <TeamCard team={team} evaluated={evaluatedIds.includes(team._id)} />
          </div>
        ))}
      </div>

      {teams.length === 0 && (
        <div className="text-center py-20 text-ink-600">
          <CalendarDays className="w-10 h-10 mx-auto mb-3 text-ink-700" />
          <p className="font-display text-xl">No teams found</p>
        </div>
      )}
    </div>
  );
}