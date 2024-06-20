/*
 * @Author: JOY
 * @Date: 2024-06-20 13:48:23
 * @LastEditors: JOY
 * @LastEditTime: 2024-06-20 14:24:40
 * @Description:
 */
import type { NestExpressApplication } from "@nestjs/platform-express";
import { setupPipe } from "./pipe/index.pipe";
import { setupInterceptor } from "./interceptor/index.interceptor";
import { setupFilters } from "./filters/index.filter";
import { logger } from "./logger.middleware";

export function setupMiddleware(app: NestExpressApplication) {
  logger(app);
  
  // 全局拦截器
  setupInterceptor(app);
  // 全局过滤器
  setupFilters(app);
  // 全局管道
  setupPipe(app);
}
