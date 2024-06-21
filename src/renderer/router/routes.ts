/*
 * @Author: JOY
 * @Date: 2024-05-28 16:49:31
 * @LastEditors: JOY
 * @LastEditTime: 2024-06-21 16:05:16
 * @Description: 基础路由
 */
/**
 * 基础路由
 * @type { *[] }
 */
export default [
  {
    path: "/",
    name: "index",
    component: () => import("@renderer/layout/index.vue"),
    redirect: "/server",
    children: [
      {
        path: "/server",
        name: "server",
        component: () => import("@renderer/views/server.vue"),
      },
    ],
  },
  /*
      {
        path: "/:catchAll(.*)",
        hidden: true,
        component: () => import("@/views/error/404.vue"),
      }, */
];
