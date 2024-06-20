/*
 * @Author: JOY
 * @Date: 2024-06-20 13:56:23
 * @LastEditors: JOY
 * @LastEditTime: 2024-06-20 13:56:31
 * @Description: 
 */
import { ExceptionFilter } from "./exception.filter";
import type { NestExpressApplication } from "@nestjs/platform-express";

export function setupFilters(app: NestExpressApplication) {
  app.useGlobalFilters(new ExceptionFilter());
}
