import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { randomUUID } from 'node:crypto';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable()
export class RequestContextInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const incomingId = request.headers['x-request-id'];
    const requestId =
      typeof incomingId === 'string' && incomingId.length <= 128
        ? incomingId
        : randomUUID();

    request.headers['x-request-id'] = requestId;
    response.setHeader('x-request-id', requestId);
    const startedAt = Date.now();

    return next.handle().pipe(
      finalize(() => {
        this.logger.log(
          JSON.stringify({
            requestId,
            method: request.method,
            path: request.path,
            statusCode: response.statusCode,
            durationMs: Date.now() - startedAt,
          }),
        );
      }),
    );
  }
}
