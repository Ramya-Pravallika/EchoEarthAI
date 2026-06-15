import { Router } from "express";
import { simulateEcosystem } from "../controllers/simulator.controller";

const router = Router();
router.post("/", simulateEcosystem);

export default router;
