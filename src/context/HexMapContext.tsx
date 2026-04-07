import React, { createContext, useContext, useState, useCallback, useRef, useEffect, ReactNode } from 'react';
import { CellData, CellId } from '../types/hex';
import { Mode } from '../types/modes';
import { PlaceholderType } from '../types/placeholders';

export type Tool = 'select' | 'paint' | 'erase' | 'draw' | 'placeholder';

export interface DrawPath {
  points: { x: number; y: number }[];
  color: string;
  width: number;
}

export interface HexMapSnapshot {
  version: 1;
  rows: number;
  cols: number;
  cells: Record<CellId, CellData>;
  drawPaths: DrawPath[];
  mode: Mode;
  paintColor: string;
}

type HistoryEntry = {
  cells: Record<CellId, CellData>;
  drawPaths: DrawPath[];
};

const STORAGE_KEY = 'hexmap_state_v1';

function loadSavedState(): HexMapSnapshot {
  const defaults: HexMapSnapshot = {
    version: 1, rows: 5, cols: 5,
    cells: {}, drawPaths: [], mode: 'basic', paintColor: '#4a90d9',
  };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw) as HexMapSnapshot;
    if (parsed.version !== 1) return defaults;
    return { ...defaults, ...parsed };
  } catch {
    return defaults;
  }
}

interface HexMapContextType {
  rows: number;
  cols: number;
  setRows: (n: number) => void;
  setCols: (n: number) => void;
  cells: Record<CellId, CellData>;
  selectedCellId: CellId | null;
  selectCell: (id: CellId | null) => void;
  setCellText: (id: CellId, text: string) => void;
  paintCell: (id: CellId) => void;
  eraseCell: (id: CellId) => void;
  placePlaceholder: (id: CellId, type: PlaceholderType) => void;
  removePlaceholder: (id: CellId) => void;
  clearGrid: () => void;
  mode: Mode;
  setMode: (m: Mode) => void;
  activeTool: Tool;
  setActiveTool: (t: Tool) => void;
  paintColor: string;
  setPaintColor: (c: string) => void;
  drawPaths: DrawPath[];
  addDrawPath: (path: DrawPath) => void;
  clearDrawPaths: () => void;
  selectedPlaceholder: PlaceholderType | null;
  setSelectedPlaceholder: (p: PlaceholderType | null) => void;
  beginEdit: () => void;
  undo: () => void;
  canUndo: boolean;
  swapCells: (a: CellId, b: CellId) => void;
  importState: (snapshot: HexMapSnapshot) => void;
  svgRef: React.RefObject<SVGSVGElement>;
  drawCanvasRef: React.RefObject<HTMLCanvasElement>;
}

const HexMapContext = createContext<HexMapContextType | undefined>(undefined);

const emptyCell: CellData = { text: '', color: null, placeholder: null };

