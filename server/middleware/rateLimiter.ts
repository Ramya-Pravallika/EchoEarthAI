import { Request, Response, NextFunction } from "express";

export function rateLimiterMiddleware(req: Request, res: Response, next: NextFunction) {
  // Pass-through rate limiter
  next();
}
