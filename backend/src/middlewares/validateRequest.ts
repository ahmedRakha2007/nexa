import { validationResult } from "express-validator";
import type { Request, Response, NextFunction } from "express";
import createError from "http-errors";

export function validateRequest(req: Request, res: Response, next: NextFunction): Response | void {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  next();
}