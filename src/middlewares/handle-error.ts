import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppException } from '../exceptions/app.exception';
import { ErrorCode, ErrorDetails } from '../exceptions/error-code';
import { ResponseUtil } from '../utils/response.util';
import pino from 'pino';


export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Log error for debugging
  console.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
    body: req.body,
    params: req.params,
    query: req.query,
  });

  // Handle AppException
  if (err instanceof AppException) {
    return ResponseUtil.error(
      res,
      err.code,
      err.message,
      err.details,
      err.status,
    );
  }

  // Handle Prisma errors
  if (err.code) {
    switch (err.code) {
      case 'P2002': // Unique constraint violation
        return ResponseUtil.error(
          res,
          ErrorCode.CONFLICT,
          'Resource already exists',
        );
      case 'P2025': // Record not found
        return ResponseUtil.error(res, ErrorCode.NOT_FOUND, 'Record not found');
      case 'P2003': // Foreign key constraint violation
        return ResponseUtil.error(
          res,
          ErrorCode.BAD_REQUEST,
          'Invalid reference',
        );
      default:
        return ResponseUtil.error(
          res,
          ErrorCode.DATABASE_ERROR,
          'Database operation failed',
        );
    }
  }

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const validationErrors = err.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
      code: issue.code,
      value: (issue as any).received,
    }));

    return ResponseUtil.validationError(
      res,
      validationErrors,
      'Validation failed',
    );
  }

  // Handle validation errors (express-validator)
  if (err.name === 'ValidationError' || err.errors) {
    return ResponseUtil.validationError(res, err.errors || [err.message]);
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return ResponseUtil.error(res, ErrorCode.UNAUTHORIZED, 'Invalid token');
  }

  if (err.name === 'TokenExpiredError') {
    return ResponseUtil.error(res, ErrorCode.UNAUTHORIZED, 'Token expired');
  }

  // Handle unexpected errors
  return ResponseUtil.error(
    res,
    ErrorCode.INTERNAL_SERVER_ERROR,
    'An unexpected error occurred',
  );
};

// Async handler wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
