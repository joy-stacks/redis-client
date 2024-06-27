<!--
 * @Author: JOY
 * @Date: 2024-06-26 10:29:28
 * @LastEditors: JOY
 * @LastEditTime: 2024-06-27 10:05:26
 * @Description: 
-->
<template>
  <Command :id="id" v-if="type === 1"></Command>
  <Keyview :id="id" v-else-if="type === 2"></Keyview>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import Command from "./command.vue";
import Keyview from "./keyview.vue";

export default defineComponent({
  components: {
    Command,
    Keyview,
  },
  props: {
    type: Number,
    id: [String, Number],
  },
  setup() {},
});
</script>
