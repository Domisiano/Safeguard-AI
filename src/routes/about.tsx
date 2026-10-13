import { createFileRoute } from "@tanstack/react-router";
import { Search, Lightbulb, HeartHandshake, UserCheck, Check, X } from "lucide-react";
import { Card, Disclaimer, PageHeader } from "@/components/ui-kit";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About & privacy — SafeGuard AI" },
      { name: "description", content: "How SafeGuard AI works, its scope as a prototype, and its privacy approach." },
      { property: "og:title", content: "About & privacy — SafeGuard AI" },
      { property: "og:description", content: "AI-assisted first-line triage that supports, not replaces, trained people." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

const STEPS = [
  { icon: Search, t: "Check", d: "Paste an example message." },
  { icon: Lightbulb, t: "Understand indicators", d: "See possible warning signs in plain language." },
  { icon: HeartHandshake, t: "Choose support", d: "Pick a safe next step that feels right." },
  { icon: UserCheck, t: "Human review / referral", d: "A trained person reviews and points to verified support." },
];

const IS = ["A demonstration prototype for UCC Testbed Hackathon 2026", "Transparent local pattern rules on sample text", "A way to prepare structured cases for a human to review"];
const NOT = ["Officially integrated with UCC, Sauti 116, police, schools or government", "Monitoring WhatsApp or social media", "Sending real reports or placing calls", "Saving anything to a server or database", "A validated AI model or a judge of guilt"];

function About() {
  return (
    <>
      <PageHeader companion eyebrow="About & privacy" title="Your safety. Your privacy." intro="SafeGuard AI is an Uganda-focused online-safety demo. It helps explain possible warning signs. It never replaces trusted adults, trained people or real support services." />
      <Card>
        <h2 className="font-display text-xl">How it works</h2>
        <ol className="mt-4 grid gap-4 sm:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.t} className="relative">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground"><s.icon className="h-5 w-5" aria-hidden /></span>
              <p className="mt-2 text-xs font-bold text-accent-strong">Step {i + 1}</p>
              <p className="font-semibold">{s.t}</p>
              <p className="text-sm text-muted-foreground">{s.d}</p>
            </li>
          ))}
        </ol>
      </Card>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Card><h2 className="font-display text-xl">This prototype is</h2><ul className="mt-3 space-y-2 text-sm">{IS.map((x) => <li key={x} className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-ok-ink" aria-label="Yes" />{x}</li>)}</ul></Card>
        <Card><h2 className="font-display text-xl">This prototype is not</h2><ul className="mt-3 space-y-2 text-sm">{NOT.map((x) => <li key={x} className="flex gap-2"><X className="h-4 w-4 shrink-0 text-danger-ink" aria-label="No" />{x}</li>)}</ul></Card>
      </div>
      <Card className="mt-4">
        <h2 className="font-display text-xl">About the analyzer</h2>
        <p className="mt-2 text-sm text-muted-foreground">The demo analyzer uses transparent, hand-written phrase rules running entirely in your browser. It gives a concern band, not a probability, and it can be wrong. Integrating a real AI model is a later development stage that would require independent safety evaluation, child-rights review and a data-protection impact assessment.</p>
        <h2 className="mt-5 font-display text-xl">Privacy</h2>
        <p className="mt-2 text-sm text-muted-foreground">No login, no age or identity questions, no media uploads, no analytics or tracking. Demo cases live only in this browser tab and disappear when you refresh or press Reset demo.</p>
      </Card>
      <Disclaimer />
    </>
  );
}
