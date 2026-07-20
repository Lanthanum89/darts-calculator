# Darts Checkout Calculator

A comprehensive darts checkout calculator that suggests optimal finishing combinations for any score between 2 and 170. Available in multiple formats: command-line, GUI, and web interfaces.

## Features

- **Intelligent checkout suggestions** – Calculates the optimal 1, 2, or 3-dart finishes
- **Standard darts rules** – All checkouts must finish on a double (including double bull)
- **Complete coverage** – Handles all possible scores from 2 to 170
- **Multiple interfaces** – Choose between CLI, desktop GUI, or web-based versions
- **Mobile-optimised** – Responsive web interface for use at the oche
- **Installable PWA** – Add it to your home screen and use it offline, no app store required

## Available Interfaces

### Command-Line Interface (`darts-cli.py`)
A simple terminal-based calculator for quick checkout lookups.

```bash
python darts-cli.py
```

### Desktop GUI (`darts-gui.py`)
A Tkinter-based graphical interface with a clean, modern design.

```bash
python darts-gui.py
```

### Web Interface (`public/darts-web.html`)
A web-based calculator with a dark theme, perfect for desktop browsers. Simply open the HTML file in any modern browser – no server required.

### Progressive Web App (`index.html` / `src/`)
A mobile-optimised, installable PWA – built with TypeScript and Vite – with an on-screen keypad, colour-coded dart chips, and recent-lookup history. Works offline once installed, and can be added to your phone's home screen for one-tap access during practice or matches. See [Installing as a PWA](#installing-as-a-pwa) below.

## How It Works

The calculator follows standard darts rules:

1. **Singles (S1–S20, SBULL)** – Face value of the number
2. **Doubles (D1–D20, DBULL)** – Double the face value
3. **Triples (T1–T20)** – Triple the face value (up to T20)

All checkouts must finish on a double, following official darts regulations.

### Checkout Logic

The algorithm searches for the shortest possible finish:

1. **One-dart finish** – Direct double or double bull
2. **Two-dart finish** – Any dart + finishing double
3. **Three-dart finish** – Two setup darts + finishing double

If no standard three-dart checkout exists, the calculator will inform you to set up a better finish.

## Usage Examples

### Score: 40
```
Suggested checkout: D20
```

### Score: 87
```
Suggested checkout: T17 . D18  (total 87)
```

### Score: 170
```
Suggested checkout: T20 . T20 . DBULL  (total 170)
```

### Score: 169
```
No standard checkout found. Set up a better finish.
```

## Requirements

### Python Interfaces (CLI and GUI)
- Python 3.7 or higher
- Tkinter (usually included with Python)

### Web Interfaces
- Any modern web browser (Chrome, Firefox, Safari, Edge)
- No internet connection required to use the deployed site
- Building the PWA from source requires [Node.js](https://nodejs.org/) 20+

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/darts-calculator.git
   cd darts-calculator
   ```

2. For Python versions, ensure Python 3.7+ is installed:
   ```bash
   python --version
   ```

3. For the PWA (`index.html` / `src/`), install Node dependencies:
   ```bash
   npm install
   ```

No other dependencies are required – the Python interfaces use only the standard library, and `public/darts-web.html` is plain HTML/CSS/JS.

## Developing the PWA

```bash
npm install
npm run dev       # local dev server with hot reload
npm test          # run the checkout-logic unit tests (vitest)
npm run build     # type-check and produce a production build in dist/
npm run preview   # serve the production build locally
```

## Installing as a PWA

The deployed PWA ships a web app manifest and a service worker (both generated at build time by [`vite-plugin-pwa`](https://vite-pwa-org.netlify.app/) from `vite.config.ts`) that cache the app shell, so once it's loaded once it keeps working with no signal – handy for scoring darts in a shed with no wifi.

Just visiting the deployed site is enough to install it – no build step needed on your end. To try it locally instead, `npm run build && npm run preview` (the service worker needs HTTP(S), so it won't register from a `file://` path or straight from `npm run dev`'s HMR server).

### Desktop (Chrome / Edge)
1. Open the site.
2. Click the install icon in the address bar (or menu → **Install Darts Checkout Calculator**).

### Android (Chrome)
1. Open the site.
2. Tap the menu (⋮) → **Add to Home screen** / **Install app**.

### iOS (Safari)
1. Open the site.
2. Tap the Share icon → **Add to Home Screen**.

Once installed it launches full-screen, without browser chrome, and keeps working offline after the first load.

## Deployment

The PWA deploys to GitHub Pages via the [`deploy.yml`](.github/workflows/deploy.yml) GitHub Actions workflow: every push to `main` runs the test suite, builds the site, and publishes `dist/` (which also includes `public/darts-web.html`, carried through unchanged). In the repo's **Settings → Pages**, the source must be set to **GitHub Actions** rather than "Deploy from a branch".

## Technical Details

### Dart Notation
- `S{n}` – Single (e.g., S20 = 20 points)
- `D{n}` – Double (e.g., D20 = 40 points)
- `T{n}` – Triple (e.g., T20 = 60 points)
- `SBULL` – Single bull (25 points)
- `DBULL` – Double bull (50 points)

### Score Ranges
- **Minimum:** 2 (must finish on a double)
- **Maximum:** 170 (T20 + T20 + DBULL)
- **Impossible finishes:** 169, 168, 166, 165, 163, 162, 159

## Why Some Scores Are Impossible

Certain scores cannot be checked out in three darts due to mathematical constraints. For example:
- **169** – Would require 169 points ending on a double, but no valid combination exists
- **163** – Similarly impossible with the double-finish requirement

These scores indicate you should have gone for a different target earlier in the leg.

## Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## Licence

This project is open source and available under the MIT Licence.

## Acknowledgements

Built for darts enthusiasts who want to improve their checkout knowledge and game strategy.

---

*Good luck on the oche!* 🎯
