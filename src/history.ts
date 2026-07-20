const MAX_ENTRIES = 5;

export class LookupHistory {
  private entries: number[] = [];

  constructor(private readonly maxEntries: number = MAX_ENTRIES) {}

  add(score: number): number[] {
    this.entries = [score, ...this.entries.filter((s) => s !== score)].slice(
      0,
      this.maxEntries
    );
    return this.entries;
  }

  list(): number[] {
    return this.entries;
  }
}
