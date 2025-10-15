import { Response } from 'express';
import { SuccessResponse, ErrorResponse, PaginatedResponse } from './response.type';
import { ErrorCode, ErrorDetails } from '../exceptions/error-code';
import { PaginatedResult } from '../dtos/pagination';

export class ResponseUtil {
  // Success Response
  static success<T>(
    res: Response,
    data: T,
    message?: string,
    statusCode: number = 200,
  ): Response<SuccessResponse<T>> {
    const response: SuccessResponse<T> = {
      success: true,
      data,
      timestamp: new Date().toISOString(),
      path: res.req?.path,
    };

    if (message) {
      response.message = message;
    }

    return res.status(statusCode).json(response);
  }

  // Created Response
  static created<T>(
    res: Response,
    data: T,
    message: string = 'Resource created successfully',
  ): Response<SuccessResponse<T>> {
    return this.success(res, data, message, 201);
  }

  // No Content Response
  static noContent(res: Response): Response {
    return res.status(204).send();
  }

  // Paginated Response
  static paginated<T>(
    res: Response,
    paginatedData: PaginatedResult<T>,
    message?: string,
  ): Response<PaginatedResponse<T>> {
    const response: PaginatedResponse<T> = {
      success: true,
      data: paginatedData.data,
      timestamp: new Date().toISOString(),
      path: res.req?.path,
      meta: {
        total: paginatedData.total,
        page: paginatedData.page,
        limit: paginatedData.limit,
        totalPages: paginatedData.totalPages,
        hasNext: paginatedData.page < paginatedData.totalPages,
        hasPrev: paginatedData.page > 1,
      },
    };

    if (message) {
      response.message = message;
    }

    return res.status(200).json(response);
  }

  // Error Response
  static error(
    res: Response,
    errorCode: ErrorCode,
    message?: string,
    details?: any,
    statusCode?: number,
  ): Response<ErrorResponse> {
    const errorDetails = ErrorDetails[errorCode];

    const response: ErrorResponse = {
      success: false,
      timestamp: new Date().toISOString(),
      path: res.req?.path,
      error: {
        code: errorCode,
        message: message || errorDetails.message,
        details,
      },
    };

    return res.status(statusCode || errorDetails.statusCode).json(response);
  }

  // Validation Error Response
  static validationError(
    res: Response,
    errors: any[],
    message: string = 'Validation failed',
  ): Response<ErrorResponse> {
    const response: ErrorResponse = {
      success: false,
      timestamp: new Date().toISOString(),
      path: res.req?.path,
      error: {
        code: ErrorCode.VALIDATION_ERROR,
        message,
        details: errors,
      },
    };

    return res.status(422).json(response);
  }
}
