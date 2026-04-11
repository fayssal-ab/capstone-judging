import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import ToastContainer from "./components/Toast";
import Login from "./pages/Login";
import Agenda from "./pages/judge/Agenda";
import TeamEval from "./pages/judge/TeamEval";
import MyScores from "./pages/judge/MyScores";
import Dashboard from "./pages/admin/Dashboard";
import Ranking from "./pages/admin/Ranking";
import ManageTeams from "./pages/admin/ManageTeams";
import ManageJudges from "./pages/admin/ManageJudges";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <ToastContainer />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/judge/agenda" element={<ProtectedRoute role="judge"><Agenda /></ProtectedRoute>} />
          <Route path="/judge/evaluate/:teamId" element={<ProtectedRoute role="judge"><TeamEval /></ProtectedRoute>} />
          <Route path="/judge/my-scores" element={<ProtectedRoute role="judge"><MyScores /></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/ranking" element={<ProtectedRoute role="admin"><Ranking /></ProtectedRoute>} />
          <Route path="/admin/teams" element={<ProtectedRoute role="admin"><ManageTeams /></ProtectedRoute>} />
          <Route path="/admin/judges" element={<ProtectedRoute role="admin"><ManageJudges /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}