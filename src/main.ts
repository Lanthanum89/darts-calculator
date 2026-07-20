import "./style.css";
import { checkoutTotal, suggestCheckout, type Checkout, type Dart } from "./checkout";
import { LookupHistory } from "./history";

const scoreInput = document.querySelector<HTMLInputElement>("#scoreInput")!;
const suggestButton = document.querySelector<HTMLButtonElement>("#suggestButton")!;
const resultBox = document.querySelector<HTMLDivElement>("#resultBox")!;
const keypad = document.querySelector<HTMLDivElement>("#keypad")!;
const recentList = document.querySelector<HTMLDivElement>("#recentList")!;
const recentSection = document.querySelector<HTMLDivElement>("#recentSection")!;

const history = new LookupHistory();

function dartKindClass(dart: Dart): string {
  return dart.kind;
}

function renderMessage(message: string): void {
  resultBox.innerHTML = "";
  const p = document.createElement("div");
  p.className = "result-message";
  p.textContent = message;
  resultBox.appendChild(p);
  pulse();
}

function renderCheckout(checkout: Checkout): void {
  resultBox.innerHTML = "";

  const chips = document.createElement("div");
  chips.className = "result-chips";
  for (const dart of checkout) {
    const chip = document.createElement("span");
    chip.className = `dart-chip ${dartKindClass(dart)}`;
    chip.textContent = dart.name;
    chips.appendChild(chip);
  }
  resultBox.appendChild(chips);

  const total = document.createElement("div");
  total.className = "result-total";
  total.textContent = `${checkout.length} dart${checkout.length === 1 ? "" : "s"} · total ${checkoutTotal(checkout)}`;
  resultBox.appendChild(total);

  pulse();
}

function pulse(): void {
  resultBox.classList.remove("pulse");
  // Force reflow so the animation restarts on repeated identical results.
  void resultBox.offsetWidth;
  resultBox.classList.add("pulse");
}

function renderRecent(): void {
  const entries = history.list();
  recentSection.style.display = entries.length ? "block" : "none";
  recentList.innerHTML = "";

  for (const score of entries) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = String(score);
    btn.addEventListener("click", () => {
      scoreInput.value = String(score);
      handleSuggest();
    });
    recentList.appendChild(btn);
  }
}

function handleSuggest(): void {
  const raw = scoreInput.value.trim();

  if (!raw) {
    renderMessage("Please enter a score.");
    return;
  }

  const score = Number(raw);

  if (!Number.isInteger(score) || Number.isNaN(score)) {
    renderMessage("Please enter a whole number like 40 or 170.");
    return;
  }

  const suggestion = suggestCheckout(score);

  if (!suggestion) {
    if (score <= 1) {
      renderMessage("You cannot finish from this score, you should never be on 1.");
    } else if (score > 170) {
      renderMessage("No standard 3 dart checkout above 170.");
    } else {
      renderMessage("No standard checkout found, set up a better finish.");
    }
    return;
  }

  renderCheckout(suggestion);
  history.add(score);
  renderRecent();
}

suggestButton.addEventListener("click", handleSuggest);

scoreInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleSuggest();
  }
});

keypad.addEventListener("click", (e) => {
  const target = e.target;
  if (!(target instanceof HTMLButtonElement)) return;

  const digit = target.dataset.digit;
  if (digit !== undefined) {
    const next = scoreInput.value + digit;
    // Max valid score is 170, three digits.
    if (next.length <= 3) {
      scoreInput.value = next;
    }
    scoreInput.focus();
    return;
  }

  if (target.dataset.action === "clear") {
    scoreInput.value = "";
    scoreInput.focus();
    return;
  }

  if (target.dataset.action === "backspace") {
    scoreInput.value = scoreInput.value.slice(0, -1);
    scoreInput.focus();
  }
});

window.addEventListener("load", () => {
  scoreInput.focus();
});
