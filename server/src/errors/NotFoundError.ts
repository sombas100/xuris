import { HttpError } from "./HttpError";

export class NotFoundError extends HttpError {
    constructor(
        message = 'Resource not found',
        code = 'NOT_FOUND_ERROR',
    ) {
        super(message, 404, code)

        this.name = 'NotFoundError';

        Error.captureStackTrace?.(this, this.constructor);    
    }   
}