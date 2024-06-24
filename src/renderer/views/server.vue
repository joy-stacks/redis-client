<!--
 * @Author: JOY
 * @Date: 2024-06-21 15:32:00
 * @LastEditors: JOY
 * @LastEditTime: 2024-06-24 15:55:54
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
      <div class="flex-1 px-2">
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
        >
          <template #extra="nodeData">
            <div class="flex flex-row gap-2 absolute right-8 top-2 text-[rgb(var(--primary-4))]">
              <a-tooltip content="修改" position="top">
                <icon-edit @click="() => uphold('2', nodeData)" />
              </a-tooltip>
              <a-tooltip content="删除" position="top">
                <icon-delete @click="() => uphold('3', nodeData)" />
              </a-tooltip>
            </div>
          </template>
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
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, h, computed, reactive } from "vue";
import { Tree, TreeNodeData } from "@arco-design/web-vue";

import debounce from "lodash/debounce";
import cloneDeep from "lodash/cloneDeep";

import JIcon from "@renderer/components/svg-icon.vue";
import GroupUphold from "@renderer/views/form/group-uphold.vue";
import LinkUphold from "@renderer/views/form/link-uphold.vue";
import JTag from "@renderer/layout/tag.vue";

import { useRedisStoreWithout } from "@renderer/store/modules/redis";
import { toRefs } from "vue";

export default defineComponent({
  components: {
    JIcon,
    JTag,
    GroupUphold,
    LinkUphold,
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
    });

    const trees = computed(() => {
      return createTree(cache.links, 0);
    });

    // 数据维护
    const uphold = (type: string, record?: TreeNodeData & { id: number; pid: number }) => {
      console.log(record);
      switch (type) {
        case "1":
          // 获取选中的分组
          const pid = state.selectedKeys[0] || 0;
          gaddref.value?.add(pid as number);
          break;
        case "2":
          gaddref.value?.edit(record?.id as number, record?.pid as number, record?.title || "");
          break;
        case "3":
          gaddref.value?.del(record?.key as number, record?.title || "");
          break;
        case "4":
          linkref.value?.add();
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
          children: createTree(list, item.id),
          icon,
        };
      });
    };

    // 树节点展开
    const expand = (keys: Array<number | string>) => {
      state.expandedKeys =
        keys.length === 0 ? ([] as Array<string | number>) : state.defaultExpandedKeys;
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
      select,
      filter,
      ...toRefs(state),
    };
  },
});
</script>
