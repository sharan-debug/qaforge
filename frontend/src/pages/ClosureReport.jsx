/** biome-ignore-all lint/a11y/noLabelWithoutControl: <explanation> */
/** biome-ignore-all assist/source/organizeImports: <explanation> */
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../lib/api";
import { ArrowLeft, Save, Download, Copy, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const EMPTY = {
  feature_id: "", feature_name: "", prd_url: "", figma_url: "", test_cases_sheet_url: "",
  functionality: "", developer: "", qa: "", pm: "",
  staging_fe_issues: 0, staging_be_issues: 0, replica_fe_issues: 0, replica_be_issues: 0,
  platform: "", environment_covered: "", devices_covered: "", happy_flow_doc_url: "",
  sign_off_staging: "", sign_off_replica: "",
};

const inp = "w-full h-9 px-3 text-sm border border-indigo-100 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-400";

function nowStamp() {
  return new Date().toLocaleString();
}

export default function ClosureReport() {
  const { id } = useParams();
  // biome-ignore lint/correctness/noUnusedVariables: <explanation>
  const navigate = useNavigate();
  const [data, setData] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const r = await api.get(`/features/${id}/closure-report`);
        const d = r.data;
        // auto-fill QA if empty
        if (!d.qa) {
          try {
            const u = await api.get("/auth/me");
            d.qa = u.data?.name || "";
          } catch (_e) { /* empty */ }
        }
        // auto-stamp sign-offs if empty
        if (!d.sign_off_staging) d.sign_off_staging = nowStamp();
        if (!d.sign_off_replica) d.sign_off_replica = nowStamp();
        setData({ ...EMPTY, ...d });
      } catch (e) {
        toast.error("Failed to load closure report");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const update = (patch) => setData((prev) => ({ ...prev, ...patch }));

  const save = async () => {
    setSaving(true);
    try {
      const r = await api.put(`/features/${id}/closure-report`, data);
      setData({ ...EMPTY, ...r.data });
      toast.success("Closure report saved");
    } catch (e) {
      toast.error("Save failed: " + (e?.response?.data?.detail || e.message));
    } finally {
      setSaving(false);
    }
  };

  const buildMarkdown = () => {
    const d = data;
    return `# Test Closure Report — ${d.feature_name}

## Feature
- **Feature:** ${d.feature_name}
- **PRD:** ${d.prd_url || "—"}
- **Figma:** ${d.figma_url || "—"}
- **Test Cases & Test Data Sheet:** ${d.test_cases_sheet_url || "—"}
- **Happy Flow Document (with video):** ${d.happy_flow_doc_url || "—"}

## Functionality
${d.functionality || "—"}

## People
- **Developer:** ${d.developer || "—"}
- **QA:** ${d.qa || "—"}
- **PM:** ${d.pm || "—"}

## Issues
| Environment | FE | BE |
|---|---|---|
| Staging | ${d.staging_fe_issues} | ${d.staging_be_issues} |
| Replica | ${d.replica_fe_issues} | ${d.replica_be_issues} |

## Platform & Environment
- **Platform:** ${d.platform || "—"}
- **Environment covered:** ${d.environment_covered || "—"}
- **Devices covered:** ${d.devices_covered || "—"}

## Sign-off
- **Staging Build Final:** ${d.sign_off_staging || "—"}
- **Replica Build Final:** ${d.sign_off_replica || "—"}
`;
  };

  const copyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(buildMarkdown());
      setCopied(true);
      toast.success("Markdown copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (_e) {
      toast.error("Copy failed");
    }
  };

  const downloadPdf = () => {
    window.print();
  };

  if (loading) {
    return <div className="p-8 text-sm text-zinc-400">Loading…</div>;
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl print:p-0">
      <div className="print:hidden flex items-center justify-between mb-6">
        <Link to={`/features/${id}`} className="text-xs font-mono text-indigo-400 hover:text-indigo-600 flex items-center gap-1">
          <ArrowLeft className="w-3 h-3" /> back to feature
        </Link>
        <div className="flex gap-2">
          <button
            type="button"
            data-testid="copy-markdown-btn"
            onClick={copyMarkdown}
            className="inline-flex items-center gap-1.5 h-9 px-3 text-sm border border-indigo-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 text-zinc-600 dark:text-zinc-300 rounded-lg transition-colors"
          >
            {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />} {copied ? "Copied" : "Copy Markdown"}
          </button>
          <button
            type="button"
            data-testid="download-pdf-btn"
            onClick={downloadPdf}
            className="inline-flex items-center gap-1.5 h-9 px-3 text-sm border border-indigo-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 text-zinc-600 dark:text-zinc-300 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" /> Download PDF
          </button>
          <button
            type="button"
            data-testid="save-closure-report-btn"
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-1.5 h-9 px-4 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50 transition-colors"
          >
            <Save className="w-4 h-4" /> {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      <div className="print:block">
        <h1 className="text-2xl font-heading font-black tracking-tight text-zinc-900 dark:text-zinc-100 mb-1">Test Closure Report</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">{data.feature_name}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 block mb-1.5">Feature</label>
            <input value={data.feature_name} readOnly className={`${inp} bg-indigo-50/40 dark:bg-zinc-800`} />
          </div>
          <div>
            <label className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 block mb-1.5">PRD</label>
            <input data-testid="input-prd-url" value={data.prd_url} onChange={(e) => update({ prd_url: e.target.value })} className={inp} placeholder="https://..." />
          </div>
          <div>
            <label className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 block mb-1.5">Figma</label>
            <input data-testid="input-figma-url" value={data.figma_url} onChange={(e) => update({ figma_url: e.target.value })} className={inp} placeholder="https://..." />
          </div>
          <div>
            <label className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 block mb-1.5">Test Cases & Test Data Sheet</label>
            <input data-testid="input-test-cases-sheet-url" value={data.test_cases_sheet_url} onChange={(e) => update({ test_cases_sheet_url: e.target.value })} className={inp} placeholder="Google Sheet link" />
          </div>
          <div>
            <label className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 block mb-1.5">Happy Flow Document (with video)</label>
            <input data-testid="input-happy-flow-doc-url" value={data.happy_flow_doc_url} onChange={(e) => update({ happy_flow_doc_url: e.target.value })} className={inp} placeholder="https://..." />
          </div>
          <div className="md:col-span-2">
            <label className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 block mb-1.5">Functionality</label>
            <textarea data-testid="input-functionality" value={data.functionality} onChange={(e) => update({ functionality: e.target.value })} rows={3} className={`${inp} h-auto py-2`} />
          </div>
        </div>

        <h2 className="font-heading font-black text-sm tracking-widest uppercase text-indigo-400 mt-6 mb-3">People</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 block mb-1.5">Developer</label>
            <input data-testid="input-developer" value={data.developer} onChange={(e) => update({ developer: e.target.value })} className={inp} placeholder="Name" />
          </div>
          <div>
            <label className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 block mb-1.5">QA</label>
            <input data-testid="input-qa" value={data.qa} onChange={(e) => update({ qa: e.target.value })} className={inp} placeholder="Name" />
          </div>
          <div>
            <label className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 block mb-1.5">PM</label>
            <input data-testid="input-pm" value={data.pm} onChange={(e) => update({ pm: e.target.value })} className={inp} placeholder="Name" />
          </div>
        </div>

        <h2 className="font-heading font-black text-sm tracking-widest uppercase text-indigo-400 mt-6 mb-3">Issues</h2>
        <div className="grid grid-cols-3 gap-4 items-end">
          <div />
          <div className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 text-center">FE</div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 text-center">BE</div>
          <div className="text-sm text-zinc-700 dark:text-zinc-300">Staging</div>
          <input data-testid="input-staging-fe" type="number" value={data.staging_fe_issues} onChange={(e) => update({ staging_fe_issues: Number(e.target.value) || 0 })} className={`${inp} text-center`} />
          <input data-testid="input-staging-be" type="number" value={data.staging_be_issues} onChange={(e) => update({ staging_be_issues: Number(e.target.value) || 0 })} className={`${inp} text-center`} />
          <div className="text-sm text-zinc-700 dark:text-zinc-300">Replica</div>
          <input data-testid="input-replica-fe" type="number" value={data.replica_fe_issues} onChange={(e) => update({ replica_fe_issues: Number(e.target.value) || 0 })} className={`${inp} text-center`} />
          <input data-testid="input-replica-be" type="number" value={data.replica_be_issues} onChange={(e) => update({ replica_be_issues: Number(e.target.value) || 0 })} className={`${inp} text-center`} />
        </div>

        <h2 className="font-heading font-black text-sm tracking-widest uppercase text-indigo-400 mt-6 mb-3">Platform & Environment</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 block mb-1.5">Platform</label>
            <input data-testid="input-platform" value={data.platform} onChange={(e) => update({ platform: e.target.value })} className={inp} placeholder="Android / iOS / Web / Platform" />
          </div>
          <div>
            <label className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 block mb-1.5">Environment covered</label>
            <input data-testid="input-environment-covered" value={data.environment_covered} onChange={(e) => update({ environment_covered: e.target.value })} className={inp} placeholder="Staging/Replica" />
          </div>
          <div>
            <label className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 block mb-1.5">Devices covered</label>
            <input data-testid="input-devices-covered" value={data.devices_covered} onChange={(e) => update({ devices_covered: e.target.value })} className={inp} placeholder="e.g. Moto Edge 60 Pro, iPhone 14" />
          </div>
        </div>

        <h2 className="font-heading font-black text-sm tracking-widest uppercase text-indigo-400 mt-6 mb-3">Sign-off</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 block mb-1.5">Staging Build Final</label>
            <input data-testid="input-sign-off-staging" value={data.sign_off_staging} onChange={(e) => update({ sign_off_staging: e.target.value })} className={inp} />
          </div>
          <div>
            <label className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 block mb-1.5">Replica Build Final</label>
            <input data-testid="input-sign-off-replica" value={data.sign_off_replica} onChange={(e) => update({ sign_off_replica: e.target.value })} className={inp} />
          </div>
        </div>
      </div>
    </div>
  );
}