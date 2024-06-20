/*
 * @Author: JOY
 * @Date: 2024-05-22 17:10:26
 * @LastEditors: JOY
 * @LastEditTime: 2024-06-06 16:40:24
 * @Description: 异常过滤器
 */
import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  ExceptionFilter as NestExceptionFilter,
} from "@nestjs/common";
import { Response } from "express";
import { ResponseStatus, fail } from "../../utils";

export type ErrorResponse = {
  code: ResponseStatus;
  desc: string;
} & {
  statusCode: ResponseStatus;
  message: string;
};

// 自定义异常错误
export class CustomHttpException extends HttpException {
  constructor(code: ResponseStatus, desc?: string) {
    super({ code, desc }, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

@Catch(HttpException)
export class ExceptionFilter implements NestExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // 错误写入日志
    const error = exception.getResponse() as unknown as ErrorResponse;
    const code = error.code || error.statusCode;
    const desc = error.desc || error.message;
    response.status(200).json(fail(code, desc));
  }
}
