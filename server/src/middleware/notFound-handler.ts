import type { RequestHandler } from "express";
import { errorResponse } from "../utils/api-response";

export const notFoundHandler: RequestHandler = (_req, res) => {
    return errorResponse(
        res,
        404,
        'ROUTE_NOT_FOUND',
        "Route was not found",
        "This route has not been created."
    )
}