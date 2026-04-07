export interface CellData {
  text: string;
  color: string | null;
  placeholder: string | null;
}

export type CellId = string; // "row-col"

export const makeCellId = (row: number, col: number): CellId => `${row}-${col}`;

export const parseCellId = (id: CellId): { row: number; col: number } => {
  const [row, col] = id.split('-').map(Number);
  return { row, col };
};