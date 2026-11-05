import { Link } from "react-router-dom";
import {
  Beaker,
  Search,
  Zap,
  Sparkles,
  Upload,
  ShieldCheck,
  Database,
  FlaskConical,
  Code2,
  KeyRound,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

/* ── Decorative background — CSS blur circles support dark: variants ── */
function PageBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#ECEEF8] via-[#EEF2FF] to-[#F0FDF4] dark:from-[#0D0F1F] dark:via-[#0F1120] dark:to-[#0A1A14]" />
      {/* Decorative blur orbs */}
      <div className="absolute top-[-80px] left-[-60px] w-72 h-72 rounded-full bg-indigo-200/45 dark:bg-indigo-500/15 blur-3xl" />
      <div className="absolute top-0 right-[-60px] w-80 h-80 rounded-full bg-amber-200/40 dark:bg-indigo-600/10 blur-3xl" />
      <div className="absolute top-40 right-24 w-56 h-56 rounded-full bg-emerald-200/40 dark:bg-emerald-500/10 blur-3xl" />
      <div className="absolute bottom-10 left-[-80px] w-80 h-80 rounded-full bg-indigo-200/40 dark:bg-indigo-500/15 blur-3xl" />
      <div className="absolute bottom-10 right-[-60px] w-72 h-72 rounded-full bg-emerald-200/40 dark:bg-emerald-500/10 blur-3xl" />
      <div className="absolute top-1/2 right-[-40px] w-52 h-52 rounded-full bg-violet-200/30 dark:bg-violet-500/10 blur-3xl" />
    </div>
  );
}

/* ── Sticky nav ── */
function Nav() {
  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-white/60 dark:bg-zinc-900/70">
      <div className="mx-auto max-w-6xl px-4 md:px-8 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 text-white flex items-center justify-center rounded-xl shadow-md shadow-indigo-200/60 dark:shadow-indigo-900/60">
            <Beaker className="w-4 h-4" />
          </div>
          <span className="font-heading font-black text-lg tracking-tight text-zinc-900 dark:text-white">QAForge</span>
        </div>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-500 dark:text-zinc-400">
          <a href="#problem" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Why QAForge</a>
          <a href="#features" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Features</a>
          <a href="#ai" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">AI Assistant</a>
        </nav>

        {/* CTA */}
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 h-9 px-4 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors shadow-md shadow-indigo-200/60 dark:shadow-indigo-900/60"
        >
          Sign in <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
      {/* Frosted separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-indigo-200/60 dark:via-indigo-800/40 to-transparent" />
    </header>
  );
}

/* ── Hero ── */
function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-4 md:px-8 pt-20 pb-20 text-center">
      <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-indigo-400 mb-4">
        Internal · QA Knowledge Hub
      </p>
      <h1 className="font-heading font-black text-5xl md:text-7xl tracking-tight text-zinc-900 dark:text-white leading-none mb-6"
          style={{ textWrap: "balance" }}>
        Stop asking.<br />
        <span className="text-indigo-600 dark:text-indigo-400">Start finding.</span>
      </h1>
      <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed mb-10"
         style={{ textWrap: "balance" }}>
        QAForge is your team's single source of truth for test data, Redis keys,
        mocking steps, automation APIs, and feature flags — searchable in seconds,
        no Slack thread required.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 h-11 px-6 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors shadow-md shadow-indigo-200/60 dark:shadow-indigo-900/60"
        >
          Go to QAForge <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Stat chips */}
      <div className="flex flex-wrap gap-4 justify-center mt-10">
        {[
          "Zero Slack dependency",
          "Full-text search across every field",
          "AI answers from your own data",
        ].map((s) => (
          <span key={s} className="flex items-center gap-1.5 bg-white/70 dark:bg-zinc-800/60 border border-indigo-100 dark:border-zinc-700 px-3 py-1.5 rounded-full text-xs font-mono text-zinc-500 dark:text-zinc-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            {s}
          </span>
        ))}
      </div>
    </section>
  );
}

/* ── Problem section ── */
const PROBLEMS = [
  {
    emoji: "💬",
    title: "\"Who knows the setup for this feature?\"",
    desc: "Every test session starts with a Slack ping. The answer is in someone's head.",
  },
  {
    emoji: "📄",
    title: "Knowledge scattered across sheets",
    desc: "Redis keys in one file, mock configs in another, API examples in a third — if you can find them.",
  },
  {
    emoji: "🚶",
    title: "Knowledge walks when people leave",
    desc: "A QA moves team and their setup knowledge disappears. Onboarding the next person takes weeks.",
  },
];

