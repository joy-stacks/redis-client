<!--
 * @Author: JOY
 * @Date: 2024-06-21 14:27:29
 * @LastEditors: JOY
 * @LastEditTime: 2024-06-21 15:28:00
 * @Description: 
-->
<template>
  <JModal
    v-model:visible="visible"
    title="添加分组"
    :top="100"
    :width="350"
    :closable="true"
    @cancel="cancel"
  >
    <a-form :model="form" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }">
      <a-form-item field="group_id" label="上级组" validate-trigger="change" required>
        <a-tree-select v-model="form.group_id" :data="treeData"></a-tree-select>
      </a-form-item>
      <a-form-item field="group_name" label="组名称" validate-trigger="input" required>
        <a-input v-model="form.group_name" />
      </a-form-item>
    </a-form>
  </JModal>
</template>
<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import JModal from "../../components/modal.vue";

export default defineComponent({
  expose: ["open"],
  components: {
    JModal,
  },
  setup() {
    const visible = ref(false);

    const form = reactive({
      group_name: "",
      group_id: "0",
    });

    const rules = {
      group_name: [
        {
          required: true,
          message: "组名称必填",
        },
      ],
    };

    const open = () => {
      visible.value = true;
    };

    const cancel = () => {
      visible.value = false;
    };

    const treeData = [
      {
        key: "node1",
        title: "Trunk",
        disabled: true,
        children: [
          {
            key: "node2",
            title: "Leaf",
          },
        ],
      },
      {
        key: "node3",
        title: "Trunk2",
        children: [
          {
            key: "node4",
            title: "Leaf",
          },
          {
            key: "node5",
            title: "Leaf",
          },
        ],
      },
    ];

    return {
      visible,
      form,
      rules,
      open,
      cancel,
      treeData,
    };
  },
});
</script>
