<!--
 * @Author: JOY
 * @Date: 2024-06-21 15:32:00
 * @LastEditors: JOY
 * @LastEditTime: 2024-06-25 17:18:22
 * @Description: 
-->
<template>
  <div class="h-full flex flex-row">
    <div
      class="h-full w-[250px] bg-white rounded-tl-2xl flex flex-col gap-1"
      style="box-shadow: 0px 0px 8px -4px rgba(130, 85, 255, 0.6) inset"
    >
      <div
        class="h-8 flex flex-row items-center justify-start gap-2 p-2 border-solid"
        style="box-shadow: 0px 0px 8px -4px rgba(130, 85, 255, 0.6)"
      >
        <a-tooltip content="添加连接" position="bottom">
          <span @click="() => uphold('4')">
            <JIcon class="cursor-pointer" name="bolt" :width="16" :height="16"></JIcon>
          </span>
        </a-tooltip>
        <a-tooltip content="添加分组" position="bottom">
          <span @click="() => uphold('1')">
            <JIcon class="cursor-pointer" name="folder" :width="16" :height="16"></JIcon>
          </span>
        </a-tooltip>
        <a-divider class="mx-1" direction="vertical" />
        <a-input class="flex-1" v-model="keywords" size="small" placeholder="过滤" @change="filter">
          <template #prefix>
            <icon-filter />
          </template>
        </a-input>
      </div>
      <div class="flex-1 px-2" @contextmenu="contextmenu">
        <a-tree
          ref="treeref"
          v-model:expanded-keys="expandedKeys"
          v-model:selected-keys="selectedKeys"
          :default-expanded-keys="defaultExpandedKeys"
          :data="trees"
          :show-line="false"
          :draggable="true"
          :block-node="true"
          @expand="expand"
          @select="select"
          @contextmenu="contextmenu"
        >
        </a-tree>
      </div>
    </div>
    <div
      class="h-full flex-1 bg-[rgb(247,250,255)] flex flex-col gap-1"
      style="box-shadow: 0px 0px 4px -4px rgba(130, 85, 255, 0.3)"
    >
      <JTag></JTag>
      <div
        class="flex-1 bg-white mt-[1px] ml-1"
        style="box-shadow: 0px 0px 4px -4px rgba(130, 85, 255, 0.3) inset"
      >
        <router-view></router-view>
      </div>
    </div>

    <!-- 组维护 -->
    <group-uphold ref="gaddref"></group-uphold>

    <!-- 连接维护 -->
    <link-uphold ref="linkref"></link-uphold>

    <!-- 右键菜单栏 -->
    <ContextMenu :visible="visible" :left="x" :top="y" @click="handleContext">
      <template #default>
        <div data-key="1" v-show="context.type === '1' || context.type === '3'">
          <span></span>
          <span>添加分组</span>
        </div>
        <div data-key="2" v-show="context.type === '1'">
          <span></span>
          <span>修改分组</span>
        </div>
        <div data-key="4" v-show="context.type === '1' || context.type === '3'">
          <span></span>
          <span>添加连接</span>
        </div>
        <div data-key="3" v-show="context.type === '2'">
          <span></span>
          <span>修改连接</span>
        </div>
        <div data-key="" v-show="context.type === '2'">
          <span></span>
          <span>断开连接</span>
        </div>
        <a-divider class="my-0" v-show="context.type !== '3'" />
        <div data-key="5" v-show="context.type === '1'">
          <span></span>
          <span>删除分组</span>
        </div>
        <div data-key="" v-show="context.type === '2'">
          <span></span>
          <span>删除连接</span>
        </div>
      </template>
    </ContextMenu>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, h, computed, reactive, toRefs } from "vue";
import { Tree } from "@arco-design/web-vue";

import debounce from "lodash/debounce";
import cloneDeep from "lodash/cloneDeep";

import JIcon from "@renderer/components/svg-icon.vue";
import GroupUphold from "@renderer/views/form/group-uphold.vue";
import LinkUphold from "@renderer/views/form/link-uphold.vue";
import JTag from "@renderer/layout/tag.vue";
import ContextMenu from "@renderer/components/context-menu.vue";

import { useRedisStoreWithout } from "@renderer/store/modules/redis";

