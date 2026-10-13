import { createFileRoute } from "@tanstack/react-router";
import { MessageCircleWarning, EyeOff, ImageOff, ShieldX, Megaphone } from "lucide-react";
import { Card, Disclaimer, PageHeader } from "@/components/ui-kit";
import { HelpPanel } from "./index";

export const Route = createFileRoute("/guidance")({
  head: () => ({
    meta: [
      { title: "Safety guidance — SafeGuard AI" },
      { name: "description", content: "Supportive, non-blaming guidance on cyberbullying, manipulation, image requests, threats and reporting." },
      { property: "og:title", content: "Safety guidance — SafeGuard AI" },
      { property: "og:description", content: "Short, supportive steps for staying safe online." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Guidance,
});

const TOPICS = [
  { icon: MessageCircleWarning, title: "Cyberbullying", tips: ["It's not your fault, and you don't have to handle it alone.", "You can mute, block, or leave a group that keeps hurting you.", "Tell a trusted adult or teacher what's been happening."] },
  { icon: EyeOff, title: "Secrecy & manipulation", tips: ["Safe people don't ask you to hide friendships from your family.", "Too much flattery or gifts early on can be a warning sign.", "You can say no and stop chatting at any time."] },
  { icon: ImageOff, title: "Requests for intimate images", tips: ["You never have to send a photo you're not comfortable with.", "Don't forward intimate images of anyone — it can cause harm.", "If you already sent something, you're not in trouble. Ask for help."] },
  { icon: ShieldX, title: "Blackmail or threats", tips: ["Don't pay or send more — threats often get worse if you give in.", "Stop responding and tell a trusted adult straight away.", "Note dates and usernames safely; don't reshare harmful content."] },
  { icon: Megaphone, title: "Reporting", tips: ["Use the app's own report button for the account or message.", "Talk to a trusted adult about contacting verified official support services.", "Check official sources for current helpline details."] },
];

function Guidance() {
  return (
    <>
      <PageHeader companion eyebrow="Safety guidance" title="Small steps. You're not alone." intro="Whatever happened, it's not your fault. You can pause, say no and ask someone you trust for help." />
      <div className="grid gap-4 sm:grid-cols-2">
        {TOPICS.map((t, i) => (
          <Card key={t.title} className="animate-fade-up" >
            <div>
              <span className={`grid h-12 w-12 place-items-center rounded-xl ${i % 3 === 0 ? "bg-accent-soft text-accent-strong" : i % 3 === 1 ? "bg-violet-soft text-violet-ink" : "bg-highlight text-highlight-foreground"}`}><t.icon className="h-6 w-6" aria-hidden /></span>
              <h2 className="mt-3 font-display text-xl">{t.title}</h2>
              <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">{t.tips.map((x) => <li key={x} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />{x}</li>)}</ul>
            </div>
          </Card>
        ))}
      </div>
      <div className="mt-5"><HelpPanel /></div>
      <Disclaimer />
    </>
  );
}
