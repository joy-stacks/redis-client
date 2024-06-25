<!--
 * @Author: JOY
 * @Date: 2024-06-25 15:53:10
 * @LastEditors: JOY
 * @LastEditTime: 2024-06-25 16:53:58
 * @Description: 
-->
<template>
  <div
    class="absolute z-10 m-0 p-0 box-border text-sm text-[rgba(0,0,0,0.85)]"
    v-show="visible"
    :style="{ top: top + 'px', left: left + 'px' }"
  >
    <div class="menu-shadow" @click="handleClick">
      <slot></slot>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, reactive, toRefs, watch } from "vue";

export default defineComponent({
  props: {
    visible: Boolean,
    left: Number,
    top: Number,
    current: Number,
  },
  emits: ["click"],
  setup(props, { emit }) {
    const state = reactive({
      visible: props.visible,
      left: 0,
      top: 0,
      current: -1,
    });

    watch(
      () => [props.visible, props.left, props.top, props.current],
      ([v, l, t, c]) => {
        if (v) {
          state.visible = v as boolean;
          state.left = (l ?? 0) as number;
          state.top = (t ?? 0) as number;
          state.current = (c ?? -1) as number;
        }
      }
    );

    const handleClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const target = e.target || e.srcElement;
      
      if (!target) return;
      if (target instanceof HTMLElement) {
        const key = target.dataset.key || "";
        emit("click", key);
      }
    };

    // 关闭右键菜单
    const handleCloseConextMenu = () => {
      state.visible = false;
    };

    onMounted(() => {
      document.body.addEventListener("click", handleCloseConextMenu);
    });

    // 页面卸载
    onBeforeUnmount(() => {
      document.body.removeEventListener("click", handleCloseConextMenu);
    });

    return {
      ...toRefs(state),
      handleClick,
    };
  },
});
</script>
<style lang="less">
.menu-shadow {
  box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08),
    0 9px 28px 8px rgba(0, 0, 0, 0.05);

  @apply bg-clip-padding bg-white dark:bg-[#313131] rounded list-none m-0 outline-none py-1 relative text-left;

  & > div {
    @apply flex items-center relative clear-both cursor-pointer transition py-1 px-3 text-sm hover:bg-[#f5f5f5] dark:hover:bg-[rgba(255,255,255,0.08)] text-[rgba(0,0,0,0.85)] dark:text-[rgba(255,255,255,0.85)];
  }
}
</style>
