<!--
 * @Author: JOY
 * @Date: 2024-06-24 15:43:16
 * @LastEditors: JOY
 * @LastEditTime: 2024-06-25 11:19:51
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
    <template #Footer>
      <div class="flex flex-row items-center gap-2">
        <a-button type="primary" @click="test" :loading="loading">测试连接</a-button>
        <span class="flex-1"></span>
        <a-button type="secondary" @click="cancel">取消</a-button>
        <a-button type="primary" @click="ok">提交</a-button>
      </div>
    </template>
    <a-form
      ref="formref"
      :model="model"
      :rules="rules"
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
            <JTreeSelect v-model="model.gid" :data="trees" :parentable="true"> </JTreeSelect>
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

import JTreeSelect from "@renderer/components/tree-select.vue";
import { postLinkAdd, postLinkTest } from "@renderer/api";

export default defineComponent({
  expose: ["add"],
  components: {
    JModal,
    JTreeSelect,
  },
  setup() {
    const formref = ref();

    const state = reactive({
      visible: false,
      type: 1,
      loading: false,
    });

    const { setLinks, cache } = useRedisStoreWithout();

    const trees = computed(() => {
      const links = cache.links.filter((item) => item.type === "1");
      const results = createTree(links, 0);
      // 添加无分组
      results.unshift({
        key: 0,
        title: "无",
        children: [],
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
      gid: 0,
      host: "127.0.0.1",
      type: "1",
      port: "6379",
      pwd: "",
      user: "",
      db: "",
    });

    const rules = {
      host: [
        {
          required: true,
          message: "host是必填项",
        },
        {
          validator: (_, cb) => {
            if (!model.port) {
              cb("端口是必填项");
            } else {
              cb();
            }
          },
        },
      ],
    };

    const add = (gid: number) => {
      model.gid = gid;
      state.type = 1;
      state.visible = true;
    };

    const ok = () => {
      formref.value?.validate(async (errors) => {
        if (errors) return;

        const param = {
          name: model.name,
          gid: model.gid + "",
          type: model.type,
          host: model.host,
          port: model.port,
          pwd: model.pwd,
          user: model.user,
        };
        let result;
        let message = "";
        if (state.type === 1) {
          result = await postLinkAdd<Store.Link[]>(param);
          message = "新增成功";
        } else if (state.type === 2) {
          /* result = await postGroupEdit<Store.Link[]>({
            ...param,
            group_id: model.group_id + "",
          }); */
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
      state.visible = false;
    };

    // 链接测试
    const test = () => {
      formref.value?.validateField(["host"], async (errors) => {
        if (errors) return;

        const param = {
          type: model.type,
          host: model.host,
          port: model.port,
          pwd: model.pwd,
          user: model.user,
        };
        state.loading = true;
        const result = await postLinkTest(param);
        if (result && result.code === 1) {
          Message.success("Redis 连接成功");
        } else {
          Message.error(result.msg);
        }
        state.loading = false;
      });
    };

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
    };

    return {
      formref,
      model,
      rules,
      trees,
      ok,
      cancel,
      add,
      parse,
      test,
      ...toRefs(state),
    };
  },
});
</script>
