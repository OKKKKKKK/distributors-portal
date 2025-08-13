import { Request, Response, NextFunction } from "express";

interface ApiError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = "Internal Server Error";
  statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || message,
  });
};
