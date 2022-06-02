import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class QueryFailedExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const conflictError = exception.message.includes('unique constraint');
    const friendlyMessage = exception.driverError?.detail;
    const technicalMessage = exception.message;
    const showMessage = friendlyMessage || technicalMessage;
    const errorResponse = {
      message: `Query Failed Error: ${showMessage}`,
    };
    console.log(errorResponse);
  }
}
