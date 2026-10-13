// Transparent, deterministic demo analyzer. NOT a validated AI model.
// Matches simple phrase patterns and maps them to illustrative categories.

export type RiskBand = "Low" | "Elevated" | "High" | "Urgent concern";

export type Category =
  | "Possible grooming or secrecy pressure"
  | "Possible sexual coercion / financial inducement"
  | "Possible cyberbullying / harassment"
  | "No clear indicator in this sample";

interface Rule {
  id: string;
  category: Exclude<Category, "No clear indicator in this sample">;
  pattern: RegExp;
  weight: number;
  reason: string;
}

export const RULES: Rule[] = [
  { id: "secret", category: "Possible grooming or secrecy pressure", pattern: /\b(secret|don'?t tell|do not tell|keep (this|it|our chats?) (between us|private|secret)|tell no ?one|delete (this|our) chats?)\b/i, weight: 2, reason: "Asks you to keep things secret or hide them from others." },
  { id: "parents", category: "Possible grooming or secrecy pressure", pattern: /\b(parents?|mum|mom|dad|teachers?|guardian)\b/i, weight: 1, reason: "Mentions keeping trusted adults out of the conversation." },
  { id: "mature", category: "Possible grooming or secrecy pressure", pattern: /\b(mature for your age|special|only one who understands|our little)\b/i, weight: 2, reason: "Uses flattery that can be used to build unhealthy trust quickly." },
  { id: "meet", category: "Possible grooming or secrecy pressure", pattern: /\b(meet (me|up)|come alone|where do you live|which school)\b/i, weight: 3, reason: "Asks to meet or for personal location details." },
  { id: "photo", category: "Possible sexual coercion / financial inducement", pattern: /\b(private|nude|naked|sexy) (photo|pic|picture|image|video)s?\b|\bsend (me )?(a )?(photo|pic)/i, weight: 4, reason: "Requests a private or intimate image." },
  { id: "money", category: "Possible sexual coercion / financial inducement", pattern: /\b(money|pay you|airtime|mobile money|gift|cash|shillings|ugx)\b/i, weight: 2, reason: "Offers money or gifts in exchange for something." },
  { id: "threat", category: "Possible sexual coercion / financial inducement", pattern: /\b(or else|i will (share|post|send)|everyone will see|expose you)\b/i, weight: 4, reason: "Contains a threat to share or expose something." },
  { id: "insult", category: "Possible cyberbullying / harassment", pattern: /\b(insult|insulting|stupid|ugly|loser|hate you|laugh(ing)? at)\b/i, weight: 2, reason: "Describes insults or demeaning language." },
  { id: "exclude", category: "Possible cyberbullying / harassment", pattern: /\b(should leave|nobody likes you|go away|kick (you|her|him) out|class group)\b/i, weight: 2, reason: "Describes exclusion or group pressure." },
  { id: "harm", category: "Possible cyberbullying / harassment", pattern: /\b(kill yourself|hurt you|beat you|watch your back)\b/i, weight: 5, reason: "Contains language about physical harm." },
];

export interface AnalysisResult {
  category: Category;
  band: RiskBand;
  reasons: string[];
  matchedRules: string[];
  nextSteps: string[];
  urgent: boolean;
}

export function bandFromScore(score: number): RiskBand {
  if (score >= 7) return "Urgent concern";
  if (score >= 5) return "High";
  if (score >= 2) return "Elevated";
  return "Low";
}

export function analyzeMessage(text: string): AnalysisResult {
  const hits = RULES.filter((r) => r.pattern.test(text));
  const totals = new Map<Category, number>();
  for (const h of hits) totals.set(h.category, (totals.get(h.category) ?? 0) + h.weight);

  let category: Category = "No clear indicator in this sample";
  let top = 0;
  for (const [c, s] of totals) if (s > top) { top = s; category = c; }

  const score = hits.reduce((n, h) => n + h.weight, 0);
  const band = category === "No clear indicator in this sample" ? "Low" : bandFromScore(score);
  const urgent = band === "High" || band === "Urgent concern";

  const nextSteps = urgent
    ? [
        "If you feel unsafe, stop responding. You have done nothing wrong.",
        "Do not agree to meet this person.",
        "Do not send or forward intimate images — of yourself or anyone else.",
        "Talk to a trusted adult today: a parent, guardian, teacher or counsellor.",
        "Save evidence safely (e.g. a note of dates and usernames) without resharing harmful content.",
      ]
    : category === "No clear indicator in this sample"
      ? [
          "This sample didn't match our demo patterns, but your feelings still matter.",
          "If something feels wrong, talk to someone you trust.",
        ]
      : [
          "You can pause the chat and take time before replying.",
          "Use block or report tools on the app if you want to.",
          "Talk to a trusted adult about what happened.",
        ];

  return {
    category,
    band,
    reasons: hits.length ? Array.from(new Set(hits.map((h) => h.reason))) : ["No demo pattern was matched in this text."],
    matchedRules: hits.map((h) => h.id),
    nextSteps,
    urgent,
  };
}

export const SAMPLE_MESSAGES = [
  { label: "A", text: "You are really mature for your age. Let's keep our chats secret from your parents." },
  { label: "B", text: "Send me a private photo and I'll send you money. Don't tell anyone." },
  { label: "C", text: "People in the class group keep insulting me and saying I should leave." },
];
