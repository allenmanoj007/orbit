import { Response } from 'express';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: unknown;
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export function success<T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200
): Response {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  } as ApiResponse<T>);
}

export function created<T>(
  res: Response,
  data: T,
  message = 'Created'
): Response {
  return success(res, data, message, 201);
}

export function error(
  res: Response,
  message = 'Internal server error',
  statusCode = 500,
  errors?: unknown
): Response {
  const body: ApiResponse = {
    success: false,
    message,
  };
  if (errors !== undefined) {
    body.errors = errors;
  }
  return res.status(statusCode).json(body);
}

export function paginated<T>(
  res: Response,
  data: T[],
  page: number,
  limit: number,
  total: number,
  message = 'Success'
): Response {
  const totalPages = Math.ceil(total / limit);
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  } as ApiResponse<T[]>);
}
