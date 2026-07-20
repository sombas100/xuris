import { HttpError } from "./HttpError.js";

export class UsageLimitError extends HttpError {
  constructor(
    message = "You have reached your monthly AI usage limit",
    code = "MONTHLY_USAGE_LIMIT_REACHED",
  ) {
    super(message, 429, code);

    this.name = "UsageLimitError";

    Error.captureStackTrace?.(
      this,
      this.constructor,
    );
  }
}