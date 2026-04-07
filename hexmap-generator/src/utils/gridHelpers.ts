import { CellId, makeCellId } from '../types/hex';

export const generateCellIds = (rows: number, cols: number): CellId[] => {
  const ids: CellId[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      ids.push(makeCellId(r, c));
    }
  }
  return ids;
};