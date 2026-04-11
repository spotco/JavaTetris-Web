# CLAUDE.md — JavaTetris HTML5 / Phaser 3 Port

## Project Overview
This is a **faithful port** of the original [Java Tetris](https://github.com/spotco/JavaTetris) to HTML5 using **Phaser 3**.

The JavaScript source is written to mirror the original Java code as closely as possible in **structure, naming conventions, class design, and style**.

**Live demo**: https://spotco.github.io/JavaTetrisHtml5Port/

---

## Core Principles (Always Follow)

- **Fidelity first**  
  Preserve the original gameplay feel, mechanics, and visual/audio style.

- **Java-mirroring style**  
  Keep the JS code intentionally Java-like (descriptive class/variable/method names, structure, etc.).  
  Do **not** modernize or refactor into idiomatic modern JS unless explicitly asked.

- **Simplicity**  
  No build step, no bundlers, no dependencies beyond Phaser 3 (loaded via CDN).

---

## Tech Stack & How to Run

### Tech Stack
- **Phaser 3** (via CDN)
- Vanilla **JavaScript** (ES modules)

### Assets
- `img/` — Sprites, titles
- `snd/` — Audio files

### Run Locally
```bash
# Python (recommended)
python -m http.server 8000

# Then open:
http://localhost:8000
```

**Alternative options:**
- VS Code Live Server
- `npx serve .`

---

## File Structure & Responsibilities

- `index.html`  
  Entry point. Loads Phaser and all scripts.

- `src/TetrisMain.js`  
  Main Phaser scene. Handles:
  - preload
  - create
  - game loop
  - rendering
  - input
  - audio
  - high-level game state

- `src/GameManager.js`  
  Manages:
  - playfield grid
  - static blocks
  - line clearing
  - locking pieces into the grid

- `src/PlayerManager.js`  
  Controls the active falling tetromino:
  - movement
  - rotation
  - collision detection
  - soft/hard drop

- `img/`  
  All graphics  
  > Note: Original animated GIFs are represented as static images or via tint effects.

- `snd/`  
  Sound effects

---

## Key Mechanics & Features to Preserve

- Classic 7 tetrominoes
- Rotation system
- Line clearing
- Scoring
- Level and speed progression

- Secret **"trip" mode**  
  - Toggled with `Z` key  
  - Applies a magenta tint to `block0.png`

- Title and game-over screens use static versions of the original GIFs

- Exact original controls (see `README.md`)

---

## Coding Guidelines

- Mirror the original Java structure and naming wherever possible
- Use clear, descriptive variable and method names (Java style)
- Keep comments helpful when porting or modifying logic
- Prefer performance-friendly Phaser patterns (e.g., sprite reuse if expanding the block system)
- Do **not** introduce new dependencies
- Do **not** change the no-build workflow

---

## When Making Changes

- Always reference the corresponding original Java file for logic fidelity
- Test using a local server  
  > Phaser ES modules do **not** work via `file://`
- Maintain the goal:  
  **“Feels like the original Java version”**