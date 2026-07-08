import { HttpError } from "./HttpError";

export class ConflictError extends HttpError {
    constructor(
        message = 'Resource already exists',
        code = 'DUPLICATE_RESOURCE',
    ) {
        super(message, 409, code);

        this.name = 'ConflictError'

        Error.captureStackTrace?.(this, this.constructor);    
    }
}