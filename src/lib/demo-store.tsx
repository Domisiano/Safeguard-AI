import { createContext, useContext, useState, type ReactNode } from "react";
import type { RiskBand } from "./analyzer";

export type CaseStatus = "New" | "Reviewed" | "Needs follow-up";

export interface DemoCase {
  id: string;
  category: string;
  level: RiskBand;
  createdAt: string;
  status: CaseStatus;
  indicators: string[];
  summary: string;
  immediateDanger: boolean;
  timeframe?: string;
  preferredStep: string;
  recommendedAction: string;
  synthetic: true;
}

const hoursAgo = (h: number) => new Date(Date.now() - h * 3600_000).toISOString();

export const seedCases = (): DemoCase[] => [
  { id: "SG-SEED-101", category: "Possible grooming or secrecy pressure", level: "High", createdAt: hoursAgo(2), status: "New", indicators: ["Secrecy request", "Flattery", "Excluding trusted adults"], summary: "Fictional: an online gaming contact asked a learner to keep chats secret and move to a private app.", immediateDanger: false, timeframe: "This week", preferredStep: "Talk to a trusted adult", recommendedAction: "Human reviewer to contact guardian pathway; share safety guidance.", synthetic: true },
  { id: "SG-SEED-102", category: "Possible cyberbullying / harassment", level: "Elevated", createdAt: hoursAgo(26), status: "Needs follow-up", indicators: ["Group insults", "Exclusion"], summary: "Fictional: repeated insults in a class chat group over several days.", immediateDanger: false, timeframe: "Past month", preferredStep: "Get advice", recommendedAction: "Suggest school counsellor involvement; platform reporting guidance.", synthetic: true },
  { id: "SG-SEED-103", category: "Possible sexual coercion / financial inducement", level: "Urgent concern", createdAt: hoursAgo(5), status: "New", indicators: ["Image request", "Money offer", "Secrecy"], summary: "Fictional: unknown account offered airtime in exchange for a private photo.", immediateDanger: true, timeframe: "Today", preferredStep: "Get help now", recommendedAction: "Priority human review; refer to verified child helpline information.", synthetic: true },
  { id: "SG-SEED-104", category: "No clear indicator in this sample", level: "Low", createdAt: hoursAgo(50), status: "Reviewed", indicators: [], summary: "Fictional: unsure whether a friend request was safe; no indicators found.", immediateDanger: false, preferredStep: "Just checking", recommendedAction: "Share general online safety tips.", synthetic: true },
];

interface Store {
  cases: DemoCase[];
  addCase: (c: Omit<DemoCase, "id" | "createdAt" | "status" | "synthetic">) => DemoCase;
  setStatus: (id: string, s: CaseStatus) => void;
  reset: () => void;
  resetKey: number;
}

const Ctx = createContext<Store | null>(null);

export function DemoStoreProvider({ children }: { children: ReactNode }) {
  const [cases, setCases] = useState<DemoCase[]>(seedCases);
  const [counter, setCounter] = useState(1);
  const [resetKey, setResetKey] = useState(0);

  const addCase: Store["addCase"] = (c) => {
    const created: DemoCase = { ...c, id: `SG-DEMO-${String(counter).padStart(3, "0")}`, createdAt: new Date().toISOString(), status: "New", synthetic: true };
    setCounter((n) => n + 1);
    setCases((cs) => [created, ...cs]);
    return created;
  };
  const setStatus = (id: string, s: CaseStatus) => setCases((cs) => cs.map((c) => (c.id === id ? { ...c, status: s } : c)));
  const reset = () => { setCases(seedCases()); setCounter(1); setResetKey((k) => k + 1); };

  return <Ctx.Provider value={{ cases, addCase, setStatus, reset, resetKey }}>{children}</Ctx.Provider>;
}

export function useDemoStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useDemoStore outside provider");
  return s;
}
