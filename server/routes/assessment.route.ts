import { Router } from "express";
import { createAssessment } from "../controllers/assessment.controller";

const router = Router();
router.post("/", createAssessment);

export default router;
