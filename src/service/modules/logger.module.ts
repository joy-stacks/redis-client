/*
 * @Author: JOY
 * @Date: 2024-05-08 16:11:11
 * @LastEditors: JOY
 * @LastEditTime: 2024-06-20 14:21:19
 * @Description:
 */
import { Module } from "@nestjs/common";
import { utilities, WinstonModule } from "nest-winston";

import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

@Module({
  imports: [
    WinstonModule.forRootAsync({
      useFactory() {
        return {
          transports: [
            new winston.transports.Console(),
            new DailyRotateFile({
              level: "error",
              dirname: "logs",
              filename: "error_%DATE%.log",
              datePattern: "YYYYMMDD",
              zippedArchive: true,
              maxSize: `3m`,
              maxFiles: `3d`, // keep only logs of last 24 hours
            }),
            new DailyRotateFile({
              level: "info",
              dirname: "logs",
              filename: "info_%DATE%.log",
              datePattern: "YYYYMMDD",
              zippedArchive: true,
              maxSize: '3m',
              maxFiles: '3d', // keep only logs of last 24 hours
              format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.simple(),
              ),
            }),
          ],
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.simple(),
            utilities.format.nestLike("Nest", {
              colors: true,
              prettyPrint: true,
            }),
          ),
        };
      },
      inject: [],
    }),
  ],
})
export class LoggerModule {}
