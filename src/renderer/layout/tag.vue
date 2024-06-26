<!--
 * @Author: JOY
 * @Date: 2024-06-19 16:02:41
 * @LastEditors: JOY
 * @LastEditTime: 2024-06-26 11:24:41
 * @Description: 
-->
<template>
  <div
    class="bg-white border-[#ddd] dark:border-[#333] h-[33px] relative mt-1 ml-1 border-t-1 border-solid"
    style="box-shadow: 0px 0px 4px -4px rgba(130, 85, 255, 0.3)"
  >
    <ul class="flex flex-row items-center justify-start">
      <li class="tag-item cursor-pointer hover:bg-[#f6f6f6]" @click="() => scroll('left')">
        <icon-double-left />
      </li>
      <li
        class="tag-item cursor-pointer hover:bg-[#f6f6f6]"
        :class="[iscroll && x > 0 ? 'scroll-left' : '']"
      >
        <span
          class="w-full h-full flex justify-center items-center"
          :class="{ active: actived === -1 }"
        >
          <icon-home />
        </span>
      </li>
      <li class="tag-item flex-1 scroll-content" ref="scrollref">
        <draggable
          v-model="tags"
          @start="idrag = true"
          @end="idrag = false"
          :component-data="{
            name: 'list',
            tag: 'div',
            type: 'transition-group',
          }"
          v-bind="{
            group: 'form-draggable',
            ghostClass: 'moving',
            animation: 180,
            handle: '.move',
          }"
          item-key="key"
        >
          <div
            v-for="(item, index) in tags"
            class="tag-nav-item cursor-pointer hover:bg-[#f6f6f6]"
            :class="{ active: item.id === actived, move: imove }"
            :key="index"
            @mouseover="imove = true"
            @mouseout="imove = false"
          >
            <span class="py-0 px-2 text-[#595959] hover:text-[#595959]">
              {{ item.name }}
            </span>
            <!--  @contextmenu.prevent="handleContextMenu($event, index)"  @click.prevent="closeTags({ key: 'ONE' }, index)" -->
            <span
              class="w-4 h-4 text-[10px] rounded-full hover:bg-[#ff5722] hover:text-white flex items-center justify-center"
            >
              <icon-close />
            </span>
          </div>
        </draggable>
      </li>
      <li
        class="tag-item cursor-pointer hover:bg-[#f6f6f6]"
        :class="[iscroll && x === 0 ? 'scroll-right' : '']"
        @click="() => scroll('right')"
      >
        <icon-double-right />
      </li>
      <li class="tag-item cursor-pointer hover:bg-[#f6f6f6]">
        <a-dropdown trigger="hover">
          <icon-down />
          <template #content>
            <a-doption>关闭其他</a-doption>
            <a-doption>关闭全部</a-doption>
          </template>
        </a-dropdown>
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, nextTick, ref } from "vue";
import { useScroll } from "@vueuse/core";
import { VueDraggableNext } from "vue-draggable-next";

import { useNavStore } from "@renderer/store/modules/nav";

export default defineComponent({
  components: {
    draggable: VueDraggableNext,
  },
  setup() {
    const scrollref = ref<HTMLLIElement>();
    const { nav } = useNavStore();

    const { x } = useScroll(scrollref, { behavior: "smooth" });

    const iscroll = ref<boolean>(false);
    const imove = ref<boolean>(false);
    const idrag = ref<boolean>(false);

    const actived = computed(() => nav.active);
    const tags = computed(() => nav.tags);

    const computeScroll = async () => {
      nextTick(() => {
        const scrollWidth = scrollref.value?.scrollWidth || 0;
        const clientWidth = scrollref.value?.clientWidth || 0;
        const bool = scrollWidth > clientWidth;
        iscroll.value = bool;

        if (bool) {
          scroll("right");
        }
      });
    };

    // 滚动
    const scroll = (direction: "left" | "right") => {
      const scrollWidth = scrollref.value?.scrollWidth || 0;
      const clientWidth = scrollref.value?.clientWidth || 0;

      if (scrollWidth > clientWidth) {
        if (direction === "left") {
          x.value = 0;
        } else if (direction === "right") {
          const scrollX = scrollWidth - clientWidth;
          x.value = scrollX;
        }
      }
    };

    return {
      tags,
      actived,
      x,
      iscroll,
      imove,
      idrag,
      scroll,
    };
  },
});
</script>
<style lang="less" scoped>
.tag-item {
  @apply relative w-8 h-8 leading-8 text-center border-solid text-nowrap;

  border-left-width: 1px;
  border-left-color: #f6f6f6;
  transition: background-color 0.2s;

  & > div {
    @apply flex flex-row justify-start items-center;
  }

  .active {
    background-color: #f6f6f6;
    color: #000;
    font-weight: 500;
  }

  .active a {
    color: #000;
    font-weight: 500;
  }

  .active::after {
    height: 2px;
    border: 0;
    border-radius: 0;
    background-color: #191a23;
    position: absolute;
    left: 0;
    top: 0;
    content: "";
    width: 100%;
    box-sizing: border-box;
    pointer-events: none;
  }
}

.tag-nav-item {
  @apply relative h-9 py-0 px-2 pr-3 transition-all duration-200 flex flex-row gap-1 items-center justify-center;
  border-right: 1px solid;
  border-right-color: #f6f6f6;
}

.scroll-content {
  @apply overflow-x-auto overflow-y-hidden transition-all;
  scrollbar-width: none;
}

.scroll-content::-webkit-scrollbar {
  display: none;
}

.scroll-left {
  &::before {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 36px;
    z-index: 2;
    width: 30px;
    transition: box-shadow 0.3s;
    content: "";
    pointer-events: none;
    box-shadow: inset 10px 0 8px -8px rgba(0, 0, 0, 0.15);
  }
}

.scroll-right {
  &::after {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 2;
    width: 32px;
    transform: translateX(-100%);
    transition: box-shadow 0.3s;
    content: "";
    pointer-events: none;
    box-shadow: inset -10px 0 8px -8px rgba(0, 0, 0, 0.15);
  }
}
</style>
