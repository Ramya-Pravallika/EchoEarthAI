import { Router } from "express";
import { coachChat } from "../controllers/coach.controller";

const router = Router();
router.post("/", coachChat);

export default router;
