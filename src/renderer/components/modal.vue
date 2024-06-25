<!--
 * @Author: JOY
 * @Date: 2024-06-21 14:27:29
 * @LastEditors: JOY
 * @LastEditTime: 2024-06-25 10:00:44
 * @Description: 
-->
<template>
  <a-modal
    v-model:visible="visible"
    :modal-class="modalClass"
    :title-align="titleAlign"
    :top="top"
    :width="width"
    :align-center="alignCenter"
    :closable="closable"
    :hide-title="hideTitle"
    :draggable="draggable"
    :mask-closable="false"
    @cancel="cancel"
    @before-ok="ok"
  >
    <template #footer>
      <slot name="Footer" v-if="$slots.Footer"></slot>
      <div class="flex gap-2 justify-end" v-else>
        <a-button type="secondary" @click="cancel">取消</a-button>
        <a-button type="primary" @click="ok">提交</a-button>
      </div>
    </template>
    <slot></slot>
  </a-modal>
</template>
<script lang="ts">
import { PropType, defineComponent, ref, watch } from "vue";
export default defineComponent({
  expose: ["open"],
  emits: ["update:modelValue", "ok", "before-ok", "cancel", "before-close"],
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    modalClass: {
      type: String,
      default: "j-modal",
    },
    titleAlign: {
      type: String as PropType<"start" | "center">,
      default: "start",
    },
    top: Number,
    width: Number,
    alignCenter: Boolean,
    closable: Boolean,
    hideTitle: Boolean,
    draggable: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { emit }) {
    const visible = ref(false);

    watch(
      () => props.modelValue,
      () => {
        visible.value = props.modelValue;
        emit("update:modelValue", props.modelValue);
      }
    );

    const ok = () => {
      emit("ok");
    };

    const cancel = () => {
      emit("cancel");
    };

    return {
      visible,
      ok,
      cancel,
    };
  },
});
</script>
<style lang="less">
.j-modal {
  .arco-modal-header {
    @apply h-9;
  }
}
</style>
