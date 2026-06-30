import type { Request, Response, NextFunction } from "express";
import { ZodError, z } from "zod";
import { Prisma } from '../../generated/prisma/client'

import { errorResponse } from "../utils/api-response";
import { HttpError } from "../errors/HttpError";
import { logger } from "../utils/logger";
import { handlePrismaError } from "../errors/PrismaError";

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  const message = err instanceof Error ? err.message : "Unknown error";

  logger.error("Unhandled error", {
    message,
    stack: err instanceof Error ? err.stack : undefined,
    path: req.path,
    method: req.method,
    originalUrl: req.originalUrl,
  });

  if (err instanceof HttpError) {
    return errorResponse(res, err.statusCode, err.code, err.message);
  }

  if (err instanceof ZodError) {
    return errorResponse(
      res,
      400,
      "VALIDATION_ERROR",
      "Invalid request data",
      z.flattenError(err),
    );
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const prismaError = handlePrismaError(err);

    return errorResponse(
        res,
        prismaError.statusCode,
        prismaError.code,
        prismaError.message
    );
}

  return errorResponse(
    res,
    500,
    "INTERNAL_SERVER_ERROR",
    "Something went wrong..."
  );
}