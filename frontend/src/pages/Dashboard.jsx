// biome-ignore assist/source/organizeImports: imports are intentionally ordered for readability
import { useCallback, useEffect, useState } from "react";
import { api } from "../lib/api";
import { Link, useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { Library, Users, Tag, Plus, Upload, Sparkles, Activity, Zap } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import PostLoginSplash from "../components/PostLoginSplash";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [features, setFeatures] = useState([]);
  const { openChat } = useOutletContext();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const firstName = user?.name?.split(" ")[0] || user?.name || "there";

  // Show splash only once per login — consume the state so back-nav doesn't re-show it
  const [showSplash, setShowSplash] = useState(() => !!location.state?.justLoggedIn);
  const hideSplash = useCallback(() => setShowSplash(false), []);

  useEffect(() => {
    (async () => {
      try {
        const [s, f] = await Promise.all([api.get("/stats"), api.get("/features")]);
        setStats(s.data);
        setFeatures(f.data.slice(0, 6));
      } catch (e) { console.error(e); }
    })();
  }, []);

  const statCards = [
    {
      label: "Features", value: stats?.total_features ?? "—", icon: Library,
      cardBg: "bg-indigo-50 dark:bg-indigo-950/40", cardBorder: "border-indigo-200 dark:border-indigo-800",
      iconBg: "bg-indigo-100 dark:bg-indigo-900/60", iconText: "text-indigo-600 dark:text-indigo-400",
      numText: "text-indigo-700 dark:text-indigo-300",
    },
    {
      label: "Contributors", value: stats?.total_contributors ?? "—", icon: Users,
      cardBg: "bg-emerald-50 dark:bg-emerald-950/40", cardBorder: "border-emerald-200 dark:border-emerald-800",
      iconBg: "bg-emerald-100 dark:bg-emerald-900/60", iconText: "text-emerald-600 dark:text-emerald-400",
      numText: "text-emerald-700 dark:text-emerald-300",
    },
    {
      label: "Tags", value: stats?.total_tags ?? "—", icon: Tag,
      cardBg: "bg-amber-50 dark:bg-amber-950/40", cardBorder: "border-amber-200 dark:border-amber-800",
      iconBg: "bg-amber-100 dark:bg-amber-900/60", iconText: "text-amber-600 dark:text-amber-400",
      numText: "text-amber-700 dark:text-amber-300",
    },
  ];

  // Navigation shortcut cards shown at the top of the home page
  const navCards = [
    {
      title: "Browse Features",
      desc: "Search and explore all QA feature knowledge.",
      icon: Library,
      to: "/features",
      bg: "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800",
      iconBg: "bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400",
    },
    {
      title: "Quick Add",
      desc: "Capture new feature knowledge in under 30 s.",
      icon: Zap,
      to: "/features/quick-add",
      bg: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800",
      iconBg: "bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Import Sheet",
      desc: "Bulk import from your Excel or CSV file.",
      icon: Upload,
      to: "/import",
      bg: "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800",
      iconBg: "bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400",
    },
    {
      title: "Ask the AI",
      desc: "Get instant answers from your knowledge base.",
      icon: Sparkles,
      action: openChat,
      bg: "bg-violet-50 dark:bg-violet-950/40 border-violet-200 dark:border-violet-800",
      iconBg: "bg-violet-100 dark:bg-violet-900/60 text-violet-600 dark:text-violet-400",
    },
  ];

  return (
    <>
      {showSplash && user && <PostLoginSplash user={user} onDone={hideSplash} />}
      <div className="p-6 md:p-8 max-w-6xl">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-indigo-400 mb-2">Overview</p>
            <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tight text-zinc-900 dark:text-zinc-100">Welcome back, {firstName}</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">Your team&apos;s central QA hub — test data, mocks, APIs, Redis, Mongo and experiments.</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              type="button"
              data-testid="dashboard-ask-agent"
              onClick={openChat}
              className="inline-flex items-center gap-1.5 h-9 px-3 text-sm border border-indigo-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-indigo-50 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 rounded-lg transition-colors whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4 text-indigo-500 dark:text-indigo-400" /> Ask the Agent
            </button>
            <button
              type="button"
              data-testid="dashboard-new-feature"
              onClick={() => navigate("/features/new")}
              className="inline-flex items-center gap-1.5 h-9 px-3 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-sm shadow-indigo-200 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" /> New Feature
            </button>
          </div>
        </div>

        {/* Navigation shortcut cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {navCards.map((card) => {
            const Icon = card.icon;
            const cardBody = <>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${card.iconBg}`}>
                <Icon className="w-4 h-4" />
              </div>
              <p className="font-semibold text-sm text-zinc-800 dark:text-zinc-100 leading-tight">{card.title}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-snug">{card.desc}</p>
            </>;
            const cls = `flex flex-col gap-2 p-4 rounded-xl border ${card.bg} hover:shadow-md transition-shadow h-full`;
            return card.to
              ? <Link key={card.title} to={card.to} className={cls}>{cardBody}</Link>
              : <button key={card.title} type="button" onClick={card.action} className={`text-left ${cls}`}>{cardBody}</button>;
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {statCards.map((s) => (
          <div key={s.label} className={`${s.cardBg} border ${s.cardBorder} rounded-xl shadow-sm p-5`} data-testid={`stat-${s.label.toLowerCase()}`}>
            <div className="flex items-start justify-between mb-4">
              <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-indigo-400">{s.label}</p>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.iconBg} ${s.iconText}`}>
                <s.icon className="w-4 h-4" />
              </div>
            </div>
            <p className={`text-4xl font-heading font-black tracking-tight ${s.numText}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-heading font-black text-lg tracking-tight text-zinc-900 dark:text-zinc-100">Recent features</h2>
            <Link to="/features" data-testid="view-all-features" className="text-xs text-indigo-600 hover:underline font-mono">view all →</Link>
          </div>
          <div className="bg-white dark:bg-zinc-800/50 border border-indigo-100 dark:border-zinc-700 rounded-xl shadow-sm divide-y divide-indigo-50 dark:divide-zinc-700 overflow-hidden">
            {features.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-sm text-zinc-500 mb-4">No features yet. Add your first, or import a sheet.</p>
                <div className="flex gap-2 justify-center">
                  <button
                    type="button"
                    data-testid="empty-add-feature"
                    onClick={() => navigate("/features/new")}
                    className="inline-flex items-center gap-1.5 h-9 px-3 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                  >
                    <Plus className="w-4 h-4" />New Feature
                  </button>
                  <button
                    type="button"
                    data-testid="empty-import"
                    onClick={() => navigate("/import")}
                    className="inline-flex items-center gap-1.5 h-9 px-3 text-sm border border-indigo-200 bg-white hover:bg-indigo-50 text-zinc-600 rounded-lg"
                  >
                    <Upload className="w-4 h-4" />Import CSV/Excel
                  </button>
                </div>
              </div>
            )}
            {features.map((f) => (
              <Link key={f.id} to={`/features/${f.id}`} className="block p-4 hover:bg-indigo-50/40 dark:hover:bg-zinc-700/30 transition-colors" data-testid={`recent-feature-${f.id}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="font-medium text-sm mb-0.5 truncate text-zinc-800 dark:text-zinc-100">{f.name}</h3>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 truncate">{f.description || "No description"}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    {(f.tags || []).slice(0, 3).map((t) => (
                      <span key={t} className="text-[10px] font-mono px-2 py-0.5 bg-indigo-100 text-indigo-600 rounded-full">{t}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-heading font-black text-lg tracking-tight mb-3 flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
            <Activity className="w-4 h-4 text-indigo-400" /> Activity
          </h2>
          <div className="bg-white dark:bg-zinc-800/50 border border-indigo-100 dark:border-zinc-700 rounded-xl shadow-sm p-4 space-y-3">
            {(stats?.recent_activity || []).length === 0 && (
              <p className="text-xs text-zinc-400">No activity yet.</p>
            )}
            {(stats?.recent_activity || []).map((a) => (
              <div key={a.id} className="text-xs" data-testid={`activity-${a.id}`}>
                <span className="font-medium text-zinc-800 dark:text-zinc-200">{a.user_name}</span>{" "}
                <span className="text-zinc-400 dark:text-zinc-500">{a.action}</span>{" "}
                <span className="font-mono text-zinc-700 dark:text-zinc-300">{a.feature_name}</span>
                <div className="text-[10px] text-zinc-400 mt-0.5 font-mono">{new Date(a.timestamp).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
