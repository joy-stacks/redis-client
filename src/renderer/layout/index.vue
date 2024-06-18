<!--
 * @Author: JOY
 * @Date: 2024-06-18 11:41:32
 * @LastEditors: JOY
 * @LastEditTime: 2024-06-18 17:11:04
 * @Description: 
-->
<template>
  <a-layout class="h-full">
    <a-layout-header>
      <JHeader type="main"></JHeader>
    </a-layout-header>
    <a-layout-content>
      <a-layout class="h-full">
        <a-layout-sider>
          <a-button type="primary">新增链接</a-button>
        </a-layout-sider>
        <a-layout-content class="h-full bg-[rgb(247,250,255)]">content</a-layout-content>
      </a-layout>
    </a-layout-content>
  </a-layout>
</template>
<script lang="ts">
import { defineComponent } from "vue";

import JHeader from "./header.vue";

export default defineComponent({
  components: {
    JHeader,
  },
  setup() {},
});
</script>
