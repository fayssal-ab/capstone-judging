import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, LayoutDashboard, Trophy, Users, ClipboardList, Star, CalendarDays, Menu, X } from "lucide-react";
import JudgeProgress from "./JudgeProgress";
import logo from "../assets/logo/logo.png";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/login"); setOpen(false); };

  if (!user) return null;

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, icon: Icon, children }) => (
    <Link to={to} onClick={() => setOpen(false)}
      className={`flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-all duration-300
        ${isActive(to)
          ? "bg-ember-500/10 text-ember-400 border border-ember-500/20"
          : "text-ink-400 hover:text-ink-100 hover:bg-void-800/60 border border-transparent"}`}>
      <Icon className="w-4 h-4" />
      <span>{children}</span>
    </Link>
  );

  const judgeLinks = [
    { to: "/judge/agenda", icon: CalendarDays, label: "Agenda" },
    { to: "/judge/my-scores", icon: Star, label: "My Scores" },
  ];

  const adminLinks = [
    { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/admin/ranking", icon: Trophy, label: "Ranking" },
    { to: "/admin/teams", icon: ClipboardList, label: "Teams" },
    { to: "/admin/judges", icon: Users, label: "Judges" },
  ];

  const links = user.role === "judge" ? judgeLinks : adminLinks;

  return (
    <>
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-void-900/80 border-b border-ink-900/50 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <img src={logo} alt="Al Akhawayn" className="h-9 w-auto" />
            <div className="hidden sm:block leading-tight">
              <p className="font-display text-sm text-ink-100 tracking-tight">Al Akhawayn University</p>
              <p className="text-[10px] text-ink-500 tracking-widest uppercase">Capstone 2026</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {links.map(l => (
              <NavLink key={l.to} to={l.to} icon={l.icon}>{l.label}</NavLink>
            ))}
          </div>

          {/* Desktop Right */}
          <div className="hidden lg:flex items-center gap-4">
            {user.role === "judge" && <JudgeProgress />}
            <div className="text-right">
              <p className="text-xs text-ink-500 capitalize">{user.role}</p>
              <p className="text-sm text-ink-200 font-medium">{user.name}</p>
            </div>
            <button onClick={handleLogout}
              className="flex items-center gap-2 text-xs text-ink-500 hover:text-ember-400 transition-colors duration-300 border border-ink-800 hover:border-ember-400/30 px-3 py-2 rounded-lg">
              <LogOut className="w-3.5 h-3.5" />
              <span className="tracking-widest uppercase">Exit</span>
            </button>
          </div>

          {/* Mobile: progress + hamburger */}
          <div className="flex lg:hidden items-center gap-3">
            {user.role === "judge" && <JudgeProgress />}
            <button onClick={() => setOpen(!open)}
              className="p-2 text-ink-300 hover:text-ink-100 transition-colors rounded-lg hover:bg-void-800/60">
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />

          {/* Panel */}
          <div className="absolute top-16 right-0 w-72 bg-void-800 border-l border-b border-ink-900/50 rounded-bl-2xl shadow-2xl animate-slide-up">
            {/* User info */}
            <div className="px-5 py-4 border-b border-ink-900/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ember-400/20 to-ember-600/10 border border-ember-500/20 flex items-center justify-center font-display text-ember-400 font-semibold">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm text-ink-100 font-medium">{user.name}</p>
                  <p className="text-xs text-ink-500 capitalize">{user.role}</p>
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="p-3 space-y-1">
              {links.map(l => (
                <NavLink key={l.to} to={l.to} icon={l.icon}>{l.label}</NavLink>
              ))}
            </div>

            {/* Logout */}
            <div className="px-3 pb-4">
              <button onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 text-sm text-ink-400 hover:text-red-400 border border-ink-800 hover:border-red-500/30 px-4 py-3 rounded-xl transition-all">
                <LogOut className="w-4 h-4" />
                <span className="tracking-widest uppercase text-xs">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}