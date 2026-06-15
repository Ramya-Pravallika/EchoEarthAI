import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export function errorHandlerMiddleware(err: any, req: Request, res: Response, next: NextFunction) {
  logger.error("Express unhandled catch:", err);
  res.status(err.status || 500).json({ error: err.message || "Failed processing request on backend." });
}
