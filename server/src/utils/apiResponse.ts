import { Response } from 'express';

export interface ApiResponsePayload<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: any;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    [key: string]: any;
  };
}

export class ApiResponse {
  static success<T>(
    res: Response,
    data?: T,
    message: string = 'Success',
    statusCode: number = 200,
    meta?: any
  ): Response {
    const payload: ApiResponsePayload<T> = {
      success: true,
      message,
      ...(data !== undefined && { data }),
      ...(meta !== undefined && { meta })
    };

    // If data is an object with direct fields and frontend might expect legacy keys,
    // we also spread data for backward compatibility while providing data
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      Object.assign(payload, data);
    }

    return res.status(statusCode).json(payload);
  }

  static created<T>(
    res: Response,
    data?: T,
    message: string = 'Resource created successfully',
    meta?: any
  ): Response {
    return this.success(res, data, message, 201, meta);
  }

  static error(
    res: Response,
    message: string = 'An error occurred',
    statusCode: number = 500,
    details?: any
  ): Response {
    const payload: ApiResponsePayload = {
      success: false,
      message,
      ...(details !== undefined && { error: details })
    };
    return res.status(statusCode).json(payload);
  }
}
