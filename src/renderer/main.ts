/*
 * @Author: JOY
 * @Date: 2024-06-18 09:28:27
 * @LastEditors: JOY
 * @LastEditTime: 2024-06-18 16:34:02
 * @Description:
 */
import { createApp } from "vue";

import App from "./App.vue";
// Plugin
import router, { setupRouter } from "./router";
import { setupStore } from "./store";
/* import {
  setupUIPlugin,
  setupDirectives,
  setupGlobal,
  asyncConfig,
} from "./plugins"; */
import { setupUIPlugin } from "./plugins";

// 注入svg脚本
import "virtual:svg-icons-register";

async function bootstrap() {
  // 创建app实例
  const app = createApp(App);

  // 挂载UI组件
  setupUIPlugin(app);

  // 挂载自定义指令
  // setupDirectives(app);

  // 挂载Store（状态管理）
  setupStore(app);

  // 挂载路由
  setupRouter(app);

  // 全局挂载属性
  // setupGlobal(app, config);

  // 路由准备就绪后挂载 APP 实例
  await router.isReady();

  // 挂载页面
  app.mount("#app", true);
}

bootstrap();
