/*
 * @Author: JOY
 * @Date: 2024-06-18 09:35:54
 * @LastEditors: JOY
 * @LastEditTime: 2024-06-18 11:19:24
 * @Description:
 */
import { resolve } from "path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import vue from "@vitejs/plugin-vue";

import Components from "unplugin-vue-components/vite";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import { ArcoResolver } from "unplugin-vue-components/resolvers";
import { vitePluginForArco } from "@arco-plugins/vite-vue";

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {
    resolve: {
      alias: {
        "@renderer": resolve("src/renderer"),
      },
    },
    plugins: [
      vue(),
      createSvgIconsPlugin({
        //  指定需要缓存的图标文件夹
        iconDirs: [resolve(process.cwd(), "src/renderer/assets/icons")],
        // 指定symbolId格式
        symbolId: "icon-[name]",
      }),
      // 按需引入ArcoDesign且自动创建组件声明
      Components({
        dts: "components.d.ts",
        // directoryAsNamespace: true,
        resolvers: [
          ArcoResolver({
            resolveIcons: true,
            sideEffect: true,
          }),
        ],
      }),
      vitePluginForArco({
        style: "css",
      }),
    ],
  },
});
