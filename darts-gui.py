import tkinter as tk
from tkinter import ttk
from typing import List, Tuple, Optional

# ========== Darts logic ==========

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

# Sort for nicer suggestions, high scoring options first
ALL_DARTS.sort(key=lambda d: d[1], reverse=True)


def one_dart_finish(score: int) -> Optional[Checkout]:
    """Check if the score can be finished in one dart, must be a double or bull."""
    for dart in ALL_DARTS:
        name, value = dart
        if value == score and is_double(dart):
            return [dart]
    return None


def two_dart_finish(score: int) -> Optional[Checkout]:
    """Check if the score can be finished in two darts."""
    for first in ALL_DARTS:
        first_value = first[1]
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


# ========== Tkinter GUI ==========

class DartsHelperApp:
    def __init__(self, root: tk.Tk):
        self.root = root
        self.root.title("Darts Checkout Helper")

        # Main frame
        main = ttk.Frame(root, padding=10)
        main.grid(row=0, column=0, sticky="nsew")

        # Configure resizing
        root.columnconfigure(0, weight=1)
        root.rowconfigure(0, weight=1)
        main.columnconfigure(1, weight=1)

        # Score label and entry
        ttk.Label(main, text="Score:").grid(row=0, column=0, sticky="w", padx=(0, 5))
        self.score_var = tk.StringVar()
        self.score_entry = ttk.Entry(main, textvariable=self.score_var)
        self.score_entry.grid(row=0, column=1, sticky="ew")
        self.score_entry.focus()

        # Button
        self.check_button = ttk.Button(main, text="Suggest checkout", command=self.on_suggest)
        self.check_button.grid(row=0, column=2, padx=(5, 0))

        # Result label
        ttk.Label(main, text="Suggestion:").grid(row=1, column=0, sticky="nw", pady=(10, 0))
        self.result_var = tk.StringVar(value="Enter a score and press Enter.")
        self.result_label = ttk.Label(main, textvariable=self.result_var, wraplength=350)
        self.result_label.grid(row=1, column=1, columnspan=2, sticky="w", pady=(10, 0))

        # Bind Enter key to suggest
        self.root.bind("<Return>", self.on_enter)

    def on_enter(self, event):
        # Only trigger if focus is in the entry to avoid weird behaviour
        if self.score_entry.focus_get() == self.score_entry:
            self.on_suggest()

    def on_suggest(self):
        raw = self.score_var.get().strip()

        if not raw.isdigit():
            self.result_var.set("Please enter a whole number like 40 or 170.")
            return

        score = int(raw)
        suggestion = suggest_checkout(score)

        if suggestion is None:
            if score <= 1:
                self.result_var.set("You cannot finish from this score. You should never be on 1.")
            elif score > 170:
                self.result_var.set("No standard 3 dart checkout above 170.")
            else:
                self.result_var.set("No standard checkout found. Set up a better finish.")
        else:
            self.result_var.set(format_checkout(suggestion))


def main():
    root = tk.Tk()
    # On some platforms this makes it look a bit nicer
    try:
        root.style = ttk.Style()
        root.style.theme_use("clam")
    except Exception:
        pass

    app = DartsHelperApp(root)
    root.mainloop()


if __name__ == "__main__":
    main()
