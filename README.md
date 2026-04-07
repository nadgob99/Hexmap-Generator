# Hexmap Generator

A browser-based hexagonal map editor built with React, TypeScript, and Vite. Design battle maps, plan strategy layouts, or sketch out game worlds using an interactive SVG hex grid.

## Features

### Grid & Editing
- Configurable grid size (rows × columns, up to 50×50)
- Paint hexes with a custom color picker
- Erase individual cells or clear the entire grid
- Label any hex with short text
- Freehand draw mode overlaid on the grid (canvas layer)
- Clear all drawn strokes independently from the grid

### Modes
- **Basic** — plain hex grid for general-purpose mapping
- **Age of Wonders** — places units and terrain on hexes from a palette:

  | Terrain | Units |
  |---------|-------|
  | 🌲 Trees | ⚔️ Pikemen |
  | 🪨 Rock | 🛡️ Shield |
  | 💧 Water | 🗡️ Sword |
  | | ⭐ Hero |
  | | 👑 Champion |
  | | 🐴 Cavalry |
  | | 👹 Monster |
  | | 🧙 Mage |
  | | 🏹 Archer |
  | | 🏗️ Construct |

  A live **unit count badge** shows how many unit tiles are placed on the map.

### Interaction
- **Select tool** — click to select a hex; drag onto another hex to swap their contents
- **Undo** — `⌘Z` / `Ctrl+Z` or the toolbar button (50-step history)

### Persistence & Export
- Auto-saves to `localStorage` (survives page refresh)
- Export as **PNG** (composite of SVG grid + draw layer)
- Export / Import as **JSON** (`.hexmap.json`)

## Tech Stack

- [Vite](https://vitejs.dev/) + [React 18](https://react.dev/) + TypeScript
- SVG hex grid (no canvas library)
- CSS Modules
- Context API for state management (no Redux)

## Getting Started

```bash
npm install
npm run dev       # development server at http://localhost:5173
npm run build     # production build → dist/
npm run preview   # preview production build locally
```

## Project Structure

```
src/
├── components/
│   ├── DrawCanvas/       # freehand canvas overlay
│   ├── HexGrid/          # SVG grid + individual cells
│   ├── Placeholders/     # placeholder palette
│   └── Toolbars/         # top & left toolbars
├── constants/            # mode configs, placeholder icon map
├── context/              # HexMapContext — all app state
├── hooks/                # (stub files, logic lives in context)
├── modes/                # BasicMode, AgeOfWondersMode stubs
├── types/                # CellData, Mode, PlaceholderType, etc.
└── utils/                # hexMath, gridHelpers, exportUtils
```

│   ├── constants
│   ├── styles
│   └── App.module.css
├── public
│   └── index.html
├── package.json
├── tsconfig.json
└── README.md
```

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.