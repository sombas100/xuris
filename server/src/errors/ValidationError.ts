import { HttpError } from "./HttpError";

export class ValidationError extends HttpError {
    constructor(
        message = 'Validation error',
        code = 'VALIATION_ERROR',
    ) {
        super(message, 400, code)

        this.name = 'ValidationError';

        Error.captureStackTrace?.(this, this.constructor);    
    }
}