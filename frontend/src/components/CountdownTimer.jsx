import { useState, useEffect, useRef } from "react";
import { Radio, CheckCircle, Clock, AlertTriangle } from "lucide-react";

export default function CountdownTimer({ startTime, endTime, date }) {
  const [timeLeft, setTimeLeft] = useState(null);
  const [status, setStatus] = useState("upcoming");
  const [elapsed, setElapsed] = useState(0);
  const [total, setTotal] = useState(0);
  const [alerted, setAlerted] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // Create beep sound
    const createBeep = () => {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();
        oscillator.connect(gain);
        gain.connect(ctx.destination);
        oscillator.frequency.value = 880;
        oscillator.type = "sine";
        gain.gain.value = 0.3;
        oscillator.start();
        setTimeout(() => {
          oscillator.stop();
          ctx.close();
        }, 300);
      } catch {}
    };
    audioRef.current = createBeep;
  }, []);

  useEffect(() => {
    const parseDateTime = (timeStr, dateStr) => new Date(`${dateStr}T${timeStr}:00`);

    const start = parseDateTime(startTime, date);
    const end = parseDateTime(endTime, date);
    const totalDuration = Math.floor((end - start) / 1000);
    setTotal(totalDuration);

    const tick = () => {
      const now = new Date();
      if (now < start) {
        setStatus("upcoming");
        setTimeLeft(Math.floor((start - now) / 1000));
        setElapsed(0);
      } else if (now >= start && now <= end) {
        setStatus("live");
        const remaining = Math.floor((end - now) / 1000);
        setTimeLeft(remaining);
        setElapsed(Math.floor((now - start) / 1000));

        // Alert at 1 minute
        if (remaining <= 60 && remaining > 0 && !alerted) {
          setAlerted(true);
          if (audioRef.current) {
            audioRef.current();
            setTimeout(() => audioRef.current?.(), 400);
            setTimeout(() => audioRef.current?.(), 800);
          }
          if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 200]);
        }
      } else {
        setStatus("ended");
        setTimeLeft(0);
        setElapsed(totalDuration);
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [startTime, endTime, date, alerted]);

  const formatTime = (seconds) => {
    if (seconds === null) return "--:--";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const progress = total > 0 ? Math.min((elapsed / total) * 100, 100) : 0;

  // Circle SVG params
  const size = 200;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const getStrokeDashoffset = () => {
    if (status === "upcoming") return 0;
    if (status === "ended") return circumference;
    return circumference * (1 - progress / 100);
  };

  const getColor = () => {
    if (status === "upcoming") return "#60a5fa";
    if (status === "ended") return "#4b5563";
    if (timeLeft < 60) return "#ef4444";
    if (timeLeft < 180) return "#f6a623";
    return "#34d399";
  };

  const getTrackColor = () => {
    if (status === "live" && timeLeft < 60) return "rgba(239,68,68,0.1)";
    return "rgba(255,255,255,0.03)";
  };

  if (status === "upcoming") {
    return (
      <div className="bg-void-800/60 border border-ink-900/40 rounded-2xl p-8">
        <div className="flex flex-col items-center">
          <div className="relative mb-6">
            <svg width={size} height={size} className="transform -rotate-90">
              <circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(255,255,255,0.03)" strokeWidth={strokeWidth} fill="none" />
              <circle cx={size / 2} cy={size / 2} r={radius} stroke="#60a5fa" strokeWidth={strokeWidth} fill="none"
                strokeDasharray={circumference} strokeDashoffset={0} strokeLinecap="round"
                className="transition-all duration-1000" style={{ opacity: 0.3 }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Clock className="w-5 h-5 text-blue-400 mb-2" />
              <span className="font-mono text-3xl text-ink-100 tracking-wider">{formatTime(timeLeft)}</span>
              <span className="text-[10px] text-blue-400 tracking-widest uppercase mt-2 font-semibold">Starts In</span>
            </div>
          </div>
          <p className="text-ink-500 text-sm flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" /> Scheduled: {startTime} — {endTime}
          </p>
        </div>
      </div>
    );
  }

  if (status === "live") {
    return (
      <div className={`bg-gradient-to-br from-ember-500/10 to-void-800/60 border rounded-2xl p-8 ${timeLeft < 60 ? 'border-red-500/50 animate-pulse' : 'border-ember-500/30 animate-glow'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="absolute inset-0 w-3 h-3 rounded-full bg-red-500 animate-ping" />
            </div>
            <span className="text-xs text-red-400 tracking-widest uppercase font-bold flex items-center gap-2">
              <Radio className="w-3.5 h-3.5" /> Live Now
            </span>
          </div>
          <span className="font-mono text-xs text-ink-500">{startTime} — {endTime}</span>
        </div>

        <div className="flex flex-col items-center py-4">
          <div className="relative">
            {/* Outer glow */}
            {timeLeft < 60 && (
              <div className="absolute inset-0 rounded-full animate-ping" style={{
                boxShadow: `0 0 40px ${getColor()}40`,
                opacity: 0.3
              }} />
            )}

            <svg width={size} height={size} className="transform -rotate-90">
              {/* Track */}
              <circle cx={size / 2} cy={size / 2} r={radius} stroke={getTrackColor()} strokeWidth={strokeWidth} fill="none" />

              {/* Tick marks */}
              {Array.from({ length: 60 }).map((_, i) => {
                const angle = (i / 60) * 360;
                const rad = (angle * Math.PI) / 180;
                const isMajor = i % 5 === 0;
                const innerR = radius - (isMajor ? 12 : 8);
                const outerR = radius - 4;
                return (
                  <line key={i}
                    x1={size / 2 + innerR * Math.cos(rad)}
                    y1={size / 2 + innerR * Math.sin(rad)}
                    x2={size / 2 + outerR * Math.cos(rad)}
                    y2={size / 2 + outerR * Math.sin(rad)}
                    stroke={isMajor ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)"}
                    strokeWidth={isMajor ? 1.5 : 0.5}
                  />
                );
              })}

              {/* Progress arc */}
              <circle cx={size / 2} cy={size / 2} r={radius} stroke={getColor()} strokeWidth={strokeWidth} fill="none"
                strokeDasharray={circumference} strokeDashoffset={getStrokeDashoffset()}
                strokeLinecap="round" className="transition-all duration-1000"
                style={{ filter: `drop-shadow(0 0 6px ${getColor()}60)` }} />

              {/* Elapsed indicator dot */}
              {(() => {
                const angle = (progress / 100) * 360 - 90;
                const rad = (angle * Math.PI) / 180;
                const dotX = size / 2 + radius * Math.cos(rad);
                const dotY = size / 2 + radius * Math.sin(rad);
                return (
                  <circle cx={dotX} cy={dotY} r={5} fill={getColor()}
                    style={{ filter: `drop-shadow(0 0 4px ${getColor()})` }} />
                );
              })()}
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {timeLeft < 60 && <AlertTriangle className="w-5 h-5 text-red-400 mb-1 animate-bounce" />}
              <span className={`font-mono text-4xl tracking-wider font-bold ${timeLeft < 60 ? 'text-red-400' : timeLeft < 180 ? 'text-ember-400' : 'text-ink-100'}`}>
                {formatTime(timeLeft)}
              </span>
              <span className="text-[10px] text-ink-500 tracking-widest uppercase mt-1">remaining</span>
            </div>
          </div>
        </div>

        {/* Bottom info */}
        <div className="flex justify-between mt-4 text-[11px] text-ink-500 font-mono px-4">
          <span>{formatTime(elapsed)} elapsed</span>
          <span>{Math.round(progress)}% complete</span>
          <span>{formatTime(timeLeft)} left</span>
        </div>

        {/* 1 minute warning banner */}
        {timeLeft <= 60 && timeLeft > 0 && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-center animate-fade-in">
            <p className="text-red-400 text-sm font-semibold flex items-center justify-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Less than 1 minute remaining
            </p>
          </div>
        )}
      </div>
    );
  }

  // Ended
  return (
    <div className="bg-void-800/40 border border-ink-900/30 rounded-2xl p-8">
      <div className="flex flex-col items-center">
        <div className="relative mb-4">
          <svg width={size} height={size} className="transform -rotate-90">
            <circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(255,255,255,0.03)" strokeWidth={strokeWidth} fill="none" />
            <circle cx={size / 2} cy={size / 2} r={radius} stroke="#4b5563" strokeWidth={strokeWidth} fill="none"
              strokeDasharray={circumference} strokeDashoffset={0} strokeLinecap="round" style={{ opacity: 0.4 }} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <CheckCircle className="w-6 h-6 text-ink-600 mb-2" />
            <span className="font-mono text-3xl text-ink-600">00:00</span>
            <span className="text-[10px] text-ink-600 tracking-widest uppercase mt-1">ended</span>
          </div>
        </div>
        <p className="text-ink-600 text-sm">Duration: {startTime} — {endTime}</p>
      </div>
    </div>
  );
}