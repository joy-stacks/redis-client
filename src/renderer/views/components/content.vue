<!--
 * @Author: JOY
 * @Date: 2024-06-26 10:29:28
 * @LastEditors: JOY
 * @LastEditTime: 2024-06-26 16:15:17
 * @Description: 
-->
<template>
  <Command :id="id" v-if="type === 1"></Command>
  <Command :id="id" v-else-if="type === 2"></Command>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import Command from "./command.vue";

export default defineComponent({
  components: {
    Command,
  },
  props: {
    type: Number,
    id: [String, Number],
  },
  setup() {},
});
</script>
