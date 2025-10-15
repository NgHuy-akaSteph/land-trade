import { ErrorCode } from '../exceptions/error-code';

// Base Response Interface
interface BaseResponse {
  success: boolean;
  timestamp: string;
  path?: string;
}

// Success Response
export interface SuccessResponse<T = any> extends BaseResponse {
  success: true;
  data: T;
  message?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
}

// Error Response
export interface ErrorResponse extends BaseResponse {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
    details?: any;
    field?: string;
  };
}

// Paginated Response
export interface PaginatedResponse<T> extends SuccessResponse<T[]> {
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
