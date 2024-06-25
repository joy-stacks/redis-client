/*
 * @Author: JOY
 * @Date: 2024-06-25 10:08:09
 * @LastEditors: JOY
 * @LastEditTime: 2024-06-25 11:11:17
 * @Description:
 */
import Redis from "ioredis";

export interface RedisConfig {
  host: string;
  port: string;
  pwd: string;
  user: string;
}

export const createRedisClient = (config: RedisConfig): Redis | undefined => {
  let client: Redis | undefined = undefined;
  try {
    const option = {
      host: config.host,
      port: +config.port,
      db: 0,
    };

    if (config.pwd) {
      Object.assign(option, {
        password: config.pwd,
      });
    }

    if (config.user) {
      Object.assign(option, {
        username: config.user,
      });
    }
    console.log(option);
    client = new Redis(option);

    client.on("error", (err) => {
      // console.log(err);
    });
  } catch (error) {
    throw error;
  }
  return client;
};
