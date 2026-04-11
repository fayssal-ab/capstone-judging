import { useEffect } from "react";
import { CheckCircle, AlertTriangle, X, Info } from "lucide-react";

const icons = {
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertTriangle,
  info: Info,
};

const colors = {
  success: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  warning: "text-ember-400 bg-ember-500/10 border-ember-500/20",
  error: "text-red-400 bg-red-500/10 border-red-500/20",
  info: "text-blue-400 bg-blue-500/10 border-blue-500/20",
};

export default function Modal({ show, type = "success", title, message, onClose, onConfirm, confirmText = "OK", cancelText }) {
  useEffect(() => {
    if (show) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [show]);

  if (!show) return null;

  const Icon = icons[type];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-void-800 border border-ink-900/50 rounded-2xl p-8 w-[400px] shadow-2xl animate-fade-in">
        <button onClick={onClose} className="absolute top-4 right-4 text-ink-600 hover:text-ink-300 transition-colors">
          <X className="w-4 h-4" />
        </button>

        <div className="text-center">
          <div className={`w-14 h-14 rounded-2xl border ${colors[type]} flex items-center justify-center mx-auto mb-5`}>
            <Icon className="w-6 h-6" />
          </div>
          <h3 className="font-display text-xl text-ink-100 mb-2">{title}</h3>
          <p className="text-ink-400 text-sm leading-relaxed">{message}</p>
        </div>

        <div className="flex gap-3 mt-8">
          {cancelText && (
            <button onClick={onClose}
              className="flex-1 py-3 text-sm font-medium text-ink-400 border border-ink-800 rounded-xl hover:bg-void-900 transition-all">
              {cancelText}
            </button>
          )}
          <button onClick={onConfirm || onClose}
            className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all ${type === "success" ? "bg-emerald-500 text-void-900 hover:bg-emerald-400" : type === "error" ? "bg-red-500 text-white hover:bg-red-400" : "bg-ember-500 text-void-900 hover:bg-ember-400"}`}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}