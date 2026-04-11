import { useState, useEffect } from "react";
import API from "../../api/axios";
import { Plus, X, Pencil, Trash2, Calendar, Clock, Search } from "lucide-react";

const EMPTY = { name: "", company: "", date: "", start_time: "", end_time: "", presentation_order: 1, report_link: "" };

export default function ManageTeams() {
  const [teams, setTeams] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const load = () => API.get("/teams").then(r => setTeams(r.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async () => {
    if (editing) await API.put(`/teams/${editing}`, form);
    else await API.post("/teams", form);
    setForm(EMPTY); setEditing(null); setShowForm(false); load();
  };

  const handleEdit = t => { setForm(t); setEditing(t._id); setShowForm(true); };
  const handleDelete = async id => { if (window.confirm("Delete this team?")) { await API.delete(`/teams/${id}`); load(); } };

  const formatDate = (d) => {
    if (!d) return "";
    const date = new Date(d + "T00:00:00");
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  const dates = [...new Set(teams.map(t => t.date))].sort();
  const filtered = teams.filter(t => {
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.company.toLowerCase().includes(search.toLowerCase());
    const matchDate = !dateFilter || t.date === dateFilter;
    return matchSearch && matchDate;
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="font-display text-3xl text-ink-100">Manage Teams</h1>
          <p className="text-ink-500 text-sm mt-1">{teams.length} teams total</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setForm(EMPTY); setEditing(null); }}
          className="px-4 py-2.5 bg-ember-500 text-void-900 font-semibold text-sm rounded-lg hover:shadow-lg hover:shadow-ember-500/20 transition-all flex items-center gap-2">
          {showForm ? <><X className="w-4 h-4" /> Cancel</> : <><Plus className="w-4 h-4" /> Add Team</>}
        </button>
      </div>

      {showForm && (
        <div className="bg-void-800/40 border border-ink-900/30 rounded-2xl p-6 mb-8 animate-slide-up">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs text-ink-500 tracking-wider uppercase mb-1 block">Team Name</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full bg-void-900 border border-ink-800 rounded-lg px-3 py-2.5 text-ink-200 text-sm focus:border-ember-400 focus:outline-none" placeholder="Team Alpha" />
            </div>
            <div>
              <label className="text-xs text-ink-500 tracking-wider uppercase mb-1 block">Company</label>
              <input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })}
                className="w-full bg-void-900 border border-ink-800 rounded-lg px-3 py-2.5 text-ink-200 text-sm focus:border-ember-400 focus:outline-none" placeholder="OCP Group" />
            </div>
            <div>
              <label className="text-xs text-ink-500 tracking-wider uppercase mb-1 block">Date</label>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                className="w-full bg-void-900 border border-ink-800 rounded-lg px-3 py-2.5 text-ink-200 text-sm focus:border-ember-400 focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-ink-500 tracking-wider uppercase mb-1 block">Order</label>
              <input type="number" value={form.presentation_order} onChange={e => setForm({ ...form, presentation_order: parseInt(e.target.value) })}
                className="w-full bg-void-900 border border-ink-800 rounded-lg px-3 py-2.5 text-ink-200 text-sm focus:border-ember-400 focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-ink-500 tracking-wider uppercase mb-1 block">Start Time</label>
              <input type="time" value={form.start_time} onChange={e => setForm({ ...form, start_time: e.target.value })}
                className="w-full bg-void-900 border border-ink-800 rounded-lg px-3 py-2.5 text-ink-200 text-sm focus:border-ember-400 focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-ink-500 tracking-wider uppercase mb-1 block">End Time</label>
              <input type="time" value={form.end_time} onChange={e => setForm({ ...form, end_time: e.target.value })}
                className="w-full bg-void-900 border border-ink-800 rounded-lg px-3 py-2.5 text-ink-200 text-sm focus:border-ember-400 focus:outline-none" />
            </div>
            <div className="col-span-2">
              <label className="text-xs text-ink-500 tracking-wider uppercase mb-1 block">Report Link</label>
              <input value={form.report_link} onChange={e => setForm({ ...form, report_link: e.target.value })}
                className="w-full bg-void-900 border border-ink-800 rounded-lg px-3 py-2.5 text-ink-200 text-sm focus:border-ember-400 focus:outline-none" placeholder="https://drive.google.com/..." />
            </div>
          </div>
          <button onClick={handleSubmit}
            className="mt-4 px-6 py-2.5 bg-ember-500 text-void-900 font-semibold text-sm rounded-lg hover:shadow-lg hover:shadow-ember-500/20 transition-all">
            {editing ? "Update Team" : "Add Team"}
          </button>
        </div>
      )}

      {/* Search + Date Filter */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-600" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-void-800/50 border border-ink-900/30 rounded-lg pl-10 pr-4 py-2.5 text-ink-200 text-sm focus:border-ember-400 focus:outline-none placeholder:text-ink-600"
            placeholder="Search teams or companies..." />
        </div>
        <button onClick={() => setDateFilter("")}
          className={`px-3 py-2 text-xs rounded-lg transition-all ${!dateFilter ? 'bg-ember-500 text-void-900 font-semibold' : 'bg-void-800/50 text-ink-400 border border-ink-900/30'}`}>
          All
        </button>
        {dates.map(d => (
          <button key={d} onClick={() => setDateFilter(d)}
            className={`px-3 py-2 text-xs rounded-lg transition-all flex items-center gap-1.5 ${dateFilter === d ? 'bg-ember-500 text-void-900 font-semibold' : 'bg-void-800/50 text-ink-400 border border-ink-900/30'}`}>
            <Calendar className="w-3 h-3" /> {formatDate(d)}
          </button>
        ))}
        <span className="text-xs text-ink-600 font-mono">{filtered.length} results</span>
      </div>

      <div className="bg-void-800/40 border border-ink-900/30 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-void-900/60 text-ink-500 text-xs tracking-widest uppercase">
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Company</th>
              <th className="px-4 py-3 text-center">Date</th>
              <th className="px-4 py-3 text-center">Time</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(t => (
              <tr key={t._id} className="border-t border-ink-900/20 hover:bg-void-800/50 text-ink-300">
                <td className="px-4 py-3 font-mono text-ink-500">{t.presentation_order}</td>
                <td className="px-4 py-3 text-ink-100 font-medium">{t.name}</td>
                <td className="px-4 py-3">{t.company}</td>
                <td className="px-4 py-3 text-center">
                  <span className="bg-void-900 px-2.5 py-1 rounded text-xs font-mono inline-flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" /> {formatDate(t.date)}
                  </span>
                </td>
                <td className="px-4 py-3 text-center font-mono text-xs">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-ink-500" /> {t.start_time} – {t.end_time}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <button onClick={() => handleEdit(t)} className="text-blue-400 hover:text-blue-300 p-1.5 rounded-lg hover:bg-blue-500/10 transition-all mr-1">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(t._id)} className="text-red-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-red-500/10 transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}