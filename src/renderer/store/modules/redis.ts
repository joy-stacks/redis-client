/*
 * @Author: JOY
 * @Date: 2024-05-28 14:50:57
 * @LastEditors: JOY
 * @LastEditTime: 2024-06-21 16:46:13
 * @Description: 应用仓库
 */
import { defineStore } from "pinia";
// 导入 store
import { store } from "@renderer/store";
import { getLinks } from "@renderer/api";

export const useRedisStore = defineStore("RedisStore", {
  state: (): Store.RedisState => {
    return {
      links: [],
    };
  },
  getters: {
    async link(): Promise<Store.Link[]> {
      // 判断是否存在值，如果不存在则请求获取
      if (this.links.length <= 0) {
        const result = await getLinks<Store.Link[]>();
        const data = result?.data || [];
        // 生成树形数据
        this.links = data;
        return data;
      }
      return this.links;
    },
  },
  actions: {
    /* setMax(bool: boolean) {
      this.imax = bool;
    }, */
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: "redis",
        storage: sessionStorage,
        paths: ["links"],
      },
    ],
  },
});

export function useRedisStoreWithout() {
  return useRedisStore(store);
}
