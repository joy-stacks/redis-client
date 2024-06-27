<!--
 * @Author: JOY
 * @Date: 2024-06-27 16:19:18
 * @LastEditors: JOY
 * @LastEditTime: 2024-06-27 16:55:09
 * @Description: 
-->
<template>
  <a-row>
    <a-tree
      ref="treeref"
      v-model:expanded-keys="expandedKeys"
      v-model:selected-keys="selectedKeys"
      :default-expanded-keys="defaultExpandedKeys"
      :data="trees"
      :show-line="false"
      :draggable="draggable"
      :block-node="true"
      @expand="expand"
      @contextmenu="contextmenu"
      @select="select"
    >
      <slot name="dropdown"></slot>
    </a-tree>

    <ContextMenu
      v-if="contextable"
      :visible="visible"
      :left="x"
      :top="y"
      @click="handleContext"
    ></ContextMenu>
  </a-row>
</template>
<script lang="ts">
import { findNode } from "@renderer/utils";
import { defineComponent, PropType, ref, watch, reactive, toRefs } from "vue";

export default defineComponent({
  props: {
    expandedKeys: {
      type: Array as PropType<Array<string | number>>,
      default: [],
    },
    selectedKeys: {
      type: Array as PropType<Array<string | number>>,
      default: [],
    },
    contextable: {
      type: Boolean,
      default: true,
    },
    draggable: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const expandedKeys = ref<(string | number)[]>([]);
    const selectedKeys = ref<(string | number)[]>([]);

    const state = reactive({
      visible: false,
      x: 0,
      y: 0,
    });

    watch(
      () => props.expandedKeys,
      (v) => {
        expandedKeys.value = v;
        emit("update:expandedKeys", v);
      }
    );

    watch(
      () => props.selectedKeys,
      (v) => {
        selectedKeys.value = v;
        emit("update:selectedKeys", v);
      }
    );

    const contextmenu = (evt: PointerEvent) => {
      if (!props.contextable) return;
      evt.preventDefault();
      // 记录当前鼠标的位置
      state.x = evt.x;
      state.y = evt.y;

      // 寻找目标节点
      const current = evt.target || evt.srcElement;
      if (!current) return;

      if (current instanceof HTMLElement) {
        const target = findNode(current, (el: HTMLElement) => {
          // 获取所有的类名称
          const classList = el.classList;
          return classList.contains("arco-tree-node");
        }) as HTMLElement;

        if (target) {
          // 相关的属性
          console.log(target);
          const attrs = target["__vueParentComponent"].attrs;
          const { id, pid, type, text } = attrs as {
            id: number;
            pid: number;
            type: string;
            text: string;
          };
          /* state.context.id = id;
          state.context.pid = pid;
          state.context.type = type;
          state.context.text = text; */
        } else {
          // state.context = { id: 0, pid: 0, type: "3", text: "" };
        }
      }

      state.visible = true;
    };

    return {
      expandedKeys,
      selectedKeys,
      contextmenu,
      ...toRefs(state),
    };
  },
});
</script>
