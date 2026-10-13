import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronRight, Database, Inbox, UserCheck } from "lucide-react";
import { useDemoStore, type CaseStatus, type DemoCase } from "@/lib/demo-store";
import type { RiskBand } from "@/lib/analyzer";
import { Btn, Card, Disclaimer, Notice, PageHeader, RiskBadge } from "@/components/ui-kit";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Responder dashboard — SafeGuard AI" },
      { name: "description", content: "Mock human-review dashboard with synthetic demo cases." },
      { property: "og:title", content: "Responder dashboard — SafeGuard AI" },
      { property: "og:description", content: "Synthetic demo data only — not a live case-management system." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const LEVELS: (RiskBand | "All")[] = ["All", "Urgent concern", "High", "Elevated", "Low"];
const STATUSES: (CaseStatus | "All")[] = ["All", "New", "Needs follow-up", "Reviewed"];
const fmt = (iso: string) => new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
const selCls = "mt-1 w-full rounded-xl border border-input bg-card p-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function StatusPill({ s }: { s: CaseStatus }) {
  return <span className="rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium">{s}</span>;
}

function Dashboard() {
  const { cases, setStatus } = useDemoStore();
  const [level, setLevel] = useState<(typeof LEVELS)[number]>("All");
  const [status, setStat] = useState<(typeof STATUSES)[number]>("All");
  const [openId, setOpenId] = useState<string | null>(null);
  const list = useMemo(() => cases.filter((c) => (level === "All" || c.level === level) && (status === "All" || c.status === status)), [cases, level, status]);
  const open = cases.find((c) => c.id === openId) ?? null;

  return (
    <>
      <PageHeader eyebrow="Responder dashboard" title="Cases awaiting human review" />
      <Notice tone="warn" title="Synthetic demo data only — not a live case-management system." />
      <div className="mt-4 grid grid-cols-2 gap-3 sm:max-w-md">
        <div><label htmlFor="lv" className="text-xs font-semibold">Concern level</label><select id="lv" className={selCls} value={level} onChange={(e) => setLevel(e.target.value as RiskBand)}>{LEVELS.map((l) => <option key={l}>{l}</option>)}</select></div>
        <div><label htmlFor="st" className="text-xs font-semibold">Status</label><select id="st" className={selCls} value={status} onChange={(e) => setStat(e.target.value as CaseStatus)}>{STATUSES.map((l) => <option key={l}>{l}</option>)}</select></div>
      </div>

      <div className="mt-5 space-y-3">
        {list.length === 0 && (
          <Card className="text-center"><Inbox className="mx-auto h-10 w-10 text-muted-foreground" aria-hidden /><p className="mt-2 font-semibold">No cases match these filters</p><p className="text-sm text-muted-foreground">Try changing the concern level or status.</p></Card>
        )}
        {list.map((c) => (
          <button key={c.id} onClick={() => setOpenId(c.id)} className="block w-full animate-fade-up rounded-2xl border border-border bg-card p-4 text-left shadow-soft transition hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
              <div className="min-w-0">
                <p className="font-mono text-xs text-muted-foreground">{c.id} · {fmt(c.createdAt)}</p>
                <p className="mt-1 truncate font-semibold">{c.category}</p>
                <p className="mt-1 text-sm text-muted-foreground">Next: {c.recommendedAction}</p>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2"><RiskBadge band={c.level} /><StatusPill s={c.status} />{c.indicators.slice(0, 3).map((i) => <span key={i} className="hidden rounded-full bg-accent-soft px-2 py-1 text-xs text-accent-strong sm:inline">{i.length > 32 ? i.slice(0, 32) + "…" : i}</span>)}</div>
          </button>
        ))}
      </div>

      <Sheet open={!!open} onOpenChange={(o) => !o && setOpenId(null)}>
        <SheetContent className="w-full overflow-y-auto bg-background sm:max-w-lg">
          {open && <Detail c={open} onStatus={(s) => setStatus(open.id, s)} />}
        </SheetContent>
      </Sheet>
      <Disclaimer />
    </>
  );
}

function Detail({ c, onStatus }: { c: DemoCase; onStatus: (s: CaseStatus) => void }) {
  return (
    <>
      <SheetHeader className="p-0">
        <SheetTitle className="font-display text-2xl">{c.id}</SheetTitle>
        <SheetDescription>Synthetic case · created {fmt(c.createdAt)}</SheetDescription>
      </SheetHeader>
      <div className="mt-4 flex items-center gap-2 rounded-xl bg-primary p-3 text-sm font-semibold text-primary-foreground"><UserCheck className="h-5 w-5" aria-hidden />Human review required — automated indicators do not determine guilt.</div>
      <dl className="mt-5 space-y-4 text-sm">
        <Row k="Category" v={c.category} />
        <Row k="Concern level" v={<RiskBadge band={c.level} />} />
        <Row k="Status" v={<StatusPill s={c.status} />} />
        <Row k="Immediate danger reported" v={c.immediateDanger ? "Yes" : "No"} />
        <Row k="Timeframe" v={c.timeframe ?? "Not given"} />
        <Row k="Preferred next step" v={c.preferredStep} />
        <Row k="Summary" v={c.summary} />
        <Row k="Indicators" v={c.indicators.length ? <ul className="list-disc pl-4">{c.indicators.map((i) => <li key={i}>{i}</li>)}</ul> : "None"} />
        <Row k="Recommended action" v={c.recommendedAction} />
      </dl>
      <div className="mt-6 flex flex-wrap gap-2">
        <Btn onClick={() => onStatus("Reviewed")} disabled={c.status === "Reviewed"}>Mark reviewed</Btn>
        <Btn variant="outline" onClick={() => onStatus("Needs follow-up")} disabled={c.status === "Needs follow-up"}>Needs follow-up</Btn>
      </div>
      <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground"><Database className="h-3.5 w-3.5" aria-hidden />Changes stay in this browser tab only.</p>
    </>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return <div><dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{k}</dt><dd className="mt-1">{v}</dd></div>;
}
