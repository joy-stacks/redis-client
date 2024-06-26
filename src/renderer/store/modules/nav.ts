/*
 * @Author: JOY
 * @Date: 2024-06-26 10:08:40
 * @LastEditors: JOY
 * @LastEditTime: 2024-06-26 16:12:10
 * @Description:
 */
import { defineStore } from "pinia";
// 导入 store
import { store } from "@renderer/store";
import { postLink } from "@renderer/api";

export const useNavStore = defineStore("NavStore", {
  state: (): Store.NavState => {
    return {
      nav: {
        tags: [],
        active: -1,
      },
    };
  },
  getters: {
    /* async link(): Promise<Store.Link[]> {
      // 判断是否存在值，如果不存在则请求获取
      if (this.cache.links.length <= 0) {
        const result = await getLinks<Store.Link[]>();
        const data = result?.data || [];
        // 生成树形数据
        this.cache.links = data;
        return data;
      }
      return this.cache.links;
    }, */
  },
  actions: {
    setTag(tag: Store.Tag) {
      // 判断当前是否已经打开
      if (!this.nav.tags.includes(tag)) {
        this.nav.tags.push(tag);
      }

      // 连接redis
      postLink({
        id: tag.id + "",
      });

      this.nav.active = tag.id;
    },
    /* setLinks(links: Store.Link[]) {
      this.cache.links = links;
    }, */
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: "nav",
        storage: sessionStorage,
        paths: ["navs", "active"],
      },
    ],
  },
});

export function useNavStoreWithout() {
  return useNavStore(store);
}
