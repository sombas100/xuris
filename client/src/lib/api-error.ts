export type ApiErrorResponse = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export class ApiError extends Error {
    public readonly status: number;
    public readonly code?: string;
    public readonly details?: unknown;

    constructor(message: string, status: number, code?: string, details?: unknown) {
        super(message);

        this.name = 'ApiError';
        this.status = status;
        this.code = code;
        this.details = details;

        Object.setPrototypeOf(this, ApiError.prototype);
    }
}