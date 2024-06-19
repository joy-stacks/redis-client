<!--
 * @Author: JOY
 * @Date: 2024-06-18 10:59:55
 * @LastEditors: JOY
 * @LastEditTime: 2024-06-19 14:39:11
 * @Description: 
-->
<template>
  <div class="cursor-move" style="-webkit-app-region: drag">
    <ul class="flex flex-row items-center justify-center">
      <li class="flex-1"></li>
      <li class="toolbar" @click="() => handleClick('min')">
        <icon-minus />
      </li>
      <li class="toolbar" @click.stop="() => handleClick('max')">
        <JIcon name="max" v-if="!imax"></JIcon>
        <JIcon name="zoom" :height="12" :width="12" v-else></JIcon>
      </li>
      <li class="toolbar" @click.stop="() => handleClick('close')">
        <icon-close />
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import { PropType, computed, defineComponent } from "vue";

import JIcon from "@renderer/components/svg-icon.vue";
import { onMounted } from "vue";
import { useAppStore } from "@renderer/store/modules/app";

export default defineComponent({
  components: {
    JIcon,
  },
  props: {
    toolbar: {
      type: Array as PropType<Array<"min" | "max" | "close">>,
      validatar: (v: string[]) => {
        return v.every((item) => ["min", "max", "close"].includes(item));
      },
      default: ["min", "max", "close"],
    },
    type: {
      required: true,
      type: String,
    },
  },
  setup(props) {
    const appStore = useAppStore();

    const imax = computed(() => appStore.gimax);

    const handleClick = (type: string) => {
      switch (type) {
        case "min":
          window.electron.ipcRenderer.send("app:min", props.type);
          break;
        case "max":
          window.electron.ipcRenderer.send("app:max", props.type);
          break;
        case "close":
          window.electron.ipcRenderer.send("app:close", props.type);
          break;
      }
    };

    onMounted(() => {
      window.electron.ipcRenderer.on("app:is:max", (_, bool: boolean) => {
        appStore.setMax(bool);
      });
    });

    return {
      imax,
      handleClick,
    };
  },
});
</script>
<style lang="less">
.toolbar {
  -webkit-app-region: no-drag;
  @apply w-10 h-8 flex flex-row justify-center items-center cursor-pointer;
}
</style>
