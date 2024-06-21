<!--
 * @Author: JOY
 * @Date: 2024-06-18 11:41:32
 * @LastEditors: JOY
 * @LastEditTime: 2024-06-21 16:01:40
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
      <a-layout-content
        class="rounded-tl-2xl bg-[rgb(247,250,255)]"
        style="box-shadow: 0px 0px 8px -4px rgba(130, 85, 255, 0.6) inset"
      >
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script lang="ts">
import { defineComponent } from "vue";

import JHeader from "./header.vue";
import JMenu from "./menu.vue";

export default defineComponent({
  components: {
    JHeader,
    JMenu,
  },
  setup() {
    return {};
  },
});
</script>
