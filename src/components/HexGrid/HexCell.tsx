import React from 'react';
import { CellData, CellId } from '../../types/hex';
import { placeholderIcons } from '../../constants/placeholderIcons';
import { PlaceholderType } from '../../types/placeholders';

interface HexCellProps {
  cellId: CellId;
  cx: number;
  cy: number;
  size: number;
  points: string;
  data: CellData;
  isSelected: boolean;
  isDragOver: boolean;
  isDraggable: boolean;
  onMouseDown: (id: CellId) => void;
  onMouseEnter: (id: CellId) => void;
  onMouseUp: (id: CellId) => void;
}

const HexCell: React.FC<HexCellProps> = ({
  cellId, cx, cy, size, points, data,
  isSelected, isDragOver, isDraggable,
  onMouseDown, onMouseEnter, onMouseUp,
}) => {
  let fill = '#ffffff';
  if (data.color) fill = data.color;
  if (isSelected) fill = '#dbeafe';

  const strokeColor = isDragOver ? '#f59e0b' : (isSelected ? '#4a90d9' : '#cbd5e1');
  const strokeWidth = isDragOver ? 2.5 : (isSelected ? 2 : 1);

  return (
    <g
      onMouseDown={e => { e.stopPropagation(); onMouseDown(cellId); }}
      onMouseEnter={() => onMouseEnter(cellId)}
      onMouseUp={e => { e.stopPropagation(); onMouseUp(cellId); }}
      style={{ cursor: isDraggable ? 'grab' : 'pointer' }}
    >
      <polygon
        points={points}
        fill={isDragOver ? '#fef3c7' : fill}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
      {data.placeholder && (
        <text
          x={cx}
          y={cy - (data.text ? 4 : 0)}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={size * 0.6}
          style={{ pointerEvents: 'none' }}
        >
          {placeholderIcons[data.placeholder as PlaceholderType]?.emoji || '?'}
        </text>
      )}
      {data.text && (
        <text
          x={cx}
          y={cy + (data.placeholder ? size * 0.35 : 0)}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={Math.min(10, size * 0.3)}
          fill="#1e293b"
          style={{ pointerEvents: 'none', fontWeight: 500 }}
        >
          {data.text.length > 6 ? data.text.slice(0, 6) + '\u2026' : data.text}
        </text>
      )}
    </g>
  );
};

export default React.memo(HexCell);