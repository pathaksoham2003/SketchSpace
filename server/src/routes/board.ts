// src/routes/board.ts
import express, { Request, Response, Router } from "express";
import { config as configDotenv } from "dotenv";
configDotenv();

const router: Router = express.Router();

import { checkJwt } from "../middlewarre/auth.js";

import {
  addMember,
  createBoard,
  getBoard,
  getBoardsByMe,
  getBoardsShared,
} from "../controllers/board.js";

router.post("/", checkJwt, (req, res) => createBoard(req as any, res));
router.post("/:id/add", checkJwt, (req, res) => addMember(req as any, res));
router.get("/shared", checkJwt, (req, res) => getBoardsShared(req as any, res));
router.get("/me", checkJwt, (req, res) => getBoardsByMe(req as any, res));
router.get("/:id", checkJwt, (req, res) => getBoard(req as any, res));

export default router;
