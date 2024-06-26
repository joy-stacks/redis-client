/*
 * @Author: JOY
 * @Date: 2024-06-21 10:57:35
 * @LastEditors: JOY
 * @LastEditTime: 2024-06-27 10:55:31
 * @Description:
 */
import express from "express";
import fs from "node:fs";
import { ROOT_REDIS_CONF } from "./constants";
import {
  GroupAddDto,
  GroupEditDto,
  GroupDelDto,
  LinkAddDto,
  LinkTestDto,
  LinkDto,
  LinkCmdDto,
} from "./dto";
import { success, fail } from "./utils";
import splitargs from "redis-splitargs";

import type { Link } from "./server.d";
import { createRedisClient } from "./util";
import Redis from "ioredis";

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
// redis已连接的客户端
const clients: Map<string | number, Redis> = new Map();

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
      port: 0,
      ltype: "",
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
      port: 0,
      ltype: "",
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

// 新增连接
router.post("/sys/link/add", (req, res) => {
  const addDto = req.body as LinkAddDto;
  // 读取文件
  if (fs.existsSync(ROOT_REDIS_CONF)) {
    // 读取本地配置
    const read = fs.readFileSync(ROOT_REDIS_CONF, { encoding: "utf-8" });
    // 解析读取的数据
    const groups = (JSON.parse(read) || []) as Link[];
    // 判断数据是否存在
    const group = groups.find(
      (item) => item.pid === parseInt(addDto.gid) && item.name === addDto.name
    );
    if (group) return fail(1003, "当前连接已存在", res);

    const ngroup: Link = {
      id: new Date().getTime(),
      pid: parseInt(addDto.gid),
      name: addDto.name,
      type: "2",
      host: addDto.host,
      user: addDto.user,
      pwd: addDto.pwd,
      port: +addDto.port,
      ltype: addDto.type,
    };
    groups.push(ngroup);
    CacheRedis = groups;
  } else {
    const group: Link = {
      id: new Date().getTime(),
      pid: 0,
      name: addDto.name,
      type: "2",
      host: addDto.host,
      user: addDto.user,
      pwd: addDto.pwd,
      port: +addDto.port,
      ltype: addDto.type,
    };
    const groups = [group];
    CacheRedis = groups;
  }
  // 写入的内容是JSON
  fs.writeFileSync(ROOT_REDIS_CONF, JSON.stringify(CacheRedis));
  return success(CacheRedis, res);
});

// 测试连接
router.post("/sys/link/test", async (req, res) => {
  try {
    const linkDto = req.body as LinkTestDto;

    const client = createRedisClient({
      host: linkDto.host,
      port: linkDto.port,
      pwd: linkDto.pwd,
      user: linkDto.user,
    });
    await client?.ping();
    // ping成功后，关闭连接
    client?.disconnect(false);
    return success("", res);
  } catch (error: any) {
    return fail(1004, error.message, res);
  }
});

// 创建连接
router.post("/sys/link", async (req, res) => {
  try {
    const linkDto = req.body as LinkDto;

    const isExist = clients.has(linkDto.id);
    if (!isExist) {
      // 获取当前连接的信息
      const ob = CacheRedis.find((item) => item.id === +linkDto.id && item.type === "2");
      if (ob) {
        const client = createRedisClient({
          host: ob.host,
          port: ob.port + "",
          pwd: ob.pwd,
          user: ob.user,
        });
        client && clients.set(linkDto.id, client);
      }
    }

    return success(linkDto.id, res);
  } catch (error: any) {
    return fail(1005, error.message, res);
  }
});

// 命令行查询
router.post("/sys/link/cmd", async (req, res) => {
  let final = "";
  try {
    const linkDto = req.body as LinkCmdDto;
    // 获取当前的客户端
    const client = clients.get(linkDto.id);
    if (client) {
      // 解析命令
      const commands = splitargs(linkDto.command);
      if (!client[commands[0]]) throw new Error("Invalid command");

      const result = await client[commands[0]](...commands.slice(1));
      // 判断的返回数据类型
      if (!result) {
        final = "ok";
      } else if (Array.isArray(result)) {
        result.forEach((item, i) => {
          final += `${i})${item}\r\n`;
        });
      } else {
        final = result;
      }
    }

    return success(final, res);
  } catch (error: any) {
    return success(error.message, res);
  }
});

// 获取所有数据库的键
router.get("/sys/link/keys", async (req, res) => {
  const final: { db: string; keys: { key: string; type: string }[] }[] = [];
  try {
    const id = req.query.id as string;
    // 获取当前的客户端
    const client = clients.get(id);
    if (client) {
      for (let i = 0; i <= 15; i++) {
        const ob = {
          db: i + "",
          keys: [] as { key: string; type: string }[],
        };
        await client.select(i);
        const keys = await client.keys("*");
        // 获取每一个键的类型
        for (let j = 0; j < keys.length; j++) {
          const key = keys[j];
          const type = await client.type(key);
          ob.keys.push({
            key,
            type,
          });
        }
        final.push(ob);
      }
    }
    return success(final, res);
  } catch (error: any) {
    return fail(1006, error.message, res);
  }
});
export default router;
