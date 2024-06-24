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
      cache: {
        links: [],
      },
    };
  },
  getters: {
    async link(): Promise<Store.Link[]> {
      // 判断是否存在值，如果不存在则请求获取
      if (this.cache.links.length <= 0) {
        const result = await getLinks<Store.Link[]>();
        const data = result?.data || [];
        // 生成树形数据
        this.cache.links = data;
        return data;
      }
      return this.cache.links;
    },
  },
  actions: {
    setLinks(links: Store.Link[]) {
      this.cache.links = links;
    },
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
