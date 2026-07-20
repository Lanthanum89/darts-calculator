import { describe, expect, it } from "vitest";
import { checkoutTotal, suggestCheckout } from "./checkout";

function names(score: number): string[] | null {
  const checkout = suggestCheckout(score);
  return checkout ? checkout.map((d) => d.name) : null;
}

describe("suggestCheckout", () => {
  it("finds a one-dart finish on 40", () => {
    expect(names(40)).toEqual(["D20"]);
  });

  it("finds a one-dart finish on double bull (50)", () => {
    expect(names(50)).toEqual(["DBULL"]);
  });

  it("finds the maximum checkout, 170", () => {
    expect(names(170)).toEqual(["T20", "T20", "DBULL"]);
    expect(checkoutTotal(suggestCheckout(170)!)).toBe(170);
  });

  it("finds a three-dart finish on 87", () => {
    const checkout = suggestCheckout(87);
    expect(checkout).not.toBeNull();
    expect(checkoutTotal(checkout!)).toBe(87);
  });

  it("finds the minimum checkout, 2 (D1)", () => {
    expect(names(2)).toEqual(["D1"]);
  });

  it("returns null for scores with no standard checkout", () => {
    for (const score of [169, 168, 166, 165, 163, 162, 159]) {
      expect(suggestCheckout(score)).toBeNull();
    }
  });

  it("returns null below 2 and above 170", () => {
    expect(suggestCheckout(1)).toBeNull();
    expect(suggestCheckout(0)).toBeNull();
    expect(suggestCheckout(171)).toBeNull();
  });

  it("every returned checkout ends on a double or bull", () => {
    for (let score = 2; score <= 170; score++) {
      const checkout = suggestCheckout(score);
      if (!checkout) continue;
      const last = checkout[checkout.length - 1];
      expect(last.name.startsWith("D") || last.name === "DBULL").toBe(true);
      expect(checkoutTotal(checkout)).toBe(score);
      expect(checkout.length).toBeLessThanOrEqual(3);
    }
  });
});
