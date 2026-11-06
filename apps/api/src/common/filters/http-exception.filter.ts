import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { randomUUID } from 'crypto';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const requestId = (request.headers['x-request-id'] as string) || randomUUID();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'INTERNAL_SERVER_ERROR';
    let message = 'Đã có lỗi xảy ra từ hệ thống. Vui lòng thử lại sau.';
    let details: unknown[] = [];

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        const r = res as Record<string, unknown>;
        code = (r.code as string) || (statusCode === 409 ? 'CONFLICT' : 'HTTP_ERROR');
        message = (r.message as string) || message;
        if (Array.isArray(r.message)) {
          details = r.message;
          message = 'Dữ liệu không hợp lệ';
          code = 'VALIDATION_ERROR';
        } else if (r.details && Array.isArray(r.details)) {
          details = r.details;
        }
      }
    } else {
      // Unhandled error - log securely without PII
      this.logger.error(`Unhandled Exception [${requestId}]: ${exception instanceof Error ? exception.message : 'Unknown error'}`);
    }

    response.status(statusCode).json({
      statusCode,
      code,
      message,
      details,
      requestId,
    });
  }
}