export const HexMapProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [init] = useState<HexMapSnapshot>(loadSavedState);

  const [rows, setRowsRaw] = useState(init.rows);
  const [cols, setColsRaw] = useState(init.cols);
  const [cells, setCells] = useState<Record<CellId, CellData>>(init.cells);
  const [selectedCellId, setSelectedCellId] = useState<CellId | null>(null);
  const [mode, setMode] = useState<Mode>(init.mode);
  const [activeTool, setActiveTool] = useState<Tool>('select');
  const [paintColor, setPaintColor] = useState(init.paintColor);
  const [drawPaths, setDrawPaths] = useState<DrawPath[]>(init.drawPaths);
  const [selectedPlaceholder, setSelectedPlaceholder] = useState<PlaceholderType | null>(null);
  const [canUndo, setCanUndo] = useState(false);

  const cellsRef = useRef(cells);
  cellsRef.current = cells;
  const drawPathsRef = useRef(drawPaths);
  drawPathsRef.current = drawPaths;
  const historyRef = useRef<HistoryEntry[]>([]);

  const svgRef = useRef<SVGSVGElement>(null) as React.RefObject<SVGSVGElement>;
  const drawCanvasRef = useRef<HTMLCanvasElement>(null) as React.RefObject<HTMLCanvasElement>;

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      const snapshot: HexMapSnapshot = { version: 1, rows, cols, cells, drawPaths, mode, paintColor };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot)); } catch { /* quota */ }
    }, 600);
    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); };
  }, [rows, cols, cells, drawPaths, mode, paintColor]);

  const pushHistory = useCallback(() => {
    historyRef.current = [
      ...historyRef.current.slice(-49),
      { cells: cellsRef.current, drawPaths: drawPathsRef.current },
    ];
    setCanUndo(true);
  }, []);

  const beginEdit = useCallback(() => { pushHistory(); }, [pushHistory]);

  const undo = useCallback(() => {
    const h = historyRef.current;
    if (h.length === 0) return;
    const prev = h[h.length - 1];
    historyRef.current = h.slice(0, -1);
    setCells(prev.cells);
    setDrawPaths(prev.drawPaths);
    setCanUndo(h.length - 1 > 0);
  }, []);

  const swapCells = useCallback((a: CellId, b: CellId) => {
    pushHistory();
    setCells(prev => {
      const dataA = prev[a] || emptyCell;
      const dataB = prev[b] || emptyCell;
      const next = { ...prev };
      if (Object.values(dataB).every(v => v === null || v === '')) {
        delete next[a];
      } else {
        next[a] = dataB;
      }
      if (Object.values(dataA).every(v => v === null || v === '')) {
        delete next[b];
      } else {
        next[b] = dataA;
      }
      return next;
    });
  }, [pushHistory]);

  const importState = useCallback((snapshot: HexMapSnapshot) => {
    historyRef.current = [];
    setCanUndo(false);
    setRowsRaw(snapshot.rows);
    setColsRaw(snapshot.cols);
    setCells(snapshot.cells);
    setDrawPaths(snapshot.drawPaths);
    setMode(snapshot.mode);
    setPaintColor(snapshot.paintColor);
    setSelectedCellId(null);
  }, []);

  const setRows = useCallback((n: number) => setRowsRaw(Math.max(1, Math.min(50, n))), []);
  const setCols = useCallback((n: number) => setColsRaw(Math.max(1, Math.min(50, n))), []);

  const selectCell = useCallback((id: CellId | null) => setSelectedCellId(id), []);

  const setCellText = useCallback((id: CellId, text: string) => {
    setCells(prev => ({ ...prev, [id]: { ...(prev[id] || emptyCell), text } }));
  }, []);

  const paintCell = useCallback((id: CellId) => {
    setCells(prev => ({ ...prev, [id]: { ...(prev[id] || emptyCell), color: paintColor } }));
  }, [paintColor]);

  const eraseCell = useCallback((id: CellId) => {
    setCells(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setSelectedCellId(prev => (prev === id ? null : prev));
  }, []);

  const placePlaceholder = useCallback((id: CellId, type: PlaceholderType) => {
    pushHistory();
    setCells(prev => ({ ...prev, [id]: { ...(prev[id] || emptyCell), placeholder: type } }));
  }, [pushHistory]);

  const removePlaceholder = useCallback((id: CellId) => {
    pushHistory();
    setCells(prev => ({ ...prev, [id]: { ...(prev[id] || emptyCell), placeholder: null } }));
  }, [pushHistory]);

  const clearGrid = useCallback(() => {
    pushHistory();
    setCells({});
    setSelectedCellId(null);
    setDrawPaths([]);
  }, [pushHistory]);

  const addDrawPath = useCallback((path: DrawPath) => {
    pushHistory();
    setDrawPaths(prev => [...prev, path]);
  }, [pushHistory]);

  const clearDrawPaths = useCallback(() => {
    pushHistory();
    setDrawPaths([]);
  }, [pushHistory]);

  const value: HexMapContextType = {
    rows, cols, setRows, setCols,
    cells, selectedCellId, selectCell,
    setCellText, paintCell, eraseCell,
    placePlaceholder, removePlaceholder, clearGrid,
    mode, setMode, activeTool, setActiveTool,
    paintColor, setPaintColor,
    drawPaths, addDrawPath, clearDrawPaths,
    selectedPlaceholder, setSelectedPlaceholder,
    beginEdit, undo, canUndo,
    swapCells,
    importState, svgRef, drawCanvasRef,
  };

  return (
    <HexMapContext.Provider value={value}>
      {children}
    </HexMapContext.Provider>
  );
};

export const useHexMap = (): HexMapContextType => {
  const ctx = useContext(HexMapContext);
  if (!ctx) throw new Error('useHexMap must be used within HexMapProvider');
  return ctx;
};