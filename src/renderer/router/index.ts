/*
 * @Author: JOY
 * @Date: 2024-05-28 16:45:02
 * @LastEditors: JOY
 * @LastEditTime: 2024-06-18 11:40:55
 * @Description:
 */
import { App } from "vue";
import { createRouter, createWebHistory } from "vue-router";

// 导入基础路由
import routes from "./routes";

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

router.beforeEach(async (to, _, next) => {
  return next();
});

export function setupRouter(app: App<Element>) {
  app.use(router);
}

export default router;
