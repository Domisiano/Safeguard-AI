import type { ReactNode } from "react";
import { AlertTriangle, Info, ShieldAlert, ShieldCheck, Shield } from "lucide-react";
import type { RiskBand } from "@/lib/analyzer";
import { cn } from "@/lib/utils";
import safetyOwl from "@/assets/safety-owl.png";

export function PageHeader({ eyebrow, title, intro, companion = false }: { eyebrow: string; title: string; intro?: string; companion?: boolean }) {
  return (
    <header className="mb-7 animate-fade-up">
      <div className="flex items-center gap-3">
        {companion && <img src={safetyOwl} alt="" width={1024} height={1024} className="h-20 w-20 shrink-0 object-contain sm:h-24 sm:w-24" />}
        <p className="text-xs font-bold uppercase tracking-wider text-accent-strong">{eyebrow}</p>
      </div>
      <h1 className="mt-2 max-w-2xl font-display text-3xl leading-tight text-foreground sm:text-4xl">{title}</h1>
      {intro && <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">{intro}</p>}
    </header>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cn("rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-6", className)}>{children}</section>;
}

export function Disclaimer() {
  return (
    <p className="mt-10 flex items-start gap-2 rounded-xl border border-border bg-muted px-4 py-3 text-xs text-muted-foreground">
      <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      Prototype for demonstration. Not an emergency service. Automated results may be wrong.
    </p>
  );
}

export function Notice({ tone = "info", title, children }: { tone?: "info" | "warn" | "danger"; title: string; children?: ReactNode }) {
  const Icon = tone === "danger" ? ShieldAlert : tone === "warn" ? AlertTriangle : Info;
  return (
    <div role={tone === "danger" ? "alert" : undefined} className={cn("flex gap-3 rounded-xl border p-4", tone === "danger" && "border-danger/40 bg-danger-soft text-danger-ink", tone === "warn" && "border-warn/40 bg-warn-soft text-warn-ink", tone === "info" && "border-accent/30 bg-accent-soft text-foreground")}>
      <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
      <div className="text-sm"><p className="font-semibold">{title}</p>{children && <div className="mt-1 opacity-90">{children}</div>}</div>
    </div>
  );
}

const bandStyle: Record<RiskBand, { cls: string; Icon: typeof Shield; bars: number }> = {
  Low: { cls: "bg-ok-soft text-ok-ink border-ok/40", Icon: ShieldCheck, bars: 1 },
  Elevated: { cls: "bg-warn-soft text-warn-ink border-warn/40", Icon: Shield, bars: 2 },
  High: { cls: "bg-danger-soft text-danger-ink border-danger/40", Icon: AlertTriangle, bars: 3 },
  "Urgent concern": { cls: "bg-danger text-danger-foreground border-danger", Icon: ShieldAlert, bars: 4 },
};

export function RiskBadge({ band }: { band: RiskBand }) {
  const s = bandStyle[band];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold", s.cls)}>
      <s.Icon className="h-3.5 w-3.5" aria-hidden />
      {band}
      <span className="ml-1 flex gap-0.5" aria-hidden>
        {[1, 2, 3, 4].map((i) => <span key={i} className={cn("h-2 w-1 rounded-sm bg-current", i > s.bars && "opacity-25")} />)}
      </span>
    </span>
  );
}

export function Btn({ variant = "primary", className, ...p }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "outline" | "ghost" | "danger" }) {
  return (
    <button
      {...p}
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "bg-primary text-primary-foreground hover:bg-primary/90",
        variant === "outline" && "border border-border bg-card text-foreground hover:bg-muted",
        variant === "ghost" && "text-foreground hover:bg-muted",
        variant === "danger" && "bg-danger text-danger-foreground hover:bg-danger/90",
        className,
      )}
    />
  );
}
