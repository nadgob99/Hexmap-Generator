import React, { useRef, useState, useMemo } from 'react';
import { useHexMap } from '../../context/HexMapContext';
import { Mode } from '../../types/modes';
import { PlaceholderType } from '../../types/placeholders';
import { exportToPng, exportToJson, readJsonFile } from '../../utils/exportUtils';
import styles from './Toolbars.module.css';

const UNIT_TYPES = new Set<PlaceholderType>([
  'pikemen', 'shield', 'sword', 'hero', 'champion',
  'cavalry', 'monster', 'mage', 'archer', 'construct',
]);

const TopToolbar: React.FC = () => {
  const {
    rows, cols, setRows, setCols,
    selectedCellId, cells, setCellText,
    mode, setMode,
    paintColor, setPaintColor,
    activeTool,
    clearGrid, clearDrawPaths,
    beginEdit, undo, canUndo,
    importState, svgRef, drawCanvasRef, drawPaths,
  } = useHexMap();

  const importInputRef = useRef<HTMLInputElement>(null);
  const [exporting, setExporting] = useState(false);

  const selectedText = selectedCellId ? (cells[selectedCellId]?.text || '') : '';

  const unitCount = useMemo(
    () => Object.values(cells).filter(c => c.placeholder && UNIT_TYPES.has(c.placeholder as PlaceholderType)).length,
    [cells],
  );

  const handleExportPng = async () => {
    if (!svgRef.current) return;
    setExporting(true);
    try {
      await exportToPng(svgRef.current, drawCanvasRef.current, drawPaths);
    } finally {
      setExporting(false);
    }
  };

  const handleExportJson = () => {
    exportToJson({ version: 1, rows, cols, cells, drawPaths, mode, paintColor });
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const snapshot = await readJsonFile(file);
      importState(snapshot);
    } catch {
      alert('Could not import: invalid or unsupported file.');
    }
    e.target.value = '';
  };

  return (
    <div className={styles.topToolbar}>
      <label>
        Mode:
        <select value={mode} onChange={e => setMode(e.target.value as Mode)}>
          <option value="basic">Basic</option>
          <option value="ageOfWonders">Age of Wonders</option>
        </select>
      </label>

      <div className={styles.separator} />

      <label>
        Rows:
        <input type="number" min={1} max={50} value={rows} onChange={e => setRows(Number(e.target.value))} />
      </label>
      <label>
        Cols:
        <input type="number" min={1} max={50} value={cols} onChange={e => setCols(Number(e.target.value))} />
      </label>

      <div className={styles.separator} />

      {activeTool === 'paint' && (
        <label>
          Color:
          <input type="color" value={paintColor} onChange={e => setPaintColor(e.target.value)} />
        </label>
      )}

      {selectedCellId && (
        <>
          <div className={styles.separator} />
          <label>
            Hex text:
            <input
              key={selectedCellId}
              type="text"
              value={selectedText}
              onFocus={() => beginEdit()}
              onChange={e => setCellText(selectedCellId, e.target.value)}
              placeholder="Enter text\u2026"
              autoFocus
            />
          </label>
        </>
      )}

      <div style={{ flex: 1 }} />

      {mode === 'ageOfWonders' && (
        <span className={styles.unitCount} title="Number of unit tokens placed on the map">
          ⚔️ Units: <strong>{unitCount}</strong>
        </span>
      )}

      <button
        className={styles.topBtn}
        onClick={undo}
        disabled={!canUndo}
        title="Undo (⌘Z / Ctrl+Z)"
      >
        ↩ Undo
      </button>

      <div className={styles.separator} />

      <button className={styles.topBtn} onClick={handleExportPng} disabled={exporting} title="Export as PNG image">
        {exporting ? '⏳' : '🖼'} PNG
      </button>
      <button className={styles.topBtn} onClick={handleExportJson} title="Export as shareable .hexmap.json file">
        💾 Export
      </button>
      <button className={styles.topBtn} onClick={() => importInputRef.current?.click()} title="Import a .hexmap.json file">
        📂 Import
      </button>
      <input
        ref={importInputRef}
        type="file"
        accept=".json,.hexmap.json"
        style={{ display: 'none' }}
        onChange={handleImport}
      />

      <div className={styles.separator} />

      <button
        className={`${styles.topBtn} ${styles.topBtnDanger}`}
        onClick={clearDrawPaths}
        title="Remove all free-draw lines"
      >
        Clear Draws
      </button>

      <button
        className={`${styles.topBtn} ${styles.topBtnDanger}`}
        onClick={clearGrid}
      >
        Clear All
      </button>
    </div>
  );
};

export default TopToolbar;