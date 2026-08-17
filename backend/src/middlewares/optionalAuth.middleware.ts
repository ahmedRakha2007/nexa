import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.ts";
import type { AuthRequest } from "./auth.middleware.ts";

export const optionalAuthMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next();
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return next();
  }

  try {
    const payload = verifyToken(token);

    req.user = payload;

    next();
  } catch {
    next();
  }
};