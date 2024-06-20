/*
 * @Author: JOY
 * @Date: 2024-06-20 13:41:58
 * @LastEditors: JOY
 * @LastEditTime: 2024-06-20 15:42:38
 * @Description:
 */
import { Injectable, Logger } from "@nestjs/common";
import { ResponseStatus } from "../utils";

import path from "node:path";
import fs from "node:fs";

@Injectable()
export class SysService {
  constructor(private logger: Logger) {}

  /**
   * 创建分组
   * @returns
   */
  async groupAdd(): Promise<string> {
    try {
      const pa = path.join(process.cwd(), "redis-conf");
      console.log(pa);
      fs.writeFileSync(pa, "123");
      this.logger.error(pa);
      return pa;
    } catch (error) {
      // 错误写入日志
      this.logger.error(error);
      throw ResponseStatus.GetRsaKeyFailed;
    }
  }
}
