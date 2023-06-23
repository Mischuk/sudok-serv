import { Router } from "express";
import { STATUS } from "../enums/status";
import { API_DELAY } from "../utils/constants";
import { readFile } from "../utils/fs";

const router = Router();

const getMessagesData = async () => {
  const data = await readFile("puzzles.json");
  return data;
};

router.get("/", async (_, res) => {
  try {
    const all = await getMessagesData();
    setTimeout(() => {
      res.status(STATUS.SUCCESSFUL).send(all);
    }, API_DELAY);
  } catch (error) {
    res.status(STATUS.CLIENT_ERROR).send({
      message: "Something went wrong. Try again.",
    });
  }
});

export default router;
