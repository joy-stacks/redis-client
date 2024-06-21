<!--
 * @Author: JOY
 * @Date: 2024-06-21 15:32:00
 * @LastEditors: JOY
 * @LastEditTime: 2024-06-21 17:21:26
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
          <span>
            <JIcon class="cursor-pointer" name="bolt" :width="16" :height="16"></JIcon>
          </span>
        </a-tooltip>
        <a-tooltip content="添加分组" position="bottom">
          <span @click="() => uphold('1')">
            <JIcon class="cursor-pointer" name="folder" :width="16" :height="16"></JIcon>
          </span>
        </a-tooltip>
        <a-divider class="mx-1" direction="vertical" />
        <a-input class="flex-1" size="small" placeholder="过滤">
          <template #prefix>
            <icon-filter />
          </template>
        </a-input>
      </div>
      <div class="flex-1 pl-2">
        <a-tree :data="trees" :show-line="false" :draggable="true" />
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
      ></div>
    </div>

    <group-add ref="gaddref"></group-add>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, h } from "vue";

import JIcon from "@renderer/components/svg-icon.vue";
import GroupAdd from "@renderer/views/form/group-add.vue";
import JTag from "@renderer/layout/tag.vue";

import { useRedisStoreWithout } from "@renderer/store/modules/redis";

export default defineComponent({
  components: {
    JIcon,
    JTag,
    GroupAdd,
  },
  setup() {
    const gaddref = ref<InstanceType<typeof GroupAdd>>();

    const { link } = useRedisStoreWithout();

    const trees = ref([]);

    // 数据维护
    const uphold = (type: string) => {
      switch (type) {
        case "1":
          gaddref.value?.open();
          break;
      }
    };

    // 创建树形结构
    const createTree = (list: Store.Link[], pid: number) => {
      const groups = list.filter((item) => item.pid === pid);
      return groups.map((item) => {
        // 默认是目录
        let icon = () => h(JIcon, { name: "folder" });

        // 渲染图标的三种类型
        if (item.type === "2") {
        } else if (item.type === "1" && pid === 0) {
          icon = () => h(JIcon, { name: "root-folder" });
        }

        return {
          key: item.id,
          title: item.name,
          children: createTree(list, item.id),
          icon,
        };
      });
    };

    onMounted(async () => {
      const links = await link;
      console.log(links);
      // 生成树形结构数据
      trees.value = createTree(links, 0);
    });

    return {
      gaddref,
      trees,
      uphold,
    };
  },
});
</script>
