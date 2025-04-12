import express from "express";
import {checkJwt} from "../middlewarre/auth.js";
import {getBoardChat} from "../controllers/chat.js";
import {AuthenticatedRequest} from "../types/auth.js";

const router = express.Router();

router.get("/:boardId", checkJwt, (req, res) =>
  getBoardChat(req as AuthenticatedRequest, res)
);

export default router;
