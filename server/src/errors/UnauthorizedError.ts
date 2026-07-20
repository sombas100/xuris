import { HttpError } from "./HttpError.js";

export class UnauthorizedError extends HttpError {
    constructor(
        message = 'Unauthorized',
        code = 'PERMISSION_DENIED'
    ) {
        super(message, 401, code)

        this.name = 'UnauthorizedError';

        Error.captureStackTrace?.(this, this.constructor);    
    }
}