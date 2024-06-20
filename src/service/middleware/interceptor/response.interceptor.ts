/*
 * @Author: JOY
 * @Date: 2024-05-22 15:48:30
 * @LastEditors: JOY
 * @LastEditTime: 2024-06-20 13:55:43
 * @Description: 响应拦截器
 */
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, map } from "rxjs";
import { success } from "../../utils";

export interface Response<T> {
  code: number;
  data: T | null;
  msg: string;
  desc: string | Array<{ field: string; error: string }>;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(_: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        return success(data);
      })
    );
  }
}
