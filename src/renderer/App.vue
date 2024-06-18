<!--
 * @Author: JOY
 * @Date: 2024-06-18 09:28:32
 * @LastEditors: JOY
 * @LastEditTime: 2024-06-18 16:39:31
 * @Description: 
-->
<template>
  <a-config-provider :locale="locale">
    <router-view></router-view>
  </a-config-provider>
</template>
<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import zhCN from "@arco-design/web-vue/es/locale/lang/zh-cn";
import enUS from "@arco-design/web-vue/es/locale/lang/en-us";

import "@arco-design/web-vue/dist/arco.less";

const locales = {
  "zh-CN": zhCN,
  "en-US": enUS,
};

export default defineComponent({
  setup() {
    const localeType = ref("es-ES");
    const locale = computed(() => {
      return locales[localeType.value] || zhCN;
    });

    return {
      locale,
    };
  },
});
</script>
<style lang="less">
@import url(./style/index.less);
</style>
