import { HttpError } from "./HttpError";

export class InternalServerError extends HttpError {
    constructor(
        message = 'Something went wrong',
        code = 'INTERNAL_SERVER_ERROR'
    ) {
        super(message, 500, code)

        this.name = 'InternalServerError';

        Error.captureStackTrace?.(this, this.constructor);    
    }
}