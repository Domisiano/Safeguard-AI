import { Link, useLocation } from "@tanstack/react-router";
import { MessageSquareText, BookHeart, FilePlus2, LayoutDashboard, Info, RotateCcw, ShieldHalf } from "lucide-react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { useDemoStore } from "@/lib/demo-store";
import { Btn } from "@/components/ui-kit";

const NAV = [
  { to: "/", label: "Check a message", short: "Check", icon: MessageSquareText },
  { to: "/guidance", label: "Safety guidance", short: "Guidance", icon: BookHeart },
  { to: "/report", label: "Report a concern", short: "Report", icon: FilePlus2 },
  { to: "/dashboard", label: "Responder dashboard", short: "Cases", icon: LayoutDashboard },
  { to: "/about", label: "About & privacy", short: "About", icon: Info },
] as const;

function DemoBadge() {
  return <span className="inline-flex items-center gap-1.5 rounded-full bg-highlight px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-highlight-foreground"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />Demo mode</span>;
}

export function AppShell({ children }: { children: ReactNode }) {
  const { reset } = useDemoStore();
  const professional = useLocation().pathname === "/dashboard";
  const doReset = () => { reset(); toast.success("Demo reset — sample cases restored."); };

  return (
    <div className={`flex min-h-dvh w-full flex-col bg-background ${professional ? "professional" : ""}`}>
      <a href="#main-content" className="sr-only fixed left-4 top-4 z-50 rounded-lg bg-card p-3 font-bold text-foreground focus:not-sr-only">Skip to content</a>
      <aside className="hidden border-b border-border bg-card px-8 py-4 lg:block">
        <div className="mx-auto flex max-w-6xl items-center gap-6">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent-strong"><ShieldHalf className="h-6 w-6" aria-hidden /></span>
          <span className="whitespace-nowrap font-display text-xl font-extrabold">SafeGuard AI</span>
        </Link>
        <nav aria-label="Main" className="ml-auto flex gap-1">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: true }} className="flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-muted-foreground transition hover:bg-muted data-[status=active]:bg-accent-soft data-[status=active]:text-accent-strong">
              <n.icon className="h-4 w-4 shrink-0" aria-hidden />{n.short}
            </Link>
          ))}
        </nav>
        <DemoBadge />
        <Btn variant="ghost" onClick={doReset} aria-label="Reset demo" title="Reset demo" className="min-w-12 px-3"><RotateCcw className="h-4 w-4" aria-hidden /></Btn>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-b border-border bg-card/95 px-4 py-3 backdrop-blur lg:hidden">
          <Link to="/" className="flex min-w-0 items-center gap-2">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent-strong"><ShieldHalf className="h-5 w-5" aria-hidden /></span>
            <span className="truncate font-display text-base font-extrabold">SafeGuard AI</span>
          </Link>
          <div className="flex shrink-0 items-center gap-2">
            <DemoBadge />
            <Btn variant="ghost" onClick={doReset} aria-label="Reset demo" title="Reset demo" className="min-w-11 px-2"><RotateCcw className="h-4 w-4" aria-hidden /></Btn>
          </div>
        </header>
        <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-4xl flex-1 px-4 pb-28 pt-6 sm:px-6 lg:pb-10 lg:pt-9">{children}<p className="mt-5 text-xs leading-relaxed text-muted-foreground">UCC Testbed Hackathon 2026 · Uganda-focused demo. No official integration with UCC, Sauti 116, police, schools or government.</p></main>
      </div>

      <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-border bg-card/95 backdrop-blur lg:hidden">
        {NAV.map((n) => (
          <Link key={n.to} to={n.to} activeOptions={{ exact: true }} className="flex min-h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium text-muted-foreground data-[status=active]:text-accent-strong">
            <n.icon className="h-5 w-5" aria-hidden />{n.short}
          </Link>
        ))}
      </nav>
    </div>
  );
}
