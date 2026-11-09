import { useState, useEffect, useRef } from "react";
import { Bot, Send, Sparkles, User, X, ThumbsDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { API } from "../lib/api";

function renderContent(text) {
  const parts = [];
  const regex = /```([\s\S]*?)```/g;
  let last = 0, m;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) parts.push({ type: "text", value: text.slice(last, m.index) });
    parts.push({ type: "code", value: m[1] });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ type: "text", value: text.slice(last) });

  return parts.map((p, idx) => {
    if (p.type === "code") return <pre key={idx}><code>{p.value.trim()}</code></pre>;
    const lines = p.value.split("\n");
    return (
      <div key={idx} className="whitespace-pre-wrap leading-relaxed">
        {lines.map((line, li) => {
          const segs = line.split(/(`[^`]+`)/g);
          return (
            <div key={li}>
              {segs.map((s, si) =>
                s.startsWith("`") && s.endsWith("`")
                  ? <code key={si}>{s.slice(1, -1)}</code>
                  : <span key={si}>{s}</span>
              )}
            </div>
          );
        })}
      </div>
    );
  });
}

const SUGGESTIONS = [
  "What are the mocks for the checkout flow?",
  "Which Redis keys are used by the cancellation feature?",
  "List all POST APIs tagged 'payments'",
];

export default function AgentPage() {
  const [messages, setMessages]   = useState([]);
  const [input, setInput]         = useState("");
  const [streaming, setStreaming] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [feedback, setFeedback]   = useState({});
  const [mode, setMode]           = useState("crisp"); // "crisp" | "detailed"
  const scrollRef = useRef(null);
  const inputRef  = useRef(null);
  const navigate  = useNavigate();

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || streaming) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: text }, { role: "assistant", content: "", sources: [] }]);
    setStreaming(true);

    try {
      const res = await fetch(`${API}/chat`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, session_id: sessionId, mode }),
      });
      if (!res.ok) throw new Error("Chat request failed");
      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const chunks = buffer.split("\n\n");
        buffer = chunks.pop();
        for (const chunk of chunks) {
          const line = chunk.trim();
          if (!line.startsWith("data:")) continue;
          try {
            const data = JSON.parse(line.slice(5).trim());
            if (data.delta) {
              setMessages((m) => {
                const copy = [...m];
                copy[copy.length - 1] = { ...copy[copy.length - 1], content: copy[copy.length - 1].content + data.delta };
                return copy;
              });
            }
            if (data.session_id) setSessionId(data.session_id);
            if (data.done && data.sources) {
              setMessages((m) => {
                const copy = [...m];
                copy[copy.length - 1] = { ...copy[copy.length - 1], sources: data.sources };
                return copy;
              });
            }
            if (data.error) {
              setMessages((m) => {
                const copy = [...m];
                copy[copy.length - 1] = { role: "assistant", content: `Error: ${data.error}`, sources: [] };
                return copy;
              });
            }
          } catch (_e) {}
        }
      }
    } catch (_e) {
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = { role: "assistant", content: "Something went wrong. Please try again.", sources: [] };
        return copy;
      });
    } finally {
      setStreaming(false);
    }
  };

  const openFeedback   = (idx) => setFeedback((f) => ({ ...f, [idx]: { open: true, text: "", submitted: false } }));
  const closeFeedback  = (idx) => setFeedback((f) => ({ ...f, [idx]: { ...f[idx], open: false } }));
  const submitFeedback = async (idx) => {
    const entry = feedback[idx];
    if (!entry?.text?.trim()) return;
    const msg = messages[idx];
    try {
      await fetch(`${API}/ai/feedback`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          ai_message: msg.content.slice(0, 2000),
          feedback: entry.text.trim(),
          feature_ids: (msg.sources || []).map((s) => s.id),
        }),
      });
      setFeedback((f) => ({ ...f, [idx]: { open: false, text: "", submitted: true } }));
    } catch (_e) {}
  };

  return (
    <div className="flex flex-col h-screen bg-[#F8FAFC] dark:bg-[#0B0F17]">

      {/* Header */}
      <div className="shrink-0 px-6 py-4 border-b border-[#E2E8F0] dark:border-[#222A3A] bg-white dark:bg-[#161B26] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-slate-800 dark:text-zinc-100 leading-tight">Ask the Agent</h1>
            <p className="text-xs text-slate-400 dark:text-zinc-500 font-mono">Claude · grounded on your team's features</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 h-8 px-3 text-xs text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <X className="w-3.5 h-3.5" /> Close
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6" data-testid="chat-panel">
        <div className="max-w-2xl mx-auto space-y-5">

          {messages.length === 0 && (
            <div className="space-y-3 pt-4">
              <p className="text-sm text-slate-500 dark:text-zinc-400">Try asking:</p>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => { setInput(s); inputRef.current?.focus(); }}
                  className="block w-full text-left text-sm p-3.5 bg-white dark:bg-[#1C2333] border border-[#E2E8F0] dark:border-[#222A3A] rounded-xl hover:border-violet-300 dark:hover:border-violet-700 text-slate-700 dark:text-zinc-300 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={`msg-${i}`} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
              {msg.role === "assistant" && (
                <div className="w-7 h-7 shrink-0 bg-violet-600 text-white rounded-lg flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}
              <div className="max-w-[85%] flex flex-col gap-2">
                <div
                  className={`chat-markdown text-sm px-4 py-3 rounded-xl ${
                    msg.role === "user"
                      ? "bg-slate-800 dark:bg-zinc-700 text-white"
                      : "bg-white dark:bg-[#1C2333] border border-[#E2E8F0] dark:border-[#222A3A] text-slate-900 dark:text-zinc-100"
                  }`}
                  data-testid={`chat-msg-${msg.role}`}
                >
                  {msg.content ? renderContent(msg.content) : <span className="text-slate-400">…</span>}
                </div>

                {msg.role === "assistant" && msg.content && !streaming && (
                  <div className="pl-1 flex flex-col gap-1.5">
                    {(msg.sources || []).length > 0 && (
                      <div className="flex flex-wrap gap-1.5" data-testid="chat-sources">
                        <span className="text-[10px] font-mono text-slate-400 self-center">sources:</span>
                        {msg.sources.map((s) => (
                          <Link
                            key={s.id}
                            to={`/features/${s.id}`}
                            className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-violet-50 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800 hover:bg-violet-100 transition-colors"
                            data-testid={`chat-source-${s.id}`}
                          >
                            {s.name}
                          </Link>
                        ))}
                      </div>
                    )}

                    {feedback[i]?.submitted ? (
                      <p className="text-[10px] font-mono text-slate-400">Thanks for the feedback.</p>
                    ) : feedback[i]?.open ? (
                      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-3 flex flex-col gap-2">
                        <p className="text-[10px] font-mono text-amber-700 dark:text-amber-400 uppercase tracking-wide">What's incorrect?</p>
                        <textarea
                          value={feedback[i].text}
                          onChange={(e) => setFeedback((f) => ({ ...f, [i]: { ...f[i], text: e.target.value } }))}
                          placeholder="Describe what's wrong or what should be corrected…"
                          rows={2}
                          className="w-full px-2 py-1.5 text-xs border border-amber-300 dark:border-amber-700 rounded-lg bg-white dark:bg-zinc-800 dark:text-zinc-100 resize-none focus:outline-none focus:ring-1 focus:ring-amber-400"
                        />
                        {(msg.sources || []).length > 0 && (
                          <div className="flex flex-wrap gap-1.5 items-center">
                            <span className="text-[10px] font-mono text-slate-500">Fix it:</span>
                            {msg.sources.map((s) => (
                              <Link
                                key={s.id}
                                to={`/features/${s.id}/edit`}
                                className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white dark:bg-zinc-800 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-700 hover:bg-violet-50 transition-colors"
                              >
                                Edit {s.name} →
                              </Link>
                            ))}
                          </div>
                        )}
                        <div className="flex gap-1.5">
                          <button type="button" onClick={() => submitFeedback(i)} disabled={!feedback[i]?.text?.trim()} className="h-7 px-3 text-[11px] bg-amber-600 hover:bg-amber-700 text-white rounded-lg disabled:opacity-40 transition-colors">Submit</button>
                          <button type="button" onClick={() => closeFeedback(i)} className="h-7 px-3 text-[11px] border border-slate-200 dark:border-zinc-700 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-400">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <button type="button" onClick={() => openFeedback(i)} className="self-start flex items-center gap-1 text-[10px] font-mono text-slate-400 hover:text-amber-600 transition-colors">
                        <ThumbsDown className="w-3 h-3" /> Flag incorrect
                      </button>
                    )}
                  </div>
                )}
              </div>

              {msg.role === "user" && (
                <div className="w-7 h-7 shrink-0 bg-slate-200 dark:bg-zinc-600 text-slate-700 dark:text-zinc-200 rounded-lg flex items-center justify-center">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Input bar — always visible at bottom */}
      <div className="shrink-0 px-4 py-4 border-t border-[#E2E8F0] dark:border-[#222A3A] bg-white dark:bg-[#161B26]">
        <div className="max-w-2xl mx-auto flex gap-2">
          <input
            ref={inputRef}
            data-testid="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="Ask about features, mocks, APIs, Redis keys…"
            disabled={streaming}
            className="flex-1 h-10 px-3 text-sm border border-[#E2E8F0] dark:border-[#222A3A] rounded-xl bg-white dark:bg-[#1C2333] text-slate-800 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent disabled:opacity-50 transition-all"
          />
          <button
            type="button"
            data-testid="chat-mode-toggle"
            aria-label="Toggle response mode"
            onClick={() => setMode((m) => (m === "crisp" ? "detailed" : "crisp"))}
            className="h-10 px-3 text-xs font-mono border border-[#E2E8F0] dark:border-[#222A3A] rounded-xl bg-white dark:bg-[#1C2333] text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
          >
            {mode === "crisp" ? "Crisp" : "Detailed"}
          </button>
          <button
            type="button"
            data-testid="chat-send-button"
            onClick={sendMessage}
            disabled={streaming || !input.trim()}
            className="h-10 px-4 bg-violet-600 hover:bg-violet-700 text-white rounded-xl disabled:opacity-40 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
