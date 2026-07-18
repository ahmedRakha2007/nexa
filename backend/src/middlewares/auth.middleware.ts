import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.ts";

interface AuthRequest extends Request {
  user?: any;
}

const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get Authorization header
    const authorization = req.headers.authorization;

    // Check if header exists
    if (!authorization) {
      return res.status(401).json({
        message: "U are not logged in",
      });
    }

    // Check Bearer format
    if (!authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Invalid authorization format.",
      });
    }

    // Extract token
    const token = authorization.split(" ")[1]!;

    // Verify token
    const payload = verifyToken(token);

    // Attach payload to request
    req.user = payload;

    // Continue to the next middleware/controller
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token.",
    });
  }
};

export default authMiddleware;