/*
 * @Author: JOY
 * @Date: 2024-06-19 10:05:43
 * @LastEditors: JOY
 * @LastEditTime: 2024-06-20 16:03:01
 * @Description:
 */
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

import type { NestExpressApplication } from "@nestjs/platform-express";
import { VersioningType } from "@nestjs/common";
import { setupMiddleware } from "./middleware/index.middleware";

export default async function start() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
    bufferLogs: true,
  });

  // 版本控制
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // 使用中间件
  setupMiddleware(app);
  
  await app.listen(3000);
}

start()
