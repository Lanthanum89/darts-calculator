from typing import List, Tuple, Optional

# Type alias for readability
Dart = Tuple[str, int]   # (notation, score)
Checkout = List[Dart]


def generate_dart_options() -> List[Dart]:
    """
    Generate all reasonable dart options:
    Singles 1–20, 25
    Doubles 2–40, 50
    Triples 3–60 (up to T20)
    """
    darts: List[Dart] = []

    # Singles 1–20
    for n in range(1, 21):
        darts.append((f"S{n}", n))

    # Single bull (25)
    darts.append(("SBULL", 25))

    # Doubles 1–20
    for n in range(1, 21):
        darts.append((f"D{n}", 2 * n))

    # Double bull (50)
    darts.append(("DBULL", 50))

    # Triples 1–20
    for n in range(1, 21):
        darts.append((f"T{n}", 3 * n))

    return darts


def is_double(dart: Dart) -> bool:
    """Return True if this dart is a double (including DBULL)."""
    name, score = dart
    return name.startswith("D") or name == "DBULL" or score == 50


ALL_DARTS: List[Dart] = generate_dart_options()

# Sort for nicer suggestions (high scoring options first)
ALL_DARTS.sort(key=lambda d: d[1], reverse=True)


def one_dart_finish(score: int) -> Optional[Checkout]:
    """Check if the score can be finished in one dart (must be a double or bull)."""
    for dart in ALL_DARTS:
        name, value = dart
        if value == score and is_double(dart):
            return [dart]
    return None


def two_dart_finish(score: int) -> Optional[Checkout]:
    """Check if the score can be finished in two darts."""
    for first in ALL_DARTS:
        first_name, first_value = first
        remaining = score - first_value
        if remaining <= 1:
            continue  # cannot finish on 1 or less
        last = one_dart_finish(remaining)
        if last is not None:
            return [first] + last
    return None


def three_dart_finish(score: int) -> Optional[Checkout]:
    """Check if the score can be finished in three darts."""
    for first in ALL_DARTS:
        first_value = first[1]
        rem_after_first = score - first_value
        if rem_after_first <= 1:
            continue

        for second in ALL_DARTS:
            second_value = second[1]
            rem_after_second = rem_after_first - second_value
            if rem_after_second <= 1:
                continue

            last = one_dart_finish(rem_after_second)
            if last is not None:
                return [first, second] + last
    return None


def suggest_checkout(score: int) -> Optional[Checkout]:
    """
    Suggest a checkout for a given score.
    Returns a list of (notation, score) or None if no standard 3 dart finish exists.
    """
    if score < 2 or score > 170:
        return None

    # Try 1, then 2, then 3 darts
    for fn in (one_dart_finish, two_dart_finish, three_dart_finish):
        result = fn(score)
        if result is not None:
            return result

    return None


def format_checkout(checkout: Checkout) -> str:
    """Format a checkout list into a nice display string."""
    parts = [dart[0] for dart in checkout]
    total = sum(dart[1] for dart in checkout)
    darts_text = " . ".join(parts)
    return f"{darts_text}  (total {total})"


def main():
    print("Darts Checkout Helper")
    print("Type a score between 2 and 170, or 'q' to quit.")
    print()

    while True:
        raw = input("Score to check out: ").strip().lower()

        if raw in ("q", "quit", "exit"):
            print("Good luck on the oche.")
            break

        if not raw.isdigit():
            print("Please enter a whole number like 40 or 170.")
            continue

        score = int(raw)

        suggestion = suggest_checkout(score)

        if suggestion is None:
            if score <= 1:
                print("You cannot finish from this score. You should never be on 1.")
            elif score > 170:
                print("No standard 3 dart checkout above 170.")
            else:
                print("No standard checkout found. Set up a better finish.")
        else:
            print("Suggested checkout:")
            print("  " + format_checkout(suggestion))
        print()


if __name__ == "__main__":
    main()
