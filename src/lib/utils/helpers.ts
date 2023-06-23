import { DOT, MAX_NUM } from "./constants";
import { CellNotes, CellValue, ChunkRange, DTO_Game, GameInfo, GameRow } from "./types";

const getValues = (data: string[]) =>
  data.map((v: string) => (v !== DOT ? Number(v) : null));

const getChunks = ({ value, range }: { value: string; range: ChunkRange }) => {
  return getValues(value.split("").slice(range[0], range[1]));
};

const getRow = ({
  id,
  puzzle,
  solution,
}: {
  id: number;
  puzzle: CellValue[];
  solution: number[];
}): GameRow => {
  const notes: CellNotes[] = [];
  return {
    id,
    cells: puzzle.map((cell, cellIndex) => ({
      value: cell,
      answer: solution[cellIndex],
      notes,
      error: false,
    })),
  };
};

const getMatrix = ({ puzzle, solution }: DTO_Game): GameInfo[] => {
  const chunkSize = MAX_NUM;
  const data: GameInfo[] = [];

  for (let i = 0; i < chunkSize * MAX_NUM; i += chunkSize) {
    const range: ChunkRange = [i, i + chunkSize];
    data.push({
      id: i,
      puzzle: getChunks({ value: puzzle, range }),
      solution: getChunks({ value: solution, range }) as number[],
    });
  }

  return data;
};

export const transformData = (data: DTO_Game) => getMatrix(data).map(getRow);
