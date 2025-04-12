import express from "express";
import { checkJwt } from "../middlewarre/auth.js";
import { storeUserData } from "../controllers/auth.js";
import { AuthenticatedRequest } from "../types/auth.js";

const router = express.Router();

router.post("/", checkJwt, (req, res) => storeUserData(req as AuthenticatedRequest, res));

export default router;