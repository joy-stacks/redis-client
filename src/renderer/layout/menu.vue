<!--
 * @Author: JOY
 * @Date: 2024-06-19 13:55:02
 * @LastEditors: JOY
 * @LastEditTime: 2024-06-19 17:14:09
 * @Description: 
-->
<template>
  <ul class="h-full mt-2 flex flex-col items-center justify-start gap-4">
    <!-- <li class="menu-item">
      <JIcon name="bolt" :width="26" :height="26"></JIcon>
    </li> -->
    <li class="menu-item">
      <JIcon name="service" :width="26" :height="26"></JIcon>
    </li>
  </ul>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import JIcon from "@renderer/components/svg-icon.vue";

export default defineComponent({
  components: {
    JIcon,
  },
  setup() {},
});
</script>
<style lang="less" scoped>
.menu-item {
  @apply flex items-center justify-center cursor-pointer relative w-full;

  &:nth-child(1) {
    &::after {
      content: "";
      background-color: #8255ff;
      width: 3px;
      @apply absolute left-0 top-0 h-full;
    }
  }
}
</style>
