import { useState, useEffect, useCallback } from "react";
import { CheckCircle, AlertTriangle, Info, X } from "lucide-react";

const icons = { success: CheckCircle, error: AlertTriangle, info: Info };
const styles = {
  success: "border-emerald-500/30 bg-emerald-500/10",
  error: "border-red-500/30 bg-red-500/10",
  info: "border-blue-500/30 bg-blue-500/10",
};
const textColors = { success: "text-emerald-400", error: "text-red-400", info: "text-blue-400" };

let addToastGlobal = null;

export function showToast(message, type = "info") {
  if (addToastGlobal) addToastGlobal({ message, type, id: Date.now() });
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    setToasts(prev => [...prev, toast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== toast.id));
    }, 4000);
  }, []);

  useEffect(() => {
    addToastGlobal = addToast;
    return () => { addToastGlobal = null; };
  }, [addToast]);

  const remove = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  return (
    <div className="fixed top-20 right-6 z-[90] space-y-3 w-80">
      {toasts.map(toast => {
        const Icon = icons[toast.type];
        return (
          <div key={toast.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl ${styles[toast.type]} animate-slide-up shadow-lg`}>
            <Icon className={`w-4 h-4 flex-shrink-0 ${textColors[toast.type]}`} />
            <p className="text-sm text-ink-200 flex-1">{toast.message}</p>
            <button onClick={() => remove(toast.id)} className="text-ink-600 hover:text-ink-300">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}