import { ResponseInterceptor, Response } from "./response.interceptor";
import type { NestExpressApplication } from "@nestjs/platform-express";

export type { Response };

export function setupInterceptor(app: NestExpressApplication) {
  app.useGlobalInterceptors(new ResponseInterceptor());
}
