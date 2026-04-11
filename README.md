# JavaTetris — HTML5/Phaser 3 Port

A faithful port of [spotco/JavaTetris](https://github.com/spotco/JavaTetris) to HTML5 using [Phaser 3](https://phaser.io/).  
The JavaScript source mirrors the original Java code as closely as possible in structure, naming, and style.

## File mapping

| Java | JavaScript | Role |
|---|---|---|
| `TetrisMain.java` | `src/TetrisMain.js` | Entry point, game loop, rendering, input, audio |
| `GameManager.java` | `src/GameManager.js` | Grid state, line clearing, piece-to-static conversion |
| `PlayerManager.java` | `src/PlayerManager.js` | Active tetromino movement, rotation, hit detection |

## How to run

**No build step required.** Phaser 3 is loaded via CDN.  
You just need a local HTTP server (browsers block ES module imports over `file://`).

### Option A — Python (recommended, built-in on most systems)

```bash
cd JavaTetrisHtml5Port
python -m http.server 8000
```

Then open **http://localhost:8000** in your browser.

### Option B — VS Code Live Server extension

1. Open the `JavaTetrisHtml5Port` folder in VS Code
2. Right-click `index.html` → **Open with Live Server**

### Option C — Node (if installed)

```bash
npx serve .
```

## Controls

| Key | Action |
|---|---|
| `Space` | Start game / confirm game over |
| `←` / `→` | Move piece left / right |
| `↑` | Rotate piece |
| `↓` | Soft drop |
| `Z` | Toggle "trip" mode (secret) |

## Notes

- Animated GIF support (`block0.gif`) is not natively available in Phaser.  
  Trip mode uses a magenta tint on `block0.png` instead.
- Title/game-over GIFs (`title.gif`, `title0.gif`) display as static images (first frame only).
