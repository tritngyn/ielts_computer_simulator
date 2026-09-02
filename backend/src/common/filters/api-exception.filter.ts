import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';

interface NestErrorResponse {
  message?: string | string[];
  error?: string;
}

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const raw =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';
    const normalized = this.normalize(raw, status);
    const requestId = request.headers['x-request-id'];

    response.status(status).json({
      error: {
        code: normalized.code,
        message: normalized.message,
        ...(normalized.details.length > 0
          ? { details: normalized.details }
          : {}),
        requestId: typeof requestId === 'string' ? requestId : 'unknown',
      },
    });
  }

  private normalize(raw: string | object, status: number) {
    if (typeof raw === 'string') {
      return {
        code: this.codeFor(status),
        message: raw,
        details: [] as string[],
      };
    }

    const payload = raw as NestErrorResponse;
    const messages = Array.isArray(payload.message)
      ? payload.message
      : payload.message
        ? [payload.message]
        : [];

    return {
      code: this.codeFor(status),
      message:
        status === 400
          ? 'Invalid request'
          : messages[0] || payload.error || 'Request failed',
      details: status === 400 ? messages : [],
    };
  }

  private codeFor(status: number): string {
    const codes: Record<number, string> = {
      400: 'VALIDATION_ERROR',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      429: 'RATE_LIMITED',
    };
    return codes[status] ?? 'INTERNAL_ERROR';
  }
}
