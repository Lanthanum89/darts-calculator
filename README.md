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

### Web Interface (`darts-web.html`)
A web-based calculator with a dark theme, perfect for desktop browsers. Simply open the HTML file in any modern browser – no server required.

### Progressive Web App (`index.html`)
A mobile-optimised, installable PWA with touch-friendly controls and large buttons. Works offline once installed, and can be added to your phone's home screen for one-tap access during practice or matches. See [Installing as a PWA](#installing-as-a-pwa) below.

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
- No internet connection required
- No installation needed

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

3. No additional dependencies required – everything uses Python standard library and vanilla JavaScript.

## Installing as a PWA

`index.html` is a full Progressive Web App: it ships a [web app manifest](manifest.json) and a [service worker](sw.js) that caches the app shell, so once it's loaded once it keeps working with no signal – handy for scoring darts in a shed with no wifi.

The service worker uses relative URLs, so it must be served over HTTP(S) rather than opened as a `file://` path. Locally, that's:

```bash
python -m http.server 8000
# then open http://localhost:8000/ in a browser
```

Or host `index.html`, `manifest.json`, `sw.js`, and the `icons/` folder together on any static host (GitHub Pages, Netlify, etc.).

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
