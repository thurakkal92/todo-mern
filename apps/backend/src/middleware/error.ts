import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { NotFoundError, BadRequestError } from "../lib/errors";

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof ZodError) {
    res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Validation failed",
        details: err.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      },
    });
    return;
  }

  if (err instanceof NotFoundError || err instanceof BadRequestError) {
    res.status(err.statusCode).json({
      error: { code: err.code, message: err.message },
    });
    return;
  }

  const message = err instanceof Error ? err.message : "An unexpected error occurred";
  res.status(500).json({
    error: { code: "INTERNAL_ERROR", message },
  });
}