function ProblemSection() {
  return (
    <section id="problem" className="mx-auto max-w-6xl px-4 md:px-8 pb-24">
      <div className="text-center mb-12">
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-indigo-400 mb-3">The problem</p>
        <h2 className="font-heading font-black text-3xl md:text-4xl tracking-tight text-zinc-900 dark:text-white"
            style={{ textWrap: "balance" }}>
          QA knowledge is everywhere — except where you need it
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PROBLEMS.map((p) => (
          <div key={p.title}
            className="bg-white/70 dark:bg-zinc-800/60 border border-indigo-100 dark:border-zinc-700 rounded-2xl p-6 shadow-sm backdrop-blur-sm">
            <div className="text-3xl mb-4">{p.emoji}</div>
            <h3 className="font-heading font-black text-base text-zinc-900 dark:text-white mb-2 leading-snug"
                style={{ textWrap: "balance" }}>
              {p.title}
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Feature grid ── */
const FEATURES = [
  {
    icon: Search,
    color: "indigo",
    title: "Search everything",
    desc: "Full-text search across feature names, test data, Redis keys, experiment names, cURL APIs, and MongoDB collections — not just titles.",
  },
  {
    icon: Zap,
    color: "emerald",
    title: "Quick Add",
    desc: "Capture feature knowledge in under 30 seconds. Select a core feature, paste your notes, hit save. No mandatory fields.",
  },
  {
    icon: KeyRound,
    color: "amber",
    title: "Redis keys",
    desc: "Store key patterns like r:jar:cancellation:{user_id} directly on the feature. Find the right key without opening Redis tooling.",
  },
  {
    icon: FlaskConical,
    color: "violet",
    title: "Experiments & flags",
    desc: "Track experiment names, available options, and the required variant (CONTROL / TEST / VARIANT_A) alongside the feature that uses them.",
  },
  {
    icon: Code2,
    color: "sky",
    title: "Automation APIs",
    desc: "Store cURL commands as-is. The automation team can copy and run them instantly — no reconstructing endpoints from memory.",
  },
  {
    icon: Database,
    color: "rose",
    title: "MongoDB collections",
    desc: "Know exactly which collections a feature touches before you write a single test query.",
  },
  {
    icon: Upload,
    color: "orange",
    title: "Bulk import",
    desc: "Already have an Excel sheet? Import it in one step. Preview what will be created, confirm, and migrate your team's knowledge instantly.",
  },
  {
    icon: ShieldCheck,
    color: "emerald",
    title: "Roles & audit trail",
    desc: "Viewer, Editor, Approver, Admin. Every create, edit, delete, and import is recorded so changes are always traceable.",
  },
];

const COLOR_MAP = {
  indigo:  { bg: "bg-indigo-50 border-indigo-100 dark:bg-indigo-900/30 dark:border-indigo-800/50",   icon: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400" },
  emerald: { bg: "bg-emerald-50 border-emerald-100 dark:bg-emerald-900/30 dark:border-emerald-800/50", icon: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400" },
  amber:   { bg: "bg-amber-50 border-amber-100 dark:bg-amber-900/30 dark:border-amber-800/50",       icon: "bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400" },
  violet:  { bg: "bg-violet-50 border-violet-100 dark:bg-violet-900/30 dark:border-violet-800/50",   icon: "bg-violet-100 text-violet-600 dark:bg-violet-900/50 dark:text-violet-400" },
  sky:     { bg: "bg-sky-50 border-sky-100 dark:bg-sky-900/30 dark:border-sky-800/50",               icon: "bg-sky-100 text-sky-600 dark:bg-sky-900/50 dark:text-sky-400" },
  rose:    { bg: "bg-rose-50 border-rose-100 dark:bg-rose-900/30 dark:border-rose-800/50",           icon: "bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-400" },
  orange:  { bg: "bg-orange-50 border-orange-100 dark:bg-orange-900/30 dark:border-orange-800/50",   icon: "bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-400" },
};

function FeaturesSection() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 md:px-8 pb-24">
      <div className="text-center mb-12">
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-indigo-400 mb-3">Features</p>
        <h2 className="font-heading font-black text-3xl md:text-4xl tracking-tight text-zinc-900 dark:text-white"
            style={{ textWrap: "balance" }}>
          Everything a QA needs, in one place
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {FEATURES.map((f) => {
          const Icon = f.icon;
          const c = COLOR_MAP[f.color] || COLOR_MAP.indigo;
          return (
            <div key={f.title}
              className={`${c.bg} border rounded-2xl p-5 shadow-sm backdrop-blur-sm flex flex-col gap-3`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${c.icon} shrink-0`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-heading font-black text-sm text-zinc-900 dark:text-white mb-1">{f.title}</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ── AI spotlight ── */
function AISection() {
  return (
    <section id="ai" className="mx-auto max-w-6xl px-4 md:px-8 pb-24">
      <div className="bg-white/70 dark:bg-zinc-800/60 border border-indigo-100 dark:border-zinc-700 rounded-3xl shadow-sm backdrop-blur-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Text */}
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-6">
              <Sparkles className="w-5 h-5" />
            </div>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-indigo-400 mb-3">AI Assistant</p>
            <h2 className="font-heading font-black text-3xl md:text-4xl tracking-tight text-zinc-900 dark:text-white mb-4"
                style={{ textWrap: "balance" }}>
              Ask instead of search
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6">
              The built-in AI assistant reads your entire QAForge knowledge base.
              Ask in plain English — it answers with the exact stored data and
              tells you which feature it came from.
            </p>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
              {[
                "What Redis keys does the cancellation flow use?",
                "How do I mock the eligibility API?",
                "Which features have a CONTROL / TEST experiment?",
              ].map((q) => (
                <li key={q} className="flex items-start gap-2">
                  <span className="text-indigo-400 font-mono text-xs mt-0.5 shrink-0">→</span>
                  <span className="italic text-zinc-500 dark:text-zinc-400 text-xs">"{q}"</span>
                </li>
              ))}
            </ul>
            <p className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 mt-6">
              Read-only · API key stays server-side · cites sources
            </p>
          </div>

          {/* Mock chat UI */}
          <div className="bg-gradient-to-br from-indigo-50/80 to-violet-50/80 dark:from-indigo-900/30 dark:to-violet-900/20 p-8 md:p-10 flex flex-col justify-center gap-4">
            {/* User bubble */}
            <div className="flex justify-end">
              <div className="bg-indigo-600 text-white text-xs px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-xs shadow-sm">
                What Redis keys does the cancellation flow use?
              </div>
            </div>
            {/* AI bubble */}
            <div className="flex justify-start gap-2.5">
              <div className="w-7 h-7 bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="bg-white dark:bg-zinc-800 border border-indigo-100 dark:border-zinc-700 text-xs px-4 py-3 rounded-2xl rounded-tl-sm max-w-xs shadow-sm text-zinc-700 dark:text-zinc-200 leading-relaxed">
                Based on the <span className="font-semibold text-zinc-900 dark:text-white">Precancellation</span> feature:
                <div className="mt-2 font-mono text-[10px] bg-indigo-50 dark:bg-indigo-900/40 rounded-lg px-3 py-2 text-indigo-700 dark:text-indigo-300 space-y-1">
                  <div>r:jar:cancellation:{"{user_id}"}</div>
                  <div>r:jar:eligibility:{"{user_id}"}</div>
                  <div>r:jar:offer:{"{user_id}:{offer_id}"}</div>
                </div>
                <div className="mt-2 text-[10px] text-zinc-400 dark:text-zinc-500">
                  Source: Precancellation · Last verified 2 days ago
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── CTA footer ── */
function CTASection() {
  return (
    <section className="mx-auto max-w-6xl px-4 md:px-8 pb-24 text-center">
      <div className="bg-indigo-600 rounded-3xl px-8 py-14 shadow-xl shadow-indigo-900/40">
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-indigo-300 mb-3">Get started</p>
        <h2 className="font-heading font-black text-3xl md:text-4xl tracking-tight text-white mb-4"
            style={{ textWrap: "balance" }}>
          Your team's QA knowledge, centralised
        </h2>
        <p className="text-sm text-indigo-200 max-w-md mx-auto mb-8 leading-relaxed">
          Sign in with your team account to start adding and discovering feature knowledge.
        </p>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 h-11 px-8 text-sm bg-white hover:bg-indigo-50 text-indigo-700 rounded-xl font-semibold transition-colors shadow-md"
        >
          Sign in to QAForge <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <p className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 mt-10">
        v1.0 · Internal tool · Access via company network or VPN
      </p>
    </section>
  );
}

/* ── Page ── */
export default function LandingPage() {
  return (
    <div className="min-h-screen relative">
      <PageBackground />
      <Nav />
      <main>
        <Hero />
        <ProblemSection />
        <FeaturesSection />
        <AISection />
        <CTASection />
      </main>
    </div>
  );
}
