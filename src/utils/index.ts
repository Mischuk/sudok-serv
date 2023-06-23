import { DTO_Game, DTO_Player, Diff } from "../lib";
import { ServerClient } from "../models/ServerClient";
import { readFile } from "./fs";

const deepCopy = (obj: Object) => JSON.parse(JSON.stringify(obj));

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const DTO_Players = (players: ServerClient[]): DTO_Player[] =>
  players.map(({ id }) => ({ id }));

const getPuzzlesFromFile = async (filename: string) => {
  const data = await readFile(`${filename}.json`);
  return data;
};

const getRandomPuzzle = async (diff: Diff): Promise<DTO_Game> => {
  const puzzles: any = await getPuzzlesFromFile(diff);

  const { data = [] } = puzzles;
  const randomIndex = getRandomInt(0, data.length - 1);
  return data[randomIndex];
};

export { deepCopy, getRandomInt, DTO_Players, getRandomPuzzle };