export default defineComponent({
  components: {
    JIcon,
    JTag,
    GroupUphold,
    LinkUphold,
    ContextMenu,
  },
  setup() {
    const gaddref = ref<InstanceType<typeof GroupUphold>>();
    const linkref = ref<InstanceType<typeof LinkUphold>>();
    const treeref = ref<InstanceType<typeof Tree>>();

    const { link, cache } = useRedisStoreWithout();

    const state = reactive({
      keywords: "",
      defaultExpandedKeys: [] as Array<string | number>,
      expandedKeys: [] as Array<string | number>,
      selectedKeys: [] as Array<string | number>,
      selectablde: false,
      links: [] as Store.Link[],
      visible: false,
      x: 0,
      y: 0,
      context: { id: 0, pid: 0, type: "3", text: "" },
    });

    const trees = computed(() => {
      return createTree(cache.links, 0);
    });

    // 数据维护
    const uphold = (type: string) => {
      // 获取选中的分组
      const context = state.context;
      switch (type) {
        case "1":
          gaddref.value?.add(context.pid);
          break;
        case "2":
          gaddref.value?.edit(context.id, context.pid, context.text);
          break;
        case "5":
          gaddref.value?.del(context.id, context.text);
          break;
        case "4":
          linkref.value?.add(context.pid);
          break;
      }
    };

    // 创建树形结构
    const createTree = (list: Store.Link[], pid: number) => {
      const _list = cloneDeep(list);
      const groups = _list.filter((item) => item.pid === pid);
      return groups.map((item) => {
        // 默认是目录
        let icon = () => h(JIcon, { name: "unlinked" });

        // 渲染图标的三种类型
        if (item.type === "1" && pid === 0) {
          // 展开
          state.defaultExpandedKeys.push(item.id);

          if (state.expandedKeys.includes(item.id)) {
            icon = () => h(JIcon, { name: "root-folder-opened" });
          } else {
            icon = () => h(JIcon, { name: "root-folder" });
          }
        } else if (item.type === "1" && pid > 0) {
          if (state.expandedKeys.includes(item.id)) {
            icon = () => h(JIcon, { name: "folder-opened" });
          } else {
            icon = () => h(JIcon, { name: "folder" });
          }
        }

        return {
          key: item.id,
          title: item.name,
          id: item.id,
          pid: pid,
          type: item.type,
          text: item.name,
          children: createTree(list, item.id),
          icon,
        };
      });
    };

    // 寻找目标节点
    const findNode = (target: HTMLElement) => {
      // 获取所有的类名称
      const classList = target.classList;
      // 判断类样式中是否包含 arco-tree-node
      if (classList.contains("arco-tree-node")) {
        return target;
      } else {
        const parent = target.parentElement || target.parentNode;
        if (parent instanceof HTMLElement) {
          return findNode(parent);
        }
      }
      return null;
    };

    // 树节点展开
    const expand = (keys: Array<number | string>) => {
      state.expandedKeys =
        keys.length === 0 ? ([] as Array<string | number>) : state.defaultExpandedKeys;
    };

    // 右键菜单
    const contextmenu = (evt: PointerEvent | MouseEvent) => {
      evt.preventDefault();
      // 记录当前鼠标的位置
      state.x = evt.x;
      state.y = evt.y;

      // 寻找目标节点
      const current = evt.target || evt.srcElement;
      if (!current) return;

      if (current instanceof HTMLElement) {
        const target = findNode(current) as HTMLElement;
        if (target) {
          // 相关的属性
          const attrs = target["__vueParentComponent"].attrs;
          const { id, pid, type, text } = attrs as {
            id: number;
            pid: number;
            type: string;
            text: string;
          };
          state.context.id = id;
          state.context.pid = pid;
          state.context.type = type;
          state.context.text = text;
        } else {
          state.context = { id: 0, pid: 0, type: "3", text: "" };
        }
      }
      state.visible = true;
    };

    // 处理菜单的点击
    const handleContext = (key: string) => {
      if (!key) return;
      uphold(key);
    };

    // 前一个选中
    let originSelectedKeys: Array<number | string> = [];
    // 选中树节点
    const select = (keys: Array<number | string>) => {
      // 判断选中的值是否相同
      if (originSelectedKeys.length === 1 && originSelectedKeys[0] !== keys[0]) {
        state.selectedKeys = keys;
      } else {
        state.selectablde = !state.selectablde;
        state.selectedKeys = state.selectablde ? keys : [];
      }
      originSelectedKeys = keys;
    };

    // 过滤
    const filter = debounce(() => {
      /* links.value = olinks.filter(item=> {
        item.name
      }) */
    }, 1000);

    const close = () => {
      state.visible = false;
    };

    onMounted(async () => {
      await link;
    });

    return {
      gaddref,
      linkref,
      treeref,
      trees,
      uphold,
      expand,
      contextmenu,
      select,
      filter,
      close,
      handleContext,
      ...toRefs(state),
    };
  },
});
</script>
