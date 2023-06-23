export interface DTO_Player {
  id: string;
}

export interface DTO_Game {
  puzzle: string;
  solution: string;
}

export enum Diff {
  Easy = "Easy",
  Normal = "Normal",
  Hard = "Hard",
  Ultra = "Ultra",
}

export type CellNotes = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type CellValue = number | null;

export interface GameCell {
  value: CellValue;
  answer: number;
  notes: CellNotes[];
  error: boolean;
  highlighted?: boolean;
}

export interface GameRow {
  id: number;
  cells: GameCell[];
}

export interface Progress {
  id: string;
  value: number;
}

export type ChunkRange = [number, number];

export interface GameInfo {
  id: number;
  puzzle: CellValue[];
  solution: number[];
}
