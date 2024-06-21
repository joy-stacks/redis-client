/*
 * @Author: JOY
 * @Date: 2024-06-21 10:57:35
 * @LastEditors: JOY
 * @LastEditTime: 2024-06-21 16:41:06
 * @Description:
 */
import express from "express";
import fs from "node:fs";
import { ROOT_REDIS_CONF } from "./constants";
import { GroupDto } from "./dto";
import { success, fail } from "./utils";

import type { Link } from "./server.d";

const router = express.Router();

// 测试接口
router.get("/", (_, res) => {
  res.send({
    code: 1,
    msg: "",
    data: "测试",
  });
});

// 本地缓存REDIS的连接数据
let CacheRedis: Link[] = [];
// 新增分组
router.post("/sys/group/add", (req, res) => {
  const groupDto = req.body as GroupDto;
  // 获取组名称
  const groupName = groupDto.group_name;

  if (fs.existsSync(ROOT_REDIS_CONF)) {
    // 读取本地配置
    const read = fs.readFileSync(ROOT_REDIS_CONF, { encoding: "utf-8" });
    // 解析读取的数据
    const groups = (JSON.parse(read) || []) as Link[];
    // 判断数据是否存在
    const group = groups.find(
      (item) => item.pid === parseInt(groupDto.group_id) && item.name === groupName
    );
    if (group) return fail(1001, "当前组已存在", res);

    const ngroup: Link = {
      id: new Date().getTime(),
      pid: parseInt(groupDto.group_id),
      name: groupName,
      type: '1',
      host: "",
      user: "",
      pwd: "",
      port: "",
    };
    groups.push(ngroup);
    CacheRedis = groups;
  } else {
    const group: Link = {
      id: new Date().getTime(),
      pid: 0,
      name: groupName,
      type: '1',
      host: "",
      user: "",
      pwd: "",
      port: "",
    };
    const groups = [group];
    CacheRedis = groups;
  }
  // 写入的内容是JSON
  fs.writeFileSync(ROOT_REDIS_CONF, JSON.stringify(CacheRedis));
  return success(CacheRedis, res);
});

// 获取所有连接
router.get("/sys/links", (_, res) => {
  if (fs.existsSync(ROOT_REDIS_CONF)) {
    // 读取本地配置
    const read = fs.readFileSync(ROOT_REDIS_CONF, { encoding: "utf-8" });
    // 解析读取的数据
    const groups = (JSON.parse(read) || []) as Link[];
    CacheRedis = groups;
  }
  return success(CacheRedis, res);
});
export default router;
