<template>
  <a-layout class="h-full">
    <a-layout-sider
      class="h-full !w-[250px]"
      :collapsed="false"
      style="box-shadow: 0px 0px 8px -4px rgba(130, 85, 255, 0.6)"
    >
      <div
        class="h-8 flex flex-row items-center justify-start gap-2 p-2 border-solid"
        style="box-shadow: 0px 0px 8px -4px rgba(130, 85, 255, 0.6)"
      >
        <a-tooltip content="添加键" position="bottom">
          <span>
            <JIcon class="cursor-pointer" name="key-add" :width="16" :height="16"></JIcon>
          </span>
        </a-tooltip>
        <a-tooltip content="刷新" position="bottom">
          <span>
            <JIcon class="cursor-pointer" name="refresh" :width="16" :height="16"></JIcon>
          </span>
        </a-tooltip>
        <a-divider class="mx-1" direction="vertical" />
        <a-select v-model="db" @change="change">
          <a-option v-for="(item, index) in dbs" :key="index" :value="item.value">
            {{ `db${item.name} (${item.count})` }}
          </a-option>
        </a-select>
      </div>
      <div class="flex-1 px-2">
        <a-tree ref="treeref" :data="trees" :show-line="false" :draggable="true" :block-node="true">
        </a-tree>
      </div>
    </a-layout-sider>
    <a-layout-content></a-layout-content>
  </a-layout>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, onMounted, h } from "vue";

import JIcon from "@renderer/components/svg-icon.vue";
import { getLinkKeys } from "@renderer/api";

export default defineComponent({
  components: {
    JIcon,
  },
  props: {
    id: [String, Number],
  },
  setup(props) {
    let originData = [] as { db: string; keys: { key: string; type: string }[] }[];
    const state = reactive({
      db: "0",
      dbs: [] as { name: string; value: string; count: number }[],
      trees: [],
    });

    const init = async () => {
      const result = await getLinkKeys<{ db: string; keys: { key: string; type: string }[] }[]>({
        id: props.id + "",
      });
      if (result && result.code === 1) {
        const data = result.data || [];
        originData = data;
        state.dbs = data.map((item) => {
          return {
            name: item.db,
            value: item.db,
            count: item.keys.length || 0,
          };
        });
      }
    };

    const getIcon = (type: string) => {
      switch (type) {
        case "string":
          return () => h(JIcon, { name: "string" });
        case "hash":
          return () => h(JIcon, { name: "hash" });
        default:
          return () => h(JIcon, { name: "folder" });
      }
    };

    const change = (v) => {
      const data = originData.find((item) => item.db === v);
      // 生成树
      const children = data?.keys || [];
      state.trees = children.reduce((pre, cur) => {
        // 对key进行分割
        const splits = cur.key.split(":");
        if (splits.length === 1) {
          const icon = getIcon(cur.type);
          pre.push({
            key: cur.key,
            title: cur.key,
            type: cur.type,
            children: [],
            icon,
          });
        } else if (splits.length > 1) {
          let icon = getIcon("");
          let first;
          splits.forEach((sp, i) => {
            let type = "folder";
            if (i === splits.length - 1) {
              icon = getIcon(cur.type);
              type = cur.type;
            }

            if (i === 0) {
              first = {
                key: sp,
                title: sp,
                type: type,
                children: [],
                icon,
              };
              pre.push(first);
            } else {
              const next = {
                key: sp,
                title: sp,
                type: type,
                children: [],
                icon,
              };
              first.children.push(next);
              first = next;
            }
          });
        }
        return pre;
      }, [] as any[]);
    };

    onMounted(async () => {
      await init();
      change("0");
    });

    return {
      change,
      ...toRefs(state),
    };
  },
});
</script>
