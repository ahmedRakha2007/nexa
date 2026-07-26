import type { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import { verifyToken } from "../utils/jwt.ts";

interface AuthRequest extends Request {
  user?: any;
}

const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authorization = req.headers.authorization;

if (!authorization) {
  throw createError(401, "Authorization header is required.");
}

if (!authorization.startsWith("Bearer ")) {
  throw createError(401, "Authorization header must use the Bearer scheme.");
}

const token = authorization.split(" ")[1];

if (!token) {
  throw createError(401, "Bearer token is missing.");
}

try {
  const payload = verifyToken(token);
  req.user = payload;
} catch {
  throw createError(401, "Invalid or expired access token.");
}

next();
};

export default authMiddleware;