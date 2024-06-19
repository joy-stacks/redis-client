/*
 * @Author: JOY
 * @Date: 2024-06-19 10:05:43
 * @LastEditors: JOY
 * @LastEditTime: 2024-06-19 11:23:19
 * @Description:
 */
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

import type { NestExpressApplication } from "@nestjs/platform-express";

export default async function start() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  await app.listen(3000);
}
