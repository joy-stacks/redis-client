/*
 * @Author: JOY
 * @Date: 2024-06-06 16:11:21
 * @LastEditors: JOY
 * @LastEditTime: 2024-06-20 13:50:31
 * @Description: 全局管道
 */
import { ValidatePipe } from "./validate.pipe";

import type { NestExpressApplication } from "@nestjs/platform-express";

export function setupPipe(app: NestExpressApplication) {
  app.useGlobalPipes(new ValidatePipe());
}
