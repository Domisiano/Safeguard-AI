import { describe, it, expect } from "vitest";
import { analyzeMessage, SAMPLE_MESSAGES } from "./analyzer";

describe("demo analyzer", () => {
  it("sample A is grooming/secrecy", () => {
    expect(analyzeMessage(SAMPLE_MESSAGES[0]!.text).category).toBe("Possible grooming or secrecy pressure");
  });
  it("sample B is coercion and urgent", () => {
    const r = analyzeMessage(SAMPLE_MESSAGES[1]!.text);
    expect(r.category).toBe("Possible sexual coercion / financial inducement");
    expect(r.band).toBe("Urgent concern");
  });
  it("sample C is cyberbullying", () => {
    expect(analyzeMessage(SAMPLE_MESSAGES[2]!.text).category).toBe("Possible cyberbullying / harassment");
  });
  it("benign text has no indicator", () => {
    const r = analyzeMessage("See you at football practice tomorrow");
    expect(r.category).toBe("No clear indicator in this sample");
    expect(r.band).toBe("Low");
  });
});
