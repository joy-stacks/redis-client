/*
 * @Author: JOY
 * @Date: 2024-05-28 14:50:57
 * @LastEditors: JOY
 * @LastEditTime: 2024-06-18 16:29:25
 * @Description: 应用仓库
 */
import { defineStore } from "pinia";
// 导入 store
import { store } from "@renderer/store";

export const useAppStore = defineStore("AppStore", {
  state: (): Store.AppState => {
    return {
      imax: false,
    };
  },
  getters: {
    gimax: (state) => state.imax,
  },
  actions: {
    setMax(bool: boolean) {
      this.imax = bool;
    },
  },
});

export function useAppStoreWithout() {
  return useAppStore(store);
}
