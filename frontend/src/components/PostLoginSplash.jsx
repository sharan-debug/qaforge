import { useEffect, useState } from "react";
import { Beaker } from "lucide-react";

const ROLE_LABELS = {
  admin: { label: "Admin", color: "bg-rose-100 text-rose-700 border-rose-200" },
  approver: { label: "Approver", color: "bg-amber-100 text-amber-700 border-amber-200" },
  editor: { label: "Editor", color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  viewer: { label: "Viewer", color: "bg-zinc-100 text-zinc-600 border-zinc-200" },
};

const TIPS = [
  "Search by Redis key, experiment name, or cURL snippet — not just feature name.",
  "Use Quick Add to capture knowledge in under 30 seconds.",
  "Ask the AI agent anything — it knows your whole feature library.",
  "Mark features as Verified after a test run to keep knowledge fresh.",
  "Import your existing Excel sheet to migrate knowledge in one step.",
];

export default function PostLoginSplash({ user, onDone }) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [tip] = useState(() => TIPS[Math.floor(Math.random() * TIPS.length)]);

  const firstName = user?.name?.split(" ")[0] || "there";
  const role = ROLE_LABELS[user?.role] ?? ROLE_LABELS.editor;

  useEffect(() => {
    // Animate progress bar over 1.8 s then fade out
    const start = performance.now();
    const duration = 1800;

    const raf = requestAnimationFrame(function tick(now) {
      const elapsed = now - start;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(pct);
      if (elapsed < duration) {
        requestAnimationFrame(tick);
      } else {
        setFadeOut(true);
        setTimeout(onDone, 350); // matches fade-out duration
      }
    });

    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-300"
      style={{
        background: "linear-gradient(145deg, #ECEEF8 0%, #EEF2FF 50%, #F0FDF4 100%)",
        opacity: fadeOut ? 0 : 1,
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-indigo-600 text-white flex items-center justify-center rounded-2xl shadow-lg shadow-indigo-200">
          <Beaker className="w-6 h-6" />
        </div>
        <span className="font-black text-2xl tracking-tight text-zinc-900">TestHub</span>
      </div>

      {/* Welcome card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-indigo-100/50 border border-white/60 px-10 py-8 text-center max-w-sm w-full mx-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 mb-2">Welcome back</p>
        <h1 className="text-3xl font-black tracking-tight text-zinc-900 mb-3">
          Hey, {firstName} 👋
        </h1>

        <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border ${role.color} mb-5`}>
          {role.label}
        </span>

        <p className="text-xs text-zinc-500 leading-relaxed mb-6">
          💡 <span className="text-zinc-600">{tip}</span>
        </p>

        {/* Progress bar */}
        <div className="h-1 w-full bg-indigo-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-none"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-[10px] font-mono text-zinc-400 mt-2">Loading your workspace…</p>
      </div>
    </div>
  );
}
