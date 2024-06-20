<!--
 * @Author: JOY
 * @Date: 2024-06-18 11:41:32
 * @LastEditors: JOY
 * @LastEditTime: 2024-06-20 15:04:42
 * @Description: 
-->
<template>
  <a-layout class="h-full">
    <a-layout-header>
      <JHeader type="main"></JHeader>
    </a-layout-header>
    <a-layout>
      <a-layout-sider class="!shadow-none" :collapsed="true">
        <JMenu></JMenu>
      </a-layout-sider>
      <a-layout-sider
        class="h-full bg-white rounded-tl-2xl flex flex-col gap-1"
        style="box-shadow: 0px 0px 8px -4px rgba(130, 85, 255, 0.6) inset"
        :collapsed="false"
      >
        <!-- <a-tree class="flex-1" :show-line="false"> </a-tree> -->
        <div
          class="h-8 flex flex-row items-center justify-start gap-2 p-2 border-solid"
          style="box-shadow: 0px 0px 8px -4px rgba(130, 85, 255, 0.6)"
        >
          <a-tooltip content="添加连接" position="bottom">
            <span>
              <JIcon class="cursor-pointer" name="bolt" :width="16" :height="16"></JIcon>
            </span>
          </a-tooltip>
          <a-tooltip content="添加分组" position="bottom">
            <span @click="handleAddGroup">
              <JIcon class="cursor-pointer" name="folder" :width="16" :height="16"></JIcon>
            </span>
          </a-tooltip>
          <a-divider class="mx-1" direction="vertical" />
          <a-input class="flex-1" size="small" placeholder="过滤">
            <template #prefix>
              <icon-filter />
            </template>
          </a-input>
        </div>
        <div class="flex-1"></div>
      </a-layout-sider>
      <a-layout-content
        class="h-full bg-[rgb(247,250,255)] flex flex-col gap-1"
        style="box-shadow: 0px 0px 8px -4px rgba(130, 85, 255, 0.3) inset"
      >
        <JTag></JTag>
        <div
          class="flex-1 bg-white mt-[1px] ml-1"
          style="box-shadow: 0px 0px 4px -4px rgba(130, 85, 255, 0.3)"
        ></div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script lang="ts">
import { defineComponent, onMounted } from "vue";

import JIcon from "@renderer/components/svg-icon.vue";
import JHeader from "./header.vue";
import JMenu from "./menu.vue";
import JTag from "./tag.vue";

import axios from "axios";

export default defineComponent({
  components: {
    JIcon,
    JHeader,
    JMenu,
    JTag,
  },
  setup() {
    const handleAddGroup = async () => {
      const result = await axios.post("http://localhost:3000/v1/sys/group/add");
      console.log(result);
    };

    onMounted(() => {
      window.electron.ipcRenderer.on("load", (_, p: string) => {
        console.log(p);
      });
    });

    return {
      handleAddGroup,
    };
  },
});
</script>
