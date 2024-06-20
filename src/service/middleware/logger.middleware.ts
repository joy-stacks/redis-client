/*
 * @Author: JOY
 * @Date: 2024-06-06 14:54:29
 * @LastEditors: JOY
 * @LastEditTime: 2024-06-20 14:20:39
 * @Description: 
 */
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";

import type { NestExpressApplication } from "@nestjs/platform-express";

export function logger(app: NestExpressApplication) {
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
}
