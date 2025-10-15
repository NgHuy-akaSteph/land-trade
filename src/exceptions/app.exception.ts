import { ErrorCode, ErrorDetails } from './error-code';

export class AppException extends Error {
  public readonly status: number;
  public readonly code: ErrorCode;
  public readonly details?: any;

  constructor(errorCode: ErrorCode, customMessage?: string, details?: any) {
    const errorDetail = ErrorDetails[errorCode];
    super(customMessage || errorDetail.message);

    this.status = errorDetail.statusCode;
    this.code = errorCode;
    this.details = details;
    this.name = 'AppException';

    // Maintain proper stack trace for debugging
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppException);
    }
  }
}
