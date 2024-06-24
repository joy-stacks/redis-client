<!--
 * @Author: JOY
 * @Date: 2024-06-24 15:43:16
 * @LastEditors: JOY
 * @LastEditTime: 2024-06-24 17:36:17
 * @Description: 
-->
<template>
  <JModal
    v-model:visible="visible"
    title="连接"
    :bodyStyle="{ minHeight: '400px' }"
    :top="100"
    :width="650"
    :closable="true"
    @ok="ok"
    @cancel="cancel"
  >
    <a-form
      ref="formref"
      :model="model"
      :label-col-props="{ span: 6 }"
      :wrapper-col-props="{ span: 18 }"
    >
      <a-tabs default-active-key="1" direction="vertical">
        <a-tab-pane key="1" title="常规配置">
          <a-form-item field="url" label="URL解析">
            <a-input v-model="model.url"> </a-input>
            <a-button class="ml-2" type="secondary" @click="parse">解析</a-button>
          </a-form-item>
          <a-form-item field="name" label="连接名称" validate-trigger="input" required>
            <a-input v-model="model.name" />
          </a-form-item>
          <a-form-item field="gid" label="分组" validate-trigger="change" required>
            <a-tree-select v-model="model.gid" :data="trees"></a-tree-select>
          </a-form-item>
          <a-form-item field="host" label="连接地址" validate-trigger="change" required>
            <a-input v-model="model.host">
              <template #prepend>
                <a-select v-model="model.type">
                  <a-option value="1">TCP</a-option>
                  <a-option value="2">UNIX</a-option>
                </a-select>
              </template>
            </a-input>
            <span class="px-1">:</span>
            <a-input class="!w-[90px]" v-model="model.port"></a-input>
          </a-form-item>
          <a-form-item field="pwd" label="密码">
            <a-input-password v-model="model.pwd"></a-input-password>
          </a-form-item>
          <a-form-item field="user" label="用户名">
            <a-input v-model="model.user"></a-input>
          </a-form-item>
        </a-tab-pane>
        <a-tab-pane key="2" title="高级配置"> Content of Tab Panel 2 </a-tab-pane>
        <a-tab-pane key="3"> </a-tab-pane>
      </a-tabs>
    </a-form>
  </JModal>
</template>
<script lang="ts">
import { computed, defineComponent, reactive, ref, toRefs } from "vue";
import JModal from "@renderer/components/modal.vue";
import { useRedisStoreWithout } from "@renderer/store/modules/redis";
import cloneDeep from "lodash/cloneDeep";
import { Message, TreeNodeData } from "@arco-design/web-vue";

export default defineComponent({
  expose: ["add"],
  components: {
    JModal,
  },
  setup() {
    const formref = ref();

    const state = reactive({
      visible: false,
    });

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
      url: "redis://:123@127.0.0.1:6379/0",
      name: "",
      gid: "0",
      host: "127.0.0.1",
      type: "1",
      port: "6379",
      pwd: "",
      user: "",
      db: "",
    });

    const add = () => {
      state.visible = true;
    };

    const ok = () => {};

    const cancel = () => {};

    // 解析url
    const parse = () => {
      if (!model.url) {
        Message.warning("解析失败：Redis URL 不能为空");
        return;
      }
      // Redis URL正则表达式
      const redisReg =
        /redis\:\/\/\:(?<pwd>[\S]*)@(?<host>([0-9]{1,3}\.){3}[0-9]{1,3})\:(?<port>[1-9]{1,6})\/(?<db>[0-14]{1})/;
      // 校验url是否有效
      if (!redisReg.test(model.url)) {
        Message.warning("解析失败：无效的 Redis URL");
        return;
      }
      const match = model.url.match(redisReg);
      if (match) {
        model.host = (match.groups && match.groups["host"]) || "127.0.0.1";
        model.port = (match.groups && match.groups["port"]) || "6379";
        model.pwd = (match.groups && match.groups["pwd"]) || "";
        model.db = (match.groups && match.groups["db"]) || "0";
      }
      console.log(match);
    };

    return {
      formref,
      model,
      trees,
      ok,
      cancel,
      add,
      parse,
      ...toRefs(state),
    };
  },
});
</script>
