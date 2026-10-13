import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { useDemoStore, type DemoCase } from "@/lib/demo-store";
import { analyzeMessage, type RiskBand } from "@/lib/analyzer";
import { Btn, Card, Disclaimer, Notice, PageHeader } from "@/components/ui-kit";
import { HelpPanel } from "./index";

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [
      { title: "Report a concern — SafeGuard AI" },
      { name: "description", content: "A guided, child-friendly demo form to prepare a structured concern for human review." },
      { property: "og:title", content: "Report a concern — SafeGuard AI" },
      { property: "og:description", content: "Prepare a structured concern for a human reviewer. Demo only." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Report,
});

const CATEGORIES = ["Someone asked me to keep secrets", "Someone asked for photos", "Someone offered money or gifts", "Bullying or insults", "Threats", "Something else"];
const TIMEFRAMES = ["Today", "This week", "Past month", "Longer ago", "Not sure"];
const STEPS = ["Talk to a trusted adult", "Get advice", "Get help now", "Just checking"];

  const fieldCls = "mt-2 min-h-12 w-full rounded-xl border border-input bg-background p-3 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function Report() {
  const { addCase } = useDemoStore();
  const [category, setCategory] = useState("");
  const [what, setWhat] = useState("");
  const [danger, setDanger] = useState<"" | "yes" | "no" | "unsure">("");
  const [timeframe, setTimeframe] = useState("");
  const [step, setStep] = useState("");
  const [err, setErr] = useState("");
  const [done, setDone] = useState<DemoCase | null>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => { if (done) successRef.current?.focus(); }, [done]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || what.trim().length < 5 || !danger || !step) { setErr("Please choose a category, describe what happened, answer the safety question and pick a next step."); return; }
    setErr("");
    const a = analyzeMessage(`${category} ${what}`);
    let level: RiskBand = a.band === "Low" && a.category === "No clear indicator in this sample" ? "Elevated" : a.band;
    if (danger === "yes") level = "Urgent concern";
    setDone(addCase({
      category: a.category === "No clear indicator in this sample" ? category : a.category,
      level, indicators: a.matchedRules.length ? a.reasons : ["Self-reported concern"],
      summary: what.trim(), immediateDanger: danger === "yes", ...(timeframe ? { timeframe } : {}), preferredStep: step,
      recommendedAction: danger === "yes" ? "Priority human review; direct to trusted adult and verified emergency/helpline information." : "Human reviewer to read summary and share appropriate guidance.",
    }));
  };

  if (done) {
    return (
      <>
        <Card className="animate-fade-up text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-ok" aria-hidden />
          <h1 ref={successRef} tabIndex={-1} className="mt-3 font-display text-3xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring">Thank you for speaking up</h1>
          <p className="mt-2 text-muted-foreground">Demo case created: <strong className="font-mono text-foreground">{done.id}</strong></p>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">This was not sent to anyone. In this demo, it only appears in the responder dashboard on this device.</p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Link to="/dashboard" className="inline-flex min-h-11 items-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground">View in dashboard</Link>
            <Btn variant="outline" onClick={() => { setDone(null); setCategory(""); setWhat(""); setDanger(""); setTimeframe(""); setStep(""); }}>Start another</Btn>
          </div>
        </Card>
        {done.immediateDanger && <div className="mt-4"><HelpPanel /></div>}
        <Disclaimer />
      </>
    );
  }

  return (
    <>
      <PageHeader companion eyebrow="Report a concern · demo only" title="We're here to listen." intro="Use a made-up example. Take your time — you're not in trouble. This demo cannot send help or contact anyone." />
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Card>
          <fieldset><legend className="text-sm font-semibold">1. What kind of thing happened?</legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">{CATEGORIES.map((c) => (
              <label key={c} className="flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border border-border p-3 text-sm has-[:checked]:border-accent has-[:checked]:bg-accent-soft has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring">
                <input type="radio" name="cat" value={c} checked={category === c} onChange={() => setCategory(c)} className="accent-[var(--accent-strong)]" />{c}
              </label>))}</div>
          </fieldset>
        </Card>
        <Card>
          <label htmlFor="what" className="text-sm font-semibold">2. What happened?</label>
          <textarea id="what" rows={4} maxLength={1000} value={what} onChange={(e) => setWhat(e.target.value)} className={fieldCls} placeholder="Describe it briefly, using fictional details" />
        </Card>
        <Card>
          <fieldset><legend className="text-sm font-semibold">3. Do you feel in immediate danger right now?</legend>
            <div className="mt-3 flex flex-wrap gap-2">{([["yes", "Yes"], ["no", "No"], ["unsure", "Not sure"]] as const).map(([v, l]) => (
              <label key={v} className="flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-border px-4 text-sm has-[:checked]:border-accent has-[:checked]:bg-accent-soft has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring">
                <input type="radio" name="danger" checked={danger === v} onChange={() => setDanger(v)} />{l}
              </label>))}</div>
          </fieldset>
          {danger === "yes" && <div className="mt-4"><Notice tone="danger" title="Please get help from a person now">Go to a trusted adult nearby or contact local emergency services or an official child helpline such as Sauti 116. Don't rely on this prototype — it cannot send help.</Notice></div>}
        </Card>
        <Card className="grid gap-4 sm:grid-cols-2">
          <div><label htmlFor="tf" className="text-sm font-semibold">4. When did it happen? <span className="font-normal text-muted-foreground">(optional)</span></label>
            <select id="tf" value={timeframe} onChange={(e) => setTimeframe(e.target.value)} className={fieldCls}><option value="">Choose…</option>{TIMEFRAMES.map((t) => <option key={t}>{t}</option>)}</select></div>
          <div><label htmlFor="step" className="text-sm font-semibold">5. What would help most?</label>
            <select id="step" value={step} onChange={(e) => setStep(e.target.value)} className={fieldCls}><option value="">Choose…</option>{STEPS.map((t) => <option key={t}>{t}</option>)}</select></div>
        </Card>
        <Notice tone="warn" title="Use fictional details in this demo.">Do not include names, phone numbers, school, exact location, or intimate images.</Notice>
        <p className="text-xs text-muted-foreground">Privacy: this demo stores nothing on a server. Refreshing the page may clear demo entries.</p>
        {err && <p role="alert" className="text-sm text-danger-ink">{err}</p>}
        <Btn type="submit"><Send className="h-4 w-4" />Create demo case</Btn>
      </form>
      <Disclaimer />
    </>
  );
}
