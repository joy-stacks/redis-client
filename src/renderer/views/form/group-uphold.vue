<!--
 * @Author: JOY
 * @Date: 2024-06-21 14:27:29
 * @LastEditors: JOY
 * @LastEditTime: 2024-06-24 15:51:45
 * @Description: 
-->
<template>
  <JModal
    v-model:visible="visible"
    title="分组"
    :top="100"
    :width="350"
    :closable="true"
    @ok="ok"
    @cancel="cancel"
  >
    <a-form
      ref="formref"
      :model="model"
      :rules="rules"
      :label-col-props="{ span: 6 }"
      :wrapper-col-props="{ span: 18 }"
    >
      <a-form-item field="group_pid" label="上级组" validate-trigger="change" required>
        <a-tree-select v-model="model.group_pid" :data="trees"></a-tree-select>
      </a-form-item>
      <a-form-item field="group_name" label="组名称" validate-trigger="input" required>
        <a-input v-model="model.group_name" />
      </a-form-item>
    </a-form>
  </JModal>
</template>
<script lang="ts">
import { computed, defineComponent, reactive, ref } from "vue";
import JModal from "@renderer/components/modal.vue";
import { useRedisStoreWithout } from "@renderer/store/modules/redis";
import cloneDeep from "lodash/cloneDeep";

import { Message, TreeNodeData } from "@arco-design/web-vue";
import { postGroupAdd, postGroupEdit, postGroupDel } from "@renderer/api";
import { Modal } from "@arco-design/web-vue";

export default defineComponent({
  expose: ["add", "edit", "del"],
  components: {
    JModal,
  },
  setup() {
    const formref = ref();
    const visible = ref(false);
    const type = ref(1);

    const { setLinks, cache } = useRedisStoreWithout();

    const trees = computed(() => {
      const links = cache.links.filter((item) => item.type === "1");
      const results = createTree(links, 0);
      // 添加无分组
      results.unshift({
        key: 0,
        title: "无",
      });
      return results;
    });

    // 创建树形结构
    const createTree = (list: Store.Link[], pid: number): TreeNodeData[] => {
      const _list = cloneDeep(list);
      const groups = _list.filter((item) => item.pid === pid);
      return groups.map((item) => {
        // 默认是目录
        return {
          key: item.id,
          title: item.name,
          children: createTree(list, item.id),
        };
      });
    };

    const model = reactive({
      group_name: "",
      group_id: 0,
      group_pid: 0,
    });

    const rules = {
      group_name: [
        {
          required: true,
          message: "组名称必填",
        },
      ],
    };

    // 新增
    const add = (pid: number) => {
      model.group_pid = pid;
      visible.value = true;
      type.value = 1;
    };

    // 修改
    const edit = (id: number, pid: number, name: string) => {
      model.group_id = id;
      model.group_pid = pid;
      model.group_name = name;
      visible.value = true;
      type.value = 2;
    };

    // 删除
    const del = (id: number, name: string) => {
      model.group_id = id;
      Modal.confirm({
        title: `删除确认`,
        content: `确定要删除组【${name}】吗？`,
        titleAlign: "start",
        alignCenter: false,
        async onOk() {
          const result = await postGroupDel<Store.Link[]>({
            group_id: id + "",
          });
          if (result && result.code === 1) {
            Message.success('删除成功');
            // 将新的数据提交到仓库
            const data = result.data;
            setLinks(data);
          } else {
            Message.warning(result.msg);
          }
        },
        onCancel() {},
      });
      type.value = 3;
    };

    // 表单提交
    const ok = () => {
      formref.value?.validate(async (errors) => {
        if (errors) return;

        const param = {
          group_name: model.group_name,
          group_pid: model.group_pid + "",
        };
        let result;
        let message = "";
        if (type.value === 1) {
          result = await postGroupAdd<Store.Link[]>(param);
          message = "新增成功";
        } else if (type.value === 2) {
          result = await postGroupEdit<Store.Link[]>({
            ...param,
            group_id: model.group_id + "",
          });
          message = "修改成功";
        }
        if (result && result.code === 1) {
          Message.success(message);
          // 将新的数据提交到仓库
          const data = result.data;
          setLinks(data);
          cancel();
        } else {
          Message.warning(result.msg);
        }
      });
    };

    const cancel = () => {
      formref.value?.resetFields();
      formref.value?.clearValidate();
      visible.value = false;
    };

    return {
      formref,
      visible,
      trees,
      model,
      rules,
      add,
      edit,
      del,
      cancel,
      ok,
    };
  },
});
</script>
<style lang="less">
.arco-modal-footer {
  @apply !text-right;
}
</style>
