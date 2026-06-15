import { Response } from "express";

/**
 * Common Express Error Handler Utility
 */
export function handleError(res: Response, error: any, statusCode = 500, userMessage = "Internal Server Fault occurred."): void {
  console.error("Express App Handler caught error details:", error);
  
  // Safe sanitization
  const responseData = {
    error: userMessage,
    message: process.env.NODE_ENV === "production" ? "Access to debug traces is restricted." : (error.message || String(error)),
  };

  res.status(statusCode).json(responseData);
}
