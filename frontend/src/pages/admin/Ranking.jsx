import { useState, useEffect } from "react";
import API from "../../api/axios";
import { Download, Printer, Trophy, Medal, FileSpreadsheet } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function Ranking() {
  const [ranking, setRanking] = useState([]);

  useEffect(() => { API.get("/ranking").then(r => setRanking(r.data)); }, []);

  const cols = [
    { key: "originality", label: "Originality" },
    { key: "presentation_clarity", label: "Presentation" },
    { key: "financial_analysis", label: "Financial" },
    { key: "marketing_strategies", label: "Marketing" },
    { key: "ai_integration", label: "AI Integration" },
    { key: "sdgs_alignment", label: "SDGs" },
    { key: "scalability", label: "Scalability" },
  ];

  const shortCols = [
    { key: "originality", label: "ORI" },
    { key: "presentation_clarity", label: "PRE" },
    { key: "financial_analysis", label: "FIN" },
    { key: "marketing_strategies", label: "MKT" },
    { key: "ai_integration", label: "AI" },
    { key: "sdgs_alignment", label: "SDG" },
    { key: "scalability", label: "SCA" },
  ];

  const exportExcel = () => {
    const data = ranking.map(r => ({
      "Rank": r.rank,
      "Team": r.name,
      "Company": r.company,
      ...cols.reduce((acc, c) => ({ ...acc, [c.label]: r[c.key] }), {}),
      "Overall": r.overall,
    }));

    const ws = XLSX.utils.json_to_sheet(data);

    // Column widths
    ws["!cols"] = [
      { wch: 6 }, { wch: 20 }, { wch: 22 },
      ...cols.map(() => ({ wch: 14 })),
      { wch: 10 },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ranking");

    // Category winners sheet
    const categoryData = cols.map(c => {
      const sorted = [...ranking].sort((a, b) => b[c.key] - a[c.key]);
      return {
        "Category": c.label,
        "Winner": sorted[0]?.name || "-",
        "Score": sorted[0]?.[c.key] || 0,
        "Runner-up": sorted[1]?.name || "-",
        "Runner-up Score": sorted[1]?.[c.key] || 0,
      };
    });
    const ws2 = XLSX.utils.json_to_sheet(categoryData);
    ws2["!cols"] = [{ wch: 16 }, { wch: 20 }, { wch: 10 }, { wch: 20 }, { wch: 14 }];
    XLSX.utils.book_append_sheet(wb, ws2, "Category Winners");

    // Best Capstone sheet
    const top3 = ranking.slice(0, 3).map(r => ({
      "Rank": r.rank,
      "Team": r.name,
      "Company": r.company,
      "Overall Score": r.overall,
    }));
    const ws3 = XLSX.utils.json_to_sheet(top3);
    ws3["!cols"] = [{ wch: 6 }, { wch: 20 }, { wch: 22 }, { wch: 14 }];
    XLSX.utils.book_append_sheet(wb, ws3, "Best Capstone");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(blob, "Capstone_Ranking_2026.xlsx");
  };

  const exportCSV = () => {
    const header = ["Rank", "Team", "Company", ...shortCols.map(c => c.label), "Overall"];
    const rows = ranking.map(r => [r.rank, r.name, r.company, ...shortCols.map(c => r[c.key]), r.overall]);
    const csv = [header, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    saveAs(blob, "Capstone_Ranking_2026.csv");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-10 print:mb-6">
        <div>
          <h1 className="font-display text-3xl text-ink-100">Final Ranking</h1>
          <p className="text-ink-500 text-sm mt-1">{ranking.length} teams ranked</p>
        </div>
        <div className="flex gap-2 print:hidden">
          <button onClick={exportExcel}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm rounded-lg hover:bg-emerald-500/20 transition-all">
            <FileSpreadsheet className="w-4 h-4" /> Excel
          </button>
          <button onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-void-800/50 border border-ink-900/30 text-ink-300 text-sm rounded-lg hover:border-ink-700 transition-all">
            <Download className="w-4 h-4" /> CSV
          </button>
          <button onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2.5 bg-void-800/50 border border-ink-900/30 text-ink-300 text-sm rounded-lg hover:border-ink-700 transition-all">
            <Printer className="w-4 h-4" /> Print
          </button>
        </div>
      </div>

      {/* Top 3 podium */}
      {ranking.length >= 3 && (
        <div className="grid grid-cols-3 gap-4 mb-10 print:hidden">
          {[1, 0, 2].map(idx => {
            const r = ranking[idx];
            if (!r) return null;
            const sizes = { 0: "py-10", 1: "py-8 mt-4", 2: "py-8 mt-4" };
            const borders = { 0: "border-ember-500/40 bg-ember-500/5", 1: "border-ink-500/30 bg-ink-500/5", 2: "border-amber-700/30 bg-amber-700/5" };
            const medals = { 0: <Trophy className="w-6 h-6 text-ember-400" />, 1: <Medal className="w-6 h-6 text-ink-300" />, 2: <Medal className="w-5 h-5 text-amber-600" /> };
            return (
              <div key={r.team_id} className={`border rounded-2xl text-center ${borders[idx]} ${sizes[idx]}`}>
                <div className="mb-3 flex justify-center">{medals[idx]}</div>
                <p className="text-xs text-ink-500 tracking-widest uppercase mb-1">#{r.rank}</p>
                <h3 className="font-display text-lg text-ink-100">{r.name}</h3>
                <p className="text-sm text-ink-500">{r.company}</p>
                <p className="font-mono text-2xl text-ember-400 font-bold mt-3">{r.overall}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Print header */}
      <div className="hidden print:block mb-6 text-center">
        <h1 className="text-2xl font-bold">Capstone Final Competition 2026</h1>
        <p className="text-sm text-gray-500">Al Akhawayn University — Official Ranking</p>
      </div>

      {/* Table */}
      <div className="bg-void-800/40 border border-ink-900/30 rounded-2xl overflow-hidden print:border print:border-gray-300 print:rounded-none">
        <div className="overflow-x-auto">
          <table className="w-full text-sm print:text-xs">
            <thead>
              <tr className="bg-void-900/60 text-ink-500 text-xs tracking-widest uppercase print:bg-gray-100 print:text-gray-700">
                <th className="px-4 py-4 text-left">#</th>
                <th className="px-4 py-4 text-left">Team</th>
                <th className="px-4 py-4 text-left">Company</th>
                {shortCols.map(c => <th key={c.key} className="px-3 py-4 text-center">{c.label}</th>)}
                <th className="px-4 py-4 text-center">Overall</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map(r => (
                <tr key={r.team_id} className={`border-t border-ink-900/20 transition-colors hover:bg-void-800/50 print:border-gray-200 ${r.rank <= 3 ? 'bg-ember-500/5 print:bg-yellow-50' : ''}`}>
                  <td className="px-4 py-4">
                    {r.rank === 1 ? <Trophy className="w-4 h-4 text-ember-400 print:hidden" /> :
                     r.rank === 2 ? <Medal className="w-4 h-4 text-ink-300 print:hidden" /> :
                     r.rank === 3 ? <Medal className="w-4 h-4 text-amber-600 print:hidden" /> : null}
                    <span className={`font-mono ${r.rank <= 3 ? 'hidden print:inline' : ''} text-ink-500`}>{r.rank}</span>
                  </td>
                  <td className="px-4 py-4 font-medium text-ink-100 font-display print:text-black">{r.name}</td>
                  <td className="px-4 py-4 text-ink-400 print:text-gray-600">{r.company}</td>
                  {shortCols.map(c => <td key={c.key} className="px-3 py-4 text-center font-mono text-ink-300 print:text-gray-700">{r[c.key]}</td>)}
                  <td className="px-4 py-4 text-center font-mono font-bold text-ember-400 text-lg print:text-black">{r.overall}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}