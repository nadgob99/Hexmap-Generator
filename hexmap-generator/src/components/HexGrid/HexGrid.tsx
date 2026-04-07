import React, { useCallback, useRef, useMemo, useState } from 'react';
import { useHexMap } from '../../context/HexMapContext';
import { makeCellId, CellId } from '../../types/hex';
import HexCell from './HexCell';
import styles from './HexGrid.module.css';

const HEX_SIZE = 35;
const PADDING = 20;

const hexPoints = (cx: number, cy: number, size: number): string => {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 180) * (60 * i);
    return `${cx + size * Math.cos(angle)},${cy + size * Math.sin(angle)}`;
  }).join(' ');
};

const emptyCell = { text: '', color: null, placeholder: null };

const HexGrid: React.FC = () => {
  const {
    rows, cols, cells, selectedCellId, selectCell,
    activeTool, paintCell, eraseCell,
    placePlaceholder, selectedPlaceholder,
    beginEdit, svgRef, swapCells,
  } = useHexMap();
  const isPainting = useRef(false);
  const dragSource = useRef<CellId | null>(null);
  const isDragging = useRef(false);
  const [dragOverId, setDragOverId] = useState<CellId | null>(null);

  const gridInfo = useMemo(() => {
    const s = HEX_SIZE;
    const sqrt3 = Math.sqrt(3);
    const hexes: { id: CellId; cx: number; cy: number; points: string }[] = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cx = PADDING + s + 1.5 * s * c;
        const cy = PADDING + s * sqrt3 / 2 + s * sqrt3 * r + (c % 2 === 1 ? s * sqrt3 / 2 : 0);
        hexes.push({ id: makeCellId(r, c), cx, cy, points: hexPoints(cx, cy, s) });
      }
    }

    const width = cols > 0 ? 1.5 * s * (cols - 1) + 2 * s + 2 * PADDING : 2 * PADDING;
    const height = rows > 0
      ? s * sqrt3 * rows + (cols > 1 ? s * sqrt3 / 2 : 0) + 2 * PADDING
      : 2 * PADDING;

    return { hexes, width, height };
  }, [rows, cols]);

  const handleCellAction = useCallback((id: CellId) => {
    switch (activeTool) {
      case 'select':
        selectCell(id);
        break;
      case 'paint':
        paintCell(id);
        break;
      case 'erase':
        eraseCell(id);
        break;
      case 'placeholder':
        if (selectedPlaceholder) placePlaceholder(id, selectedPlaceholder);
        break;
    }
  }, [activeTool, selectCell, paintCell, eraseCell, placePlaceholder, selectedPlaceholder]);

  const onMouseDown = useCallback((id: CellId) => {
    if (activeTool === 'paint' || activeTool === 'erase') {
      beginEdit();
      isPainting.current = true;
      handleCellAction(id);
    } else if (activeTool === 'select') {
      dragSource.current = id;
      isDragging.current = false;
    } else {
      handleCellAction(id);
    }
  }, [activeTool, beginEdit, handleCellAction]);

  const onMouseEnter = useCallback((id: CellId) => {
    if (isPainting.current && (activeTool === 'paint' || activeTool === 'erase')) {
      handleCellAction(id);
    } else if (activeTool === 'select' && dragSource.current && dragSource.current !== id) {
      isDragging.current = true;
      setDragOverId(id);
    }
  }, [activeTool, handleCellAction]);

  const onCellMouseUp = useCallback((id: CellId) => {
    if (activeTool === 'select') {
      if (isDragging.current && dragSource.current && dragSource.current !== id) {
        swapCells(dragSource.current, id);
      } else if (!isDragging.current && dragSource.current === id) {
        selectCell(id);
      }
      dragSource.current = null;
      isDragging.current = false;
      setDragOverId(null);
    }
    isPainting.current = false;
  }, [activeTool, swapCells, selectCell]);

  const onMouseUp = useCallback(() => {
    isPainting.current = false;
    dragSource.current = null;
    isDragging.current = false;
    setDragOverId(null);
  }, []);

  return (
    <div className={styles.gridContainer} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}>
      <svg ref={svgRef} className={styles.gridSvg} width={gridInfo.width} height={gridInfo.height}>
        {gridInfo.hexes.map(hex => (
          <HexCell
            key={hex.id}
            cellId={hex.id}
            cx={hex.cx}
            cy={hex.cy}
            size={HEX_SIZE}
            points={hex.points}
            data={cells[hex.id] || emptyCell}
            isSelected={hex.id === selectedCellId}
            isDragOver={hex.id === dragOverId}
            isDraggable={activeTool === 'select'}
            onMouseDown={onMouseDown}
            onMouseEnter={onMouseEnter}
            onMouseUp={onCellMouseUp}
          />
        ))}
      </svg>
    </div>
  );
};

export default HexGrid;