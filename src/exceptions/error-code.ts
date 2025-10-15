export enum ErrorCode {
  // 4xx Client Errors
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',

  // 5xx Server Errors
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',

  // Business Logic Errors
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  PHONE_ALREADY_EXISTS = 'PHONE_ALREADY_EXISTS',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  INVALID_TOKEN = 'INVALID_TOKEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  LISTING_NOT_AVAILABLE = 'LISTING_NOT_AVAILABLE',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  LISTING_NOT_FOUND = 'LISTING_NOT_FOUND',
}

// Strongly typed error detail.
// NOTE: "code" and "statusCode" are intentionally both kept for backward compatibility.
// You can remove one later (prefer keeping only statusCode) after updating all usages.
export interface ErrorDetail {
  code: number; // HTTP status code (legacy field)
  statusCode: number; // HTTP status code (preferred field)
  message: string; // Human readable default message
}

export const ErrorDetails: Record<ErrorCode, ErrorDetail> = Object.freeze({
  [ErrorCode.BAD_REQUEST]: {
    code: 400,
    statusCode: 400,
    message: 'Bad request',
  },
  [ErrorCode.UNAUTHORIZED]: {
    code: 401,
    statusCode: 401,
    message: 'Unauthorized access',
  },
  [ErrorCode.FORBIDDEN]: {
    code: 403,
    statusCode: 403,
    message: 'Access forbidden',
  },
  [ErrorCode.NOT_FOUND]: {
    code: 404,
    statusCode: 404,
    message: 'Resource not found',
  },
  [ErrorCode.CONFLICT]: {
    code: 409,
    statusCode: 409,
    message: 'Resource conflict',
  },
  [ErrorCode.VALIDATION_ERROR]: {
    code: 422,
    statusCode: 422,
    message: 'Validation failed',
  },
  [ErrorCode.INVALID_INPUT]: {
    code: 400,
    statusCode: 400,
    message: 'Invalid input provided',
  },
  [ErrorCode.INTERNAL_SERVER_ERROR]: {
    code: 500,
    statusCode: 500,
    message: 'Internal server error',
  },
  [ErrorCode.DATABASE_ERROR]: {
    code: 500,
    statusCode: 500,
    message: 'Database operation failed',
  },
  [ErrorCode.SERVICE_UNAVAILABLE]: {
    code: 503,
    statusCode: 503,
    message: 'Service temporarily unavailable',
  },
  [ErrorCode.EMAIL_ALREADY_EXISTS]: {
    code: 409,
    statusCode: 409,
    message: 'Email already exists',
  },
  [ErrorCode.PHONE_ALREADY_EXISTS]: {
    code: 409,
    statusCode: 409,
    message: 'Phone number already exists',
  },
  [ErrorCode.INVALID_CREDENTIALS]: {
    code: 401,
    statusCode: 401,
    message: 'Invalid email or password',
  },
  [ErrorCode.INVALID_TOKEN]: {
    code: 401,
    statusCode: 401,
    message: 'Invalid or malformed token',
  },
  [ErrorCode.TOKEN_EXPIRED]: {
    code: 401,
    statusCode: 401,
    message: 'Token has expired',
  },
  [ErrorCode.LISTING_NOT_AVAILABLE]: {
    code: 400,
    statusCode: 400,
    message: 'Listing is not available for this operation',
  },
  [ErrorCode.USER_NOT_FOUND]: {
    code: 404,
    statusCode: 404,
    message: 'User not found',
  },
  [ErrorCode.LISTING_NOT_FOUND]: {
    code: 404,
    statusCode: 404,
    message: 'Listing not found',
  },
});

// Helper to safely fetch an error detail (prevents undefined access if enum changes in future)
export const getErrorDetail = (errorCode: ErrorCode): ErrorDetail =>
  ErrorDetails[errorCode];
