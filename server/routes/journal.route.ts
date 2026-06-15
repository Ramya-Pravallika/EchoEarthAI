import { Router } from "express";
import { analyzeJournal } from "../controllers/journal.controller";

const router = Router();
router.post("/", analyzeJournal);

export default router;
