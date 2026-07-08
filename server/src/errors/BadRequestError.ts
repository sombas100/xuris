import { HttpError } from "./HttpError";

export class BadRequestError extends HttpError {
    constructor(
        message = 'There was a bad request',
        code = 'BAD_REQUEST_ERROR'
    ) {
        super(message, 400, code)

        this.name = 'BadRequestError';

        Error.captureStackTrace?.(this, this.constructor);    
    }
}