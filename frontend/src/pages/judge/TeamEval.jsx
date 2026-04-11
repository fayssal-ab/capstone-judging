import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import ScoreForm from "../../components/ScoreForm";
import CountdownTimer from "../../components/CountdownTimer";
import ReportViewer from "../../components/ReportViewer";
import Modal from "../../components/Modal";
import { showToast } from "../../components/Toast";
import { FileText, PenLine, Calendar, Clock, Lock } from "lucide-react";

export default function TeamEval() {
  const { teamId } = useParams();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("report");
  const [successModal, setSuccessModal] = useState(false);
  const [locked, setLocked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const [teamRes, scoresRes] = await Promise.all([
        API.get(`/teams/${teamId}`),
        API.get("/scores/mine"),
      ]);
      setTeam(teamRes.data);
      const alreadyScored = scoresRes.data.some(s => s.team_id === teamId);
      if (alreadyScored) setLocked(true);
    };
    load();
  }, [teamId]);

  const handleSubmit = async (scores) => {
    setLoading(true);
    try {
      await API.post("/scores", { team_id: teamId, ...scores });
      setSuccessModal(true);
      showToast("Evaluation submitted successfully", "success");
    } catch (err) {
      showToast(err.response?.data?.error || "Submission failed", "error");
    }
    setLoading(false);
  };

  const formatDate = (d) => {
    if (!d) return "";
    const date = new Date(d + "T00:00:00");
    return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  };

  if (!team) return (
    <div className="flex justify-center py-20">
      <div className="w-6 h-6 border-2 border-ember-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="bg-void-800/40 border border-ink-900/30 rounded-2xl p-6 mb-6 animate-fade-in">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-xs text-ember-400 tracking-widest uppercase font-semibold mb-1">Evaluating</p>
            <h1 className="font-display text-3xl text-ink-100">{team.name}</h1>
            <p className="text-ink-400 mt-1">{team.company}</p>
          </div>
          <div className="text-right space-y-1">
            <span className="font-mono text-xs bg-void-900 text-ink-500 px-3 py-1.5 rounded-md flex items-center gap-1.5">
              <Calendar className="w-3 h-3" /> {formatDate(team.date)}
            </span>
            <span className="font-mono text-xs text-ink-600 flex items-center justify-end gap-1.5">
              <Clock className="w-3 h-3" /> {team.start_time} — {team.end_time}
            </span>
          </div>
        </div>
        <CountdownTimer startTime={team.start_time} endTime={team.end_time} date={team.date} />
      </div>

      {locked ? (
        <div className="bg-void-800/40 border border-emerald-800/30 rounded-2xl p-10 text-center animate-fade-in">
          <Lock className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
          <h2 className="font-display text-xl text-ink-100 mb-2">Already Evaluated</h2>
          <p className="text-ink-500 text-sm mb-6">You have already submitted your evaluation for this team.</p>
          <button onClick={() => navigate("/judge/agenda")}
            className="px-6 py-3 bg-void-900 border border-ink-800 text-ink-300 text-sm rounded-xl hover:border-ink-700 transition-all">
            Back to Agenda
          </button>
        </div>
      ) : (
        <>
          <div className="flex gap-2 mb-6">
            <button onClick={() => setActiveTab("report")}
              className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === "report" ? "bg-blue-500/10 border border-blue-500/30 text-blue-400" : "bg-void-800/40 border border-ink-900/30 text-ink-500 hover:text-ink-300"}`}>
              <FileText className="w-4 h-4" /> Final Report
            </button>
            <button onClick={() => setActiveTab("score")}
              className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === "score" ? "bg-ember-500/10 border border-ember-500/30 text-ember-400" : "bg-void-800/40 border border-ink-900/30 text-ink-500 hover:text-ink-300"}`}>
              <PenLine className="w-4 h-4" /> Score & Evaluate
            </button>
          </div>

          <div className="animate-fade-in">
            {activeTab === "report" && <ReportViewer reportLink={team.report_link} teamName={team.name} />}
            {activeTab === "score" && <ScoreForm onSubmit={handleSubmit} loading={loading} />}
          </div>
        </>
      )}

      <Modal show={successModal} type="success" title="Evaluation Recorded"
        message="Your scores have been submitted successfully. Thank you for your evaluation."
        confirmText="Back to Agenda"
        onClose={() => navigate("/judge/agenda")} onConfirm={() => navigate("/judge/agenda")} />
    </div>
  );
}