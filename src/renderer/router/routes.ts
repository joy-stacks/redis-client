/*
 * @Author: JOY
 * @Date: 2024-05-28 16:49:31
 * @LastEditors: JOY
 * @LastEditTime: 2024-06-18 13:29:51
 * @Description: 基础路由
 */
/**
 * 基础路由
 * @type { *[] }
 */
export default [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@renderer/layout/index.vue"),
  },
  {
    path: "/",
    name: "index",
    component: () => import("@renderer/layout/index.vue"),
  },
  /* {
        path: "/update",
        name: "update",
        component: () => import("@/views/other/update.vue"),
      },
      {
        path: "/:catchAll(.*)",
        hidden: true,
        component: () => import("@/views/error/404.vue"),
      }, */
];
