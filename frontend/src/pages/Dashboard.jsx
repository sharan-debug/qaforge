// biome-ignore assist/source/organizeImports: imports are intentionally ordered for readability
import { useCallback, useEffect, useState } from "react";
import { api } from "../lib/api";
import { Link, useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { Library, Users, Tag, Plus, Upload, Sparkles, Activity, Zap } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import PostLoginSplash from "../components/PostLoginSplash";

// ─── Light mode tokens ───────────────────────────────────────────────────────
const L = {
  bg:          "#F8FAFC",
  card:        "#FFFFFF",
  border:      "#E2E8F0",
  shadow:      "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.04)",
  textPrimary: "#0F172A",
  textSecond:  "#475569",
  textMuted:   "#94A3B8",
  // Blue = primary actions (non-AI)
  blue:        "#2563EB",
  blueHover:   "#1D4ED8",
  // Purple = EXCLUSIVELY AI touchpoints
  purple:      "#7C3AED",
  purpleHover: "#6D28D9",
  purpleBg:    "#F5F3FF",
};

// ─── Dark mode tokens ────────────────────────────────────────────────────────
const D = {
  bg:          "#0B0F17",
  card:        "#161B26",
  border:      "#222A3A",
  borderHover: "#2D3A50",
  shadow:      "none",
  textPrimary: "#F1F5F9",
  textSecond:  "#94A3B8",
  textMuted:   "#475569",
  accent:      "#6366F1",
  accentHover: "#818CF8",
};

// Stat accent dots — muted, desaturated
const STAT_DOTS = [
  { light: "#93C5FD", dark: "#6366F1" }, // blue
  { light: "#6EE7B7", dark: "#10B981" }, // green
  { light: "#FCD34D", dark: "#F59E0B" }, // amber
];

const STAT_DEFS = [
  { label: "Features",     sub: "Knowledge entries",      icon: Library, to: "/features",    adminOnly: false, statKey: "total_features"     },
  { label: "Contributors", sub: "Active team members",    icon: Users,   to: "/admin/users", adminOnly: true,  statKey: "total_contributors" },
  { label: "Tags",         sub: "In use across features", icon: Tag,     to: "/features",    adminOnly: false, statKey: "total_tags"         },
];

// Nav cards — distinct actions only, no duplication with stat cards
// Blue for non-AI actions, Purple EXCLUSIVELY for Ask the AI
const NAV_CARDS = [
  {
    title: "Quick Add",
    desc:  "Capture new feature knowledge in under 30 s.",
    icon:  Zap,
    to:    "/features/quick-add",
    lightIcon: "#2563EB", lightIconBg: "#EFF6FF",
    darkAccent: "#6366F1",
  },
  {
    title: "New Feature",
    desc:  "Create a full feature entry with all details.",
    icon:  Plus,
    to:    "/features/new",
    lightIcon: "#2563EB", lightIconBg: "#EFF6FF",
    darkAccent: "#6366F1",
  },
  {
    title: "Import Sheet",
    desc:  "Bulk import from your Excel or CSV file.",
    icon:  Upload,
    to:    "/import",
    lightIcon: "#2563EB", lightIconBg: "#EFF6FF",
    darkAccent: "#6366F1",
  },
  {
    title: "Ask the AI",           // Purple — AI touchpoint, opens full overlay
    desc:  "Get instant answers from your knowledge base.",
    icon:  Sparkles,
    lightIcon: "#7C3AED", lightIconBg: "#F5F3FF",
    darkAccent: "#8B5CF6",
  },
];

const FEATURE_DOT = ["#93C5FD","#6EE7B7","#FCD34D","#F9A8D4","#C4B5FD","#7DD3FC"];
const FEATURE_DOT_DARK = ["#6366F1","#10B981","#F59E0B","#EC4899","#8B5CF6","#38BDF8"];

export default function Dashboard() {
  const [stats, setStats]       = useState(null);
  const [features, setFeatures] = useState([]);
  const { openChat } = useOutletContext();
  const { user }      = useAuth();
  const { isDark }    = useTheme();
  const navigate      = useNavigate();
  const location      = useLocation();

  const T = isDark ? D : L;

  const firstName = user?.name?.split(" ")[0] || user?.name || "there";
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  }).toUpperCase();

  const [showSplash, setShowSplash] = useState(() => !!location.state?.justLoggedIn);
  const hideSplash = useCallback(() => setShowSplash(false), []);

  useEffect(() => {
    (async () => {
      try {
        const [s, f] = await Promise.all([api.get("/stats"), api.get("/features?limit=6")]);
        setStats(s.data);
        setFeatures(f.data);
      } catch (e) { console.error(e); }
    })();
  }, []);

  const card = {
    background: T.card,
    border: `1px solid ${T.border}`,
    borderRadius: 12,
    boxShadow: T.shadow,
  };

  return (
    <>
      {showSplash && user && <PostLoginSplash user={user} onDone={hideSplash} />}

      <div className="p-6 md:p-10 max-w-6xl">

        {/* ── Header ───────────────────────────────────────────────── */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <p className="text-[11px] font-mono uppercase tracking-[0.18em] mb-1" style={{ color: T.textMuted }}>
              {today}
            </p>
            <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tight" style={{ color: T.textPrimary }}>
              Welcome back, {firstName}
            </h1>
            <p className="text-xs mt-2" style={{ color: T.textMuted }}>
              Central QA hub for test data, mocks, APIs, Redis and experiments.
            </p>
          </div>

          <div className="flex gap-2 shrink-0">
            {/* Ask the Agent — purple, AI-exclusive, navigates to /agent */}
            <button
              type="button"
              data-testid="dashboard-ask-agent"
              onClick={() => navigate("/agent")}
              className="inline-flex items-center gap-1.5 h-9 px-3 text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
              style={isDark ? {
                background: `${D.accent}18`,
                border: `1px solid ${D.accent}40`,
                color: D.accentHover,
              } : {
                background: L.purpleBg,
                border: `1px solid #DDD6FE`,
                color: L.purple,
                boxShadow: T.shadow,
              }}
            >
              <Sparkles className="w-4 h-4" />
              Ask the Agent
            </button>

            {/* New Feature — blue, primary action */}
            <button
              type="button"
              data-testid="dashboard-new-feature"
              onClick={() => navigate("/features/new")}
              className="inline-flex items-center gap-1.5 h-9 px-4 text-sm font-medium rounded-lg text-white transition-colors whitespace-nowrap"
              style={{ background: isDark ? D.accent : L.blue }}
              onMouseEnter={(e) => { e.currentTarget.style.background = isDark ? D.accentHover : L.blueHover; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = isDark ? D.accent : L.blue; }}
            >
              <Plus className="w-4 h-4" /> New Feature
            </button>
          </div>
        </div>

        {/* ── Stat cards — clickable ───────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          {STAT_DEFS.filter((s) => !s.adminOnly || user?.role === "admin").map((s) => {
            const defIndex = STAT_DEFS.indexOf(s);
            const dot = isDark ? STAT_DOTS[defIndex].dark : STAT_DOTS[defIndex].light;
            const Icon = s.icon;
            const hoverBorder = isDark ? D.borderHover : "#CBD5E1";
            const destination = s.to;
            const inner = (
              <>
                <div className="flex items-center gap-2 mb-5">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: dot, boxShadow: isDark ? `0 0 6px ${dot}` : "none" }}
                  />
                  <p className="text-[10px] font-mono uppercase tracking-[0.18em]" style={{ color: T.textMuted }}>
                    {s.label}
                  </p>
                </div>
                <p className="text-5xl font-heading font-black tracking-tight" style={{ color: T.textPrimary }}>
                  {stats?.[s.statKey] ?? "—"}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5" style={{ color: T.textMuted }} />
                    <p className="text-xs" style={{ color: T.textMuted }}>{s.sub}</p>
                  </div>
                  <span className="text-[10px] font-mono" style={{ color: isDark ? D.accent : L.blue, opacity: 0.7 }}>
                    view →
                  </span>
                </div>
              </>
            );
            return (
              <Link
                key={s.label}
                to={destination}
                className="block p-6 transition-all duration-150"
                style={{ ...card }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = hoverBorder;
                  e.currentTarget.style.boxShadow = isDark
                    ? `0 0 0 1px ${D.borderHover}`
                    : "0 4px 12px rgba(0,0,0,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = T.border;
                  e.currentTarget.style.boxShadow = T.shadow;
                }}
                data-testid={`stat-${s.label.toLowerCase()}`}
              >
                {inner}
              </Link>
            );
          })}
        </div>

        {/* ── Nav shortcut cards ───────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {NAV_CARDS.map((nc) => {
            const Icon      = nc.icon;
            const iconColor = isDark ? nc.darkAccent : nc.lightIcon;
            const iconBg    = isDark ? `${nc.darkAccent}18` : nc.lightIconBg;

            const body = (
              <>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mb-1"
                  style={{ background: iconBg, color: iconColor }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <p className="font-semibold text-sm leading-tight" style={{ color: T.textPrimary }}>{nc.title}</p>
                <p className="text-xs leading-snug mt-0.5" style={{ color: T.textMuted }}>{nc.desc}</p>
              </>
            );

            const cls = "flex flex-col gap-2 p-5 transition-all duration-200 h-full";
            const style = { ...card };
            const onEnter = (e) => { e.currentTarget.style.borderColor = isDark ? D.borderHover : "#CBD5E1"; };
            const onLeave = (e) => { e.currentTarget.style.borderColor = T.border; };

            // Ask the AI card navigates to /agent page
            if (!nc.to) {
              return (
                <button key={nc.title} type="button" onClick={() => navigate("/agent")} className={`text-left ${cls}`} style={style} onMouseEnter={onEnter} onMouseLeave={onLeave}>
                  {body}
                </button>
              );
            }
            return (
              <Link key={nc.title} to={nc.to} className={cls} style={style} onMouseEnter={onEnter} onMouseLeave={onLeave}>
                {body}
              </Link>
            );
          })}
        </div>

        {/* ── Recent features + Activity ───────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Recent features */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-heading font-black text-lg tracking-tight" style={{ color: T.textPrimary }}>
                Recent features
              </h2>
              <Link
                to="/features"
                data-testid="view-all-features"
                className="text-xs font-mono hover:underline"
                style={{ color: isDark ? D.accent : L.blue }}
              >
                view all →
              </Link>
            </div>

            <div style={{ ...card, padding: 0, overflow: "hidden" }}>
              {features.length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-sm mb-4" style={{ color: T.textMuted }}>
                    No features yet. Add your first, or import a sheet.
                  </p>
                  <div className="flex gap-2 justify-center">
                    <button
                      type="button"
                      data-testid="empty-add-feature"
                      onClick={() => navigate("/features/new")}
                      className="inline-flex items-center gap-1.5 h-9 px-3 text-sm rounded-lg text-white"
                      style={{ background: isDark ? D.accent : L.blue }}
                    >
                      <Plus className="w-4 h-4" />New Feature
                    </button>
                    <button
                      type="button"
                      data-testid="empty-import"
                      onClick={() => navigate("/import")}
                      className="inline-flex items-center gap-1.5 h-9 px-3 text-sm rounded-lg"
                      style={{ background: T.card, border: `1px solid ${T.border}`, color: T.textSecond }}
                    >
                      <Upload className="w-4 h-4" />Import CSV/Excel
                    </button>
                  </div>
                </div>
              )}

              {features.map((f, i) => {
                const dot = isDark ? FEATURE_DOT_DARK[i % FEATURE_DOT_DARK.length] : FEATURE_DOT[i % FEATURE_DOT.length];
                return (
                  <Link
                    key={f.id}
                    to={`/features/${f.id}`}
                    className="flex items-center gap-3 px-5 py-4 transition-colors"
                    style={{ borderTop: i > 0 ? `1px solid ${T.border}` : undefined }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = isDark ? "#1C2333" : "#F8FAFC"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                    data-testid={`recent-feature-${f.id}`}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: dot, boxShadow: isDark ? `0 0 5px ${dot}` : "none" }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm mb-0.5 truncate" style={{ color: T.textPrimary }}>{f.name}</h3>
                      <p className="text-xs truncate" style={{ color: T.textMuted }}>{f.description || "No description"}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      {(f.tags || []).slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="text-[10px] font-mono px-2 py-0.5 rounded-full"
                          style={isDark ? {
                            background: `${D.accent}18`, color: D.accentHover, border: `1px solid ${D.accent}30`,
                          } : {
                            background: "#EFF6FF", color: L.blue, border: "1px solid #BFDBFE",
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Activity */}
          <div>
            <h2 className="font-heading font-black text-lg tracking-tight mb-3 flex items-center gap-2" style={{ color: T.textPrimary }}>
              <Activity className="w-4 h-4" style={{ color: isDark ? D.accent : L.blue }} />
              Activity
            </h2>

            <div style={{ ...card, padding: "1.25rem" }} className="space-y-4">
              {(stats?.recent_activity || []).length === 0 && (
                <p className="text-xs" style={{ color: T.textMuted }}>No activity yet.</p>
              )}
              {(stats?.recent_activity || []).map((a) => (
                <div key={a.id} className="text-xs" data-testid={`activity-${a.id}`}>
                  <span className="font-semibold" style={{ color: T.textPrimary }}>{a.user_name}</span>{" "}
                  <span style={{ color: T.textMuted }}>{a.action}</span>{" "}
                  <span className="font-mono" style={{ color: T.textSecond }}>{a.feature_name}</span>
                  <div className="text-[10px] mt-1 font-mono" style={{ color: T.textMuted }}>
                    {new Date(a.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
