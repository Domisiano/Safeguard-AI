import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Loader2, Sparkles, LifeBuoy, ArrowRight, Phone, LockKeyhole, HeartHandshake, MessageCircle } from "lucide-react";
import { analyzeMessage, SAMPLE_MESSAGES, type AnalysisResult } from "@/lib/analyzer";
import { Btn, Card, Disclaimer, Notice, RiskBadge } from "@/components/ui-kit";
import safetyOwl from "@/assets/safety-owl.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Check a message — SafeGuard AI" },
      { name: "description", content: "Check a suspicious online message and see possible risk indicators in plain language. Demo prototype." },
      { property: "og:title", content: "Check a message — SafeGuard AI" },
      { property: "og:description", content: "Safer steps when something online feels wrong. Demo prototype for UCC Testbed Hackathon 2026." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CheckPage,
});

function CheckPage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const [showHelp, setShowHelp] = useState(false);

  const run = () => {
    if (text.trim().length < 5) { setError("Please paste or type a short example message first."); return; }
    setError(""); setLoading(true); setResult(null); setShowHelp(false);
    setTimeout(() => { setResult(analyzeMessage(text)); setLoading(false); }, 650);
  };

  return (
    <>
      <header className="relative mb-7 min-h-52 animate-fade-up overflow-hidden border-b border-border pb-7 pr-28 sm:min-h-64 sm:pr-64">
        <p className="mb-3 inline-flex items-center gap-2 text-xs font-bold text-accent-strong"><span className="h-2 w-2 rounded-full bg-accent" aria-hidden />A little support. A safer next step.</p>
        <h1 className="max-w-lg font-display text-3xl leading-tight sm:text-4xl">Something feels wrong?<br /><span className="text-accent-strong">Let's check together.</span></h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">You deserve to feel safe online. Check an example message and find a calm next step.</p>
        <img src={safetyOwl} alt="A friendly owl waving and holding a heart shield" width={1024} height={1024} className="absolute right-0 top-7 h-32 w-28 object-contain sm:top-0 sm:h-64 sm:w-64" />
        <p className="mt-4 flex items-center gap-2 text-xs font-semibold"><HeartHandshake className="h-4 w-4 shrink-0 text-violet-ink" aria-hidden />You're not in trouble for asking.</p>
      </header>

      <Card className="animate-fade-up">
        <div className="mb-4 flex items-center gap-3"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-soft text-blue-ink"><MessageCircle className="h-5 w-5" aria-hidden /></span><h2 className="text-lg">Check a message</h2></div>
        <label htmlFor="msg" className="text-sm font-semibold">Your example message</label>
        <p id="msg-hint" className="mt-1 text-xs text-muted-foreground">Use fictional examples only. Don't enter real names, phone numbers, addresses, images, or anything that identifies someone.</p>
        <textarea id="msg" aria-describedby={error ? "msg-hint msg-error" : "msg-hint"} aria-invalid={!!error} value={text} onChange={(e) => setText(e.target.value)} rows={4} maxLength={1000} placeholder="Type or paste a fictional message here…" className="mt-3 w-full resize-y rounded-xl border border-input bg-background p-4 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
        {error && <p id="msg-error" role="alert" className="mt-2 text-sm text-danger-ink">{error}</p>}

        <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Try a sample</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          {SAMPLE_MESSAGES.map((s, i) => (
            <Btn variant="outline" key={s.label} aria-label={`Use sample ${s.label}: ${s.text}`} disabled={loading} onClick={() => { setText(s.text); setResult(null); setError(""); }} className={`block h-full p-4 text-left text-sm font-normal ${i === 0 ? "border-accent/30 bg-accent-soft" : i === 1 ? "border-violet-ink/20 bg-violet-soft" : "border-blue-ink/20 bg-blue-soft"}`}>
              <span className={`mb-2 block text-xs font-bold ${i === 0 ? "text-accent-strong" : i === 1 ? "text-violet-ink" : "text-blue-ink"}`}>Sample {s.label} · {i === 0 ? "Secret chats" : i === 1 ? "Photo requests" : "Unkind messages"}</span><span className="block leading-relaxed">“{s.text}”</span>
            </Btn>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Btn onClick={run} disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}{loading ? "Checking…" : "Check message"}</Btn>
          {(text || result) && <Btn variant="ghost" disabled={loading} onClick={() => { setText(""); setResult(null); setError(""); }}>Clear</Btn>}
        </div>
      </Card>

      <div aria-live="polite">
        {loading && (
          <Card className="mt-6 animate-pulse"><div className="h-5 w-40 rounded bg-muted" /><div className="mt-4 h-3 w-full rounded bg-muted" /><div className="mt-2 h-3 w-2/3 rounded bg-muted" /></Card>
        )}
        {result && <ResultView r={result} showHelp={showHelp} onHelp={() => setShowHelp(true)} />}
      </div>

      <div className="mt-5 flex items-start gap-3 text-sm text-muted-foreground"><LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-accent-strong" aria-hidden /><p>Private by design. Nothing is sent or saved to a server.</p></div>
      <div className="mt-5 flex items-start gap-3 border-y border-border py-5"><HeartHandshake className="h-6 w-6 shrink-0 text-violet-ink" aria-hidden /><div className="min-w-0"><h2 className="text-base">You don't have to handle this alone.</h2><p className="mt-1 text-sm text-muted-foreground">A trusted parent, guardian, teacher or counsellor can help.</p><Link to="/guidance" className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-accent-strong">Find safe next steps <ArrowRight className="h-4 w-4" aria-hidden /></Link></div></div>
      <Disclaimer />
    </>
  );
}

function ResultView({ r, showHelp, onHelp }: { r: AnalysisResult; showHelp: boolean; onHelp: () => void }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => { headingRef.current?.focus({ preventScroll: true }); }, [r]);
  return (
    <div className="mt-6 space-y-4 animate-fade-up">
      <Card>
        <p className="mb-4 rounded-xl bg-violet-soft p-3 text-sm font-semibold text-violet-ink">Thank you for checking. Whatever happened, you deserve support.</p>
        <div className="grid items-start gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Possible warning signs · demo check</p>
            <h2 ref={headingRef} tabIndex={-1} className="mt-1 font-display text-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring">{r.category}</h2>
          </div>
          <div className="shrink-0 sm:text-right"><p className="mb-1 text-xs text-muted-foreground">Concern level</p><RiskBadge band={r.band} /></div>
        </div>

        <h3 className="mt-6 text-sm font-semibold">Why we noticed this</h3>
        <ul className="mt-2 space-y-1.5 text-sm">{r.reasons.map((x) => <li key={x} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />{x}</li>)}</ul>

        <h3 className="mt-6 text-sm font-semibold">Safe next steps</h3>
        <ol className="mt-2 space-y-2 text-sm">{r.nextSteps.map((x, i) => <li key={x} className="flex gap-3"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent-soft text-xs font-bold text-accent-strong">{i + 1}</span>{x}</li>)}</ol>

         <div className="mt-6"><Notice title="This check can be wrong">It checks simple phrases, not the full situation. It does not decide guilt. A trained person should review real concerns.</Notice></div>

        <div className="mt-5 flex flex-wrap gap-2">
          {r.urgent && <Btn variant="danger" onClick={onHelp}><LifeBuoy className="h-4 w-4" />Get help now</Btn>}
          <Link to="/report" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-semibold hover:bg-muted">Report a concern <ArrowRight className="h-4 w-4" /></Link>
          <Link to="/guidance" className="inline-flex min-h-11 items-center gap-2 rounded-xl px-4 text-sm font-semibold hover:bg-muted">Read safety guidance</Link>
        </div>
      </Card>
      {(showHelp || r.band === "Urgent concern") && <HelpPanel />}
    </div>
  );
}

export function HelpPanel() {
  return (
    <Card className="border-danger/40">
      <h2 className="flex items-center gap-2 font-display text-xl"><LifeBuoy className="h-5 w-5 text-danger-ink" aria-hidden />Getting help now</h2>
      <ul className="mt-3 space-y-2 text-sm">
        <li><strong>In immediate danger?</strong> Go to a trusted adult nearby right away, or contact local emergency services.</li>
        <li><strong>Talk to someone you trust:</strong> a parent, guardian, teacher, school counsellor or community leader.</li>
        <li className="flex items-start gap-2"><Phone className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /><span><strong>Sauti 116</strong> — a child helpline option in Uganda.</span></li>
      </ul>
      <p className="mt-4 rounded-lg bg-muted p-3 text-xs text-muted-foreground">Check availability and current contact details with official sources; this demo does not place calls or send reports.</p>
    </Card>
  );
}
