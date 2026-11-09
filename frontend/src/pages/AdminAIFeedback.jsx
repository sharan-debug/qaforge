import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Link } from "react-router-dom";
import { CheckCheck, X, MessageSquareWarning, ChevronDown, ChevronUp, ExternalLink, Clock } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const STATUS_TABS = ["all", "reviewed", "dismissed", "pending"];

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function AdminAIFeedback() {
  const { isDark } = useTheme();
  const [items, setItems]         = useState([]);
  const [tab, setTab]             = useState("all");
  const [loading, setLoading]     = useState(true);
  const [expanded, setExpanded]   = useState({});
  const [noting, setNoting]       = useState({});
  const [pendingCount, setPendingCount] = useState(0);

  const T = isDark ? {
    bg: "#0B0F17", card: "#161B26", border: "#222A3A",
    textPrimary: "#F1F5F9", textSecond: "#94A3B8", textMuted: "#475569",
  } : {
    bg: "#F8FAFC", card: "#FFFFFF", border: "#E2E8F0",
    textPrimary: "#0F172A", textSecond: "#475569", textMuted: "#94A3B8",
  };

  const card = {
    background: T.card, border: `1px solid ${T.border}`, borderRadius: 12,
    boxShadow: isDark ? "none" : "0 1px 3px rgba(0,0,0,0.05)",
  };

  const load = async (status) => {
    setLoading(true);
    try {
      const res = await api.get(`/ai/feedback?status=${status}`);
      setItems(res.data);
    } catch (_e) {}
    setLoading(false);
  };

  const loadPendingCount = async () => {
    try {
      const res = await api.get("/ai/feedback/count");
      setPendingCount(res.data.count ?? 0);
    } catch (_e) {}
  };

  useEffect(() => { load(tab); }, [tab]);

  useEffect(() => { loadPendingCount(); }, []);

  const updateStatus = async (id, status, note = "") => {
    try {
      await api.patch(`/ai/feedback/${id}`, { status, review_note: note });
      setItems((prev) => prev.filter((i) => i.id !== id));
      setPendingCount((c) => Math.max(0, c - 1));
    } catch (_e) {}
  };

  const toggleExpand = (id) => setExpanded((e) => ({ ...e, [id]: !e[id] }));

  return (
    <div className="p-6 md:p-10 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <p className="text-[11px] font-mono uppercase tracking-[0.18em] mb-1" style={{ color: T.textMuted }}>Admin</p>
        <h1 className="text-3xl font-heading font-bold tracking-tight" style={{ color: T.textPrimary }}>
          AI Feedback
        </h1>
        <p className="text-sm mt-1" style={{ color: T.textMuted }}>
          Review incorrect-response reports flagged by the team from the AI Agent.
        </p>
      </div>

      {/* Pending banner — only when not already on pending tab and there are pending items */}
      {pendingCount > 0 && tab !== "pending" && (
        <button
          type="button"
          onClick={() => setTab("pending")}
          className="w-full mb-4 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-left transition-colors"
          style={{
            background: isDark ? "rgba(109,40,217,0.15)" : "#F5F3FF",
            border: `1px solid ${isDark ? "#5B21B6" : "#DDD6FE"}`,
            color: isDark ? "#C4B5FD" : "#6D28D9",
          }}
        >
          <Clock className="w-4 h-4 shrink-0" />
          <span>
            {pendingCount} AI feedback item{pendingCount !== 1 ? "s" : ""} pending review — click to review
          </span>
        </button>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl w-fit" style={{ background: T.card, border: `1px solid ${T.border}` }}>
        {STATUS_TABS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setTab(s)}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all"
            style={tab === s ? {
              background: isDark ? "#6366F1" : "#2563EB",
              color: "#fff",
            } : {
              color: T.textSecond,
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* List */}
      {loading && <p className="text-sm" style={{ color: T.textMuted }}>Loading…</p>}
      {!loading && items.length === 0 && (
        <div style={{ ...card, padding: "2.5rem", textAlign: "center" }}>
          <MessageSquareWarning className="w-8 h-8 mx-auto mb-3" style={{ color: T.textMuted }} />
          <p className="text-sm" style={{ color: T.textMuted }}>
            {tab === "pending" ? "No pending feedback — all clear." : `No ${tab} feedback.`}
          </p>
        </div>
      )}

      <div className="space-y-4">
        {items.map((item) => {
          const isOpen = !!expanded[item.id];
          const note   = noting[item.id] ?? "";
          return (
            <div key={item.id} style={card} className="overflow-hidden">
              {/* Summary row */}
              <div className="flex items-start gap-4 p-5">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: isDark ? "#7C3AED22" : "#F5F3FF", color: "#7C3AED" }}
                >
                  <MessageSquareWarning className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-sm font-semibold" style={{ color: T.textPrimary }}>{item.user_name || item.user_email}</span>
                    <span className="text-xs" style={{ color: T.textMuted }}>{timeAgo(item.timestamp)}</span>
                    {item.status !== "pending" && (
                      <span
                        className="text-[10px] font-mono px-2 py-0.5 rounded-full"
                        style={item.status === "reviewed"
                          ? { background: "#F0FDF4", color: "#15803D", border: "1px solid #BBF7D0" }
                          : { background: "#F8FAFC", color: "#64748B", border: "1px solid #E2E8F0" }}
                      >
                        {item.status}
                      </span>
                    )}
                  </div>

                  {/* Feedback text */}
                  <p className="text-sm mb-2" style={{ color: T.textSecond }}>
                    "{item.feedback}"
                  </p>

                  {/* Linked features */}
                  {(item.feature_ids || []).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      <span className="text-[10px] font-mono" style={{ color: T.textMuted }}>features:</span>
                      {item.feature_ids.map((fid) => (
                        <Link
                          key={fid}
                          to={`/features/${fid}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-mono px-2 py-0.5 rounded-full inline-flex items-center gap-1 hover:opacity-80 transition-opacity"
                          style={{ background: "#EFF6FF", color: "#2563EB", border: "1px solid #BFDBFE" }}
                        >
                          {fid} <ExternalLink className="w-2.5 h-2.5" />
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Expand toggle for AI message */}
                  <button
                    type="button"
                    onClick={() => toggleExpand(item.id)}
                    className="flex items-center gap-1 text-[11px] font-mono transition-colors"
                    style={{ color: isDark ? "#6366F1" : "#2563EB" }}
                  >
                    {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    {isOpen ? "hide AI response" : "view AI response"}
                  </button>
                </div>

                {/* Actions — only for pending */}
                {item.status === "pending" && (
                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => updateStatus(item.id, "reviewed", note)}
                      className="flex items-center gap-1.5 h-8 px-3 text-xs font-medium rounded-lg text-white transition-colors"
                      style={{ background: "#16A34A" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#15803D"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "#16A34A"; }}
                      title="Mark as reviewed"
                    >
                      <CheckCheck className="w-3.5 h-3.5" /> Reviewed
                    </button>
                    <button
                      type="button"
                      onClick={() => updateStatus(item.id, "dismissed", note)}
                      className="flex items-center gap-1.5 h-8 px-3 text-xs font-medium rounded-lg transition-colors"
                      style={{ background: T.card, border: `1px solid ${T.border}`, color: T.textSecond }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = isDark ? "#2D3A50" : "#CBD5E1"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.border; }}
                      title="Dismiss"
                    >
                      <X className="w-3.5 h-3.5" /> Dismiss
                    </button>
                  </div>
                )}

                {/* Reviewed-by info */}
                {item.status !== "pending" && item.reviewed_by && (
                  <div className="shrink-0 text-right">
                    <p className="text-[10px] font-mono" style={{ color: T.textMuted }}>by {item.reviewed_by}</p>
                    {item.reviewed_at && (
                      <p className="text-[10px] font-mono" style={{ color: T.textMuted }}>{timeAgo(item.reviewed_at)}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Expanded AI message */}
              {isOpen && (
                <div
                  className="px-5 pb-4 pt-0"
                  style={{ borderTop: `1px solid ${T.border}` }}
                >
                  <p className="text-[10px] font-mono uppercase tracking-widest mt-4 mb-2" style={{ color: T.textMuted }}>
                    AI response that was flagged
                  </p>
                  <div
                    className="text-xs rounded-xl p-4 font-mono whitespace-pre-wrap leading-relaxed"
                    style={{ background: isDark ? "#0B0F17" : "#F8FAFC", border: `1px solid ${T.border}`, color: T.textSecond }}
                  >
                    {item.ai_message}
                  </div>

                  {/* Optional review note — only for pending items */}
                  {item.status === "pending" && (
                    <div className="mt-3">
                      <p className="text-[10px] font-mono uppercase tracking-widest mb-1" style={{ color: T.textMuted }}>
                        Note (optional)
                      </p>
                      <textarea
                        rows={2}
                        placeholder="Add a note before marking as reviewed…"
                        value={note}
                        onChange={(e) => setNoting((n) => ({ ...n, [item.id]: e.target.value }))}
                        className="w-full px-3 py-2 text-xs rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-violet-500"
                        style={{ background: T.card, border: `1px solid ${T.border}`, color: T.textPrimary }}
                      />
                    </div>
                  )}

                  {/* Show review note if already actioned */}
                  {item.status !== "pending" && item.review_note && (
                    <div className="mt-3">
                      <p className="text-[10px] font-mono uppercase tracking-widest mb-1" style={{ color: T.textMuted }}>Review note</p>
                      <p className="text-xs" style={{ color: T.textSecond }}>{item.review_note}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
