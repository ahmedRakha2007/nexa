import type { NextFunction, Request, Response } from "express";
import { MulterError } from "multer";

export default function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err);

  // Handle Multer errors
  if (err instanceof MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "Image size must not exceed 5 MB.",
      });
    }

    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  // Handle all other errors (http-errors, JWT errors you convert, etc.)
  return res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
}