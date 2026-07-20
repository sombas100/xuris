import { HttpError } from "./HttpError.js";

export class ForbiddenError extends HttpError {
    constructor(
        message = 'Forbidden',
        code = 'ACCESS_DENIED',
    ) {
        super(message, 403, code);

        this.name = 'ForbiddenError'

        Error.captureStackTrace?.(this, this.constructor);    ;
    }
}