/*
 * @Author: JOY
 * @Date: 2024-06-20 13:35:21
 * @LastEditors: JOY
 * @LastEditTime: 2024-06-21 08:18:38
 * @Description:
 */
import { Body, Controller, Logger, Post } from "@nestjs/common";
import { SysService } from "../services/sys.service";
import { CustomHttpException } from "../middleware/filters/exception.filter";
import { ResponseStatus } from "../utils";

import fs from "node:fs";
import { ROOT_CONF } from "../constants/app.constant";
import { GroupAddDto } from "../entitys/dto/sys.dto";

interface Group {
  id: number;
  pid: number;
  group: string;
  link?: {
    host: string;
    port: string;
  };
}

// 本地缓存REDIS的连接数据
let CacheRedis: Group[] = [];

@Controller({
  path: "sys",
  version: "1",
})
export class SysController {
  constructor(private readonly service: SysService, private logger: Logger) {}

  createGroup(name: string) {
    const group: Group = {
      id: new Date().getTime(),
      pid: -1,
      group: name,
    };
    CacheRedis.push(group);
    return group;
  }

  @Post("/group/add")
  groupAdd(@Body() groupAddDto: GroupAddDto) {
    try {
      console.log(this.service)
      // 获取组名称
      const groupName = groupAddDto.group_name;
      if (!groupName) throw ResponseStatus.GroupNameIsNotEmpty;
      console.log(groupAddDto)
      if (fs.existsSync(ROOT_CONF)) {
        // 读取本地配置
        const read = fs.readFileSync(ROOT_CONF, { encoding: "utf-8" });
        if (read && read !== "") {
          // 解析读取的数据
          const groups = (JSON.parse(read) || []) as Group[];
          CacheRedis = groups;
          console.log(groups);
          // 判断数据是否存在
          const group = groups.find(
            (item) => item.pid === groupAddDto.group_id && item.group === groupName
          );
          console.log(group);
          if (group) throw ResponseStatus.GroupNameIsExist;

          const ngroup = this.createGroup(groupName);
          groups.push(ngroup);
          // 写入的内容是JSON
          fs.writeFileSync(ROOT_CONF, JSON.stringify(groups));
        } else {
          const group = this.createGroup(groupName);
          const groups = [group];
          // 写入的内容是JSON
          fs.writeFileSync(ROOT_CONF, JSON.stringify(groups));
        }
      } else {
        const group = this.createGroup(groupName);
        const groups = [group];
        // 写入的内容是JSON
        fs.writeFileSync(ROOT_CONF, JSON.stringify(groups));
      }

      return CacheRedis;
    } catch (error) {
      console.error(error);
      if (typeof error === "number") {
        throw new CustomHttpException(error);
      } else {
        throw new CustomHttpException(ResponseStatus.InternalError);
      }
    }
  }
}
