/*
 * @Author: JOY
 * @Date: 2024-06-18 11:31:38
 * @LastEditors: JOY
 * @LastEditTime: 2024-06-26 10:59:21
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

  export interface Link {
    id: number;
    pid: number;
    name: string;
    type: string;
    host: string;
    user: string;
    pwd: string;
    port: string;
    isconnect: boolean;
  }

  export interface RedisState {
    cache: {
      links: Link[];
    };
  }

  export interface Tag {
    name: string;
    id: number;
    pid: number;
    type: number;
  }

  export interface NavState {
    nav: {
      tags: Tag[];
      active: number | string;
    };
  }
}
