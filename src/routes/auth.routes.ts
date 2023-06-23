import { Request, Response, Router } from "express";
import { STATUS } from "../enums/status";
import { v1 as uuidv1 } from "uuid";

const router = Router();

router.get("/signup", async (_: Request, res: Response) => {
  try {
    const id = uuidv1();

    res.status(STATUS.SUCCESSFUL).json({ id });
  } catch (e) {}
});

export default router;
