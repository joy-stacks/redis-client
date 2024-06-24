/*
 * @Author: JOY
 * @Date: 2024-06-21 10:57:35
 * @LastEditors: JOY
 * @LastEditTime: 2024-06-24 15:20:11
 * @Description:
 */
import express from "express";
import fs from "node:fs";
import { ROOT_REDIS_CONF } from "./constants";
import { GroupAddDto, GroupEditDto, GroupDelDto } from "./dto";
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
  const groupDto = req.body as GroupAddDto;
  // 获取组名称
  const groupName = groupDto.group_name;

  if (fs.existsSync(ROOT_REDIS_CONF)) {
    // 读取本地配置
    const read = fs.readFileSync(ROOT_REDIS_CONF, { encoding: "utf-8" });
    // 解析读取的数据
    const groups = (JSON.parse(read) || []) as Link[];
    // 判断数据是否存在
    const group = groups.find(
      (item) => item.pid === parseInt(groupDto.group_pid) && item.name === groupName
    );
    if (group) return fail(1001, "当前组已存在", res);

    const ngroup: Link = {
      id: new Date().getTime(),
      pid: parseInt(groupDto.group_pid),
      name: groupName,
      type: "1",
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
      type: "1",
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

// 修改分组
router.post("/sys/group/edit", (req, res) => {
  const groupDto = req.body as GroupEditDto;
  // 读取文件
  if (fs.existsSync(ROOT_REDIS_CONF)) {
    // 读取本地配置
    const read = fs.readFileSync(ROOT_REDIS_CONF, { encoding: "utf-8" });
    // 解析读取的数据
    const groups = (JSON.parse(read) || []) as Link[];
    // 判断数据是否存在
    const group = groups.find((item) => item.id === parseInt(groupDto.group_id));
    if (!group) return fail(1002, "当前组不存在", res);

    // 当前组名是否存在
    const nameGroup = groups.find(
      (item) => item.pid === parseInt(groupDto.group_pid) && item.name === groupDto.group_name
    );
    if (nameGroup) return fail(1001, "当前组已存在", res);

    group.pid = +groupDto.group_pid;
    group.name = groupDto.group_name;

    CacheRedis = groups;
  }
  // 写入的内容是JSON
  fs.writeFileSync(ROOT_REDIS_CONF, JSON.stringify(CacheRedis));
  return success(CacheRedis, res);
});

// 删除分组
router.delete("/sys/group/del", (req, res) => {
  const groupDto = req.body as GroupDelDto;
  // 读取文件
  if (fs.existsSync(ROOT_REDIS_CONF)) {
    // 读取本地配置
    const read = fs.readFileSync(ROOT_REDIS_CONF, { encoding: "utf-8" });
    // 解析读取的数据
    const groups = (JSON.parse(read) || []) as Link[];
    // 判断数据是否存在
    const index = groups.findIndex((item) => item.id === parseInt(groupDto.group_id));
    if (index < 0) return fail(1002, "当前组不存在", res);
    // 注意，删除组的时候，如果改组存在子组也需要进行删除
    CacheRedis = groups.filter(
      (item) => item.id !== parseInt(groupDto.group_id) && item.pid !== parseInt(groupDto.group_id)
    );
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
