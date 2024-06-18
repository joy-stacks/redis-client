/*
 * @Author: JOY
 * @Date: 2024-06-18 11:31:38
 * @LastEditors: JOY
 * @LastEditTime: 2024-06-18 11:31:47
 * @Description:
 */
/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare global {
  import "@arco-design/web-vue/es/components";
}

declare namespace Store {
  export interface AppState {
    imax: boolean;
  }
}
