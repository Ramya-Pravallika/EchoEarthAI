import { Request, Response, NextFunction } from "express";

export function helmetMiddleware(req: Request, res: Response, next: NextFunction) {
  // Simple custom security headers to protect iframe & load processes
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
}
