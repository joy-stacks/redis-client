<template>
  <a-tree-select v-model="value" :data="data">
    <template #label="{ data }">{{ label(data) }}</template>
  </a-tree-select>
</template>
<script lang="ts">
import { PropType, defineComponent, ref, watch } from "vue";
import cloneDeep from "lodash/cloneDeep";

import type { TreeNodeData } from "@arco-design/web-vue";

export default defineComponent({
  name: "JTreeSelect",
  props: {
    modelValue: [String, Number],
    parentable: Boolean,
    data: {
      type: Array as PropType<TreeNodeData[]>,
      default: [],
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const value = ref<string | number>();

    watch(
      () => props.modelValue,
      () => {
        emit("update:modelValue", props.modelValue);
      }
    );

    const createLabel = (data: TreeNodeData[], target: string | number) => {
      const result: string[] = [];

      const seek = (data: TreeNodeData[], target: string | number, result: string[]) => {
        const list = cloneDeep(data);
        for (let i = 0; i < list.length; i++) {
          const cur = list[i];
          if (cur.key === target) {
            result.push(cur.title || "");
            return true;
          }

          if (cur && cur.children && cur.children.length > 0) {
            const bool = seek(cur.children || [], target, result);
            if (bool) {
              result.push(cur.title || "");
              return true;
            }
          }
        }
        return false;
      };

      seek(data, target, result);
      return result.reverse().join(" / ");
    };

    const label = (data: { label: string; value: string | number }) => {
      if (props.parentable) {
        return createLabel(props.data, data.value);
      }

      return data.label;
    };

    return {
      value,
      label,
    };
  },
});
</script>
