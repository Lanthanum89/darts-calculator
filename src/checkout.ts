export type DartKind = "single" | "double" | "triple" | "bull";

export interface Dart {
  name: string;
  value: number;
  kind: DartKind;
}

export type Checkout = Dart[];

function generateDartOptions(): Dart[] {
  const darts: Dart[] = [];

  for (let n = 1; n <= 20; n++) {
    darts.push({ name: "S" + n, value: n, kind: "single" });
  }

  darts.push({ name: "SBULL", value: 25, kind: "bull" });

  for (let n = 1; n <= 20; n++) {
    darts.push({ name: "D" + n, value: 2 * n, kind: "double" });
  }

  darts.push({ name: "DBULL", value: 50, kind: "bull" });

  for (let n = 1; n <= 20; n++) {
    darts.push({ name: "T" + n, value: 3 * n, kind: "triple" });
  }

  darts.sort((a, b) => b.value - a.value);
  return darts;
}

const ALL_DARTS = generateDartOptions();

function isDouble(dart: Dart): boolean {
  return dart.kind === "double" || dart.name === "DBULL" || dart.value === 50;
}

function oneDartFinish(score: number): Checkout | null {
  for (const dart of ALL_DARTS) {
    if (dart.value === score && isDouble(dart)) {
      return [dart];
    }
  }
  return null;
}

function twoDartFinish(score: number): Checkout | null {
  for (const first of ALL_DARTS) {
    const remaining = score - first.value;
    if (remaining <= 1) continue;
    const last = oneDartFinish(remaining);
    if (last) return [first, ...last];
  }
  return null;
}

function threeDartFinish(score: number): Checkout | null {
  for (const first of ALL_DARTS) {
    const remAfterFirst = score - first.value;
    if (remAfterFirst <= 1) continue;

    for (const second of ALL_DARTS) {
      const remAfterSecond = remAfterFirst - second.value;
      if (remAfterSecond <= 1) continue;

      const last = oneDartFinish(remAfterSecond);
      if (last) return [first, second, ...last];
    }
  }
  return null;
}

export function suggestCheckout(score: number): Checkout | null {
  if (score < 2 || score > 170) return null;

  const finishers = [oneDartFinish, twoDartFinish, threeDartFinish];
  for (const finish of finishers) {
    const result = finish(score);
    if (result) return result;
  }
  return null;
}

export function checkoutTotal(checkout: Checkout): number {
  return checkout.reduce((sum, dart) => sum + dart.value, 0);
}
