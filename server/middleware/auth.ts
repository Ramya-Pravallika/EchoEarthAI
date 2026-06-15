import { Request, Response, NextFunction } from "express";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  // Simple pass-through for now or api-key validation if configured
  next();
}
