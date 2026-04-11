import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import { Lock, AlertTriangle } from "lucide-react";
import logo from "../assets/logo/logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (searchParams.get("expired") === "true") setExpired(true);
  }, [searchParams]);

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", { email, code });
      login(res.data);
      navigate(res.data.role === "admin" ? "/admin/dashboard" : "/judge/agenda");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-void-950 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-ember-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-ember-400/5 rounded-full blur-3xl" />

      <div className="relative animate-fade-in">
        <div className="text-center mb-10">
          <img src={logo} alt="Al Akhawayn" className="h-20 w-auto mx-auto mb-6" />
          <h1 className="font-display text-3xl text-ink-100 tracking-tight">Al Akhawayn University</h1>
          <p className="text-ink-500 text-sm mt-2 tracking-widest uppercase">Capstone Final Competition 2026</p>
        </div>

        <div className="w-[380px] bg-void-800/40 backdrop-blur-xl border border-ink-900/50 rounded-2xl p-8 shadow-2xl shadow-black/40">
          {expired && (
            <div className="mb-4 p-3 bg-ember-500/10 border border-ember-500/20 rounded-lg text-ember-400 text-sm text-center flex items-center justify-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Session expired. Please login again.
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">{error}</div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-xs text-ink-500 tracking-widest uppercase mb-2 block">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full bg-void-900/80 border border-ink-800 rounded-xl px-4 py-3.5 text-ink-100 text-sm focus:border-ember-400 focus:outline-none focus:ring-1 focus:ring-ember-400/20 transition-all placeholder:text-ink-700"
                placeholder="judge@capstone.ma" />
            </div>
            <div>
              <label className="text-xs text-ink-500 tracking-widest uppercase mb-2 block">Access Code</label>
              <input type="password" value={code} onChange={e => setCode(e.target.value)}
                className="w-full bg-void-900/80 border border-ink-800 rounded-xl px-4 py-3.5 text-ink-100 text-sm font-mono tracking-[0.3em] focus:border-ember-400 focus:outline-none focus:ring-1 focus:ring-ember-400/20 transition-all placeholder:text-ink-700 placeholder:tracking-normal placeholder:font-body"
                placeholder="Enter your code" />
            </div>
          </div>

          <button onClick={handleLogin}
            className="w-full mt-6 py-4 bg-gradient-to-r from-ember-400 via-ember-500 to-ember-600 text-void-900 font-bold text-sm tracking-widest uppercase rounded-xl hover:shadow-xl hover:shadow-ember-500/20 transition-all duration-500 active:scale-[0.98] flex items-center justify-center gap-2">
            <Lock className="w-4 h-4" /> Enter
          </button>
        </div>

        <p className="text-center text-ink-700 text-xs mt-8 tracking-wide">Authorized jury members only</p>
      </div>
    </div>
  );
}