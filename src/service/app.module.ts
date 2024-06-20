/*
 * @Author: JOY
 * @Date: 2024-06-19 11:22:28
 * @LastEditors: JOY
 * @LastEditTime: 2024-06-20 14:22:12
 * @Description: 
 */
import { Module } from "@nestjs/common";
import { SysModule } from "./modules/sys.module";
import { LoggerModule } from "./modules/logger.module";

@Module({
  imports: [SysModule, LoggerModule],
})
export class AppModule {}
