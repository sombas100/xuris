import { Prisma } from "../generated/prisma/client.js";

export function handlePrismaError(err: Prisma.PrismaClientKnownRequestError) {
  switch (err.code) {
    case "P2002":
      return {
        statusCode: 409,
        code: "DUPLICATE_RESOURCE",
        message: "Resource already exists",
      };

    case "P2025":
      return {
        statusCode: 404,
        code: "RESOURCE_NOT_FOUND",
        message: "Resource not found",
      };

    case "P2003":
      return {
        statusCode: 400,
        code: "INVALID_RELATION",
        message: "Invalid related resource",
      };

    default:
      return {
        statusCode: 500,
        code: "DATABASE_ERROR",
        message: "Database error",
      };
  }
}