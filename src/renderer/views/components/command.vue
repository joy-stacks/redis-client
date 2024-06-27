<!--
 * @Author: JOY
 * @Date: 2024-06-26 10:07:35
 * @LastEditors: JOY
 * @LastEditTime: 2024-06-27 09:56:10
 * @Description: 
-->
<template>
  <div class="h-full bg-[rgb(12,12,12)]">
    <div ref="termref" class="!overflow-hidden h-full w-full p-2 flex flex-row"></div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref, onUnmounted } from "vue";

import "xterm/css/xterm.css";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { onMounted } from "vue";
import { postLinkCmd } from "@renderer/api";

interface IState {
  prefix: string;
  input: string;
}

enum TERMINAL {
  BACK = 8, // 退格删除键
  ENTER = 13, // 回车键
  UP = 38, // 方向盘上键
  DOWN = 40, // 方向盘键
  LEFT = 37, // 方向盘左键
  RIGHT = 39, // 方向盘右键
}
export default defineComponent({
  props: {
    id: [String, Number],
  },
  setup(props) {
    const termref = ref();
    const state = reactive<IState>({
      prefix: "[root@serverip ~]# ",
      input: "",
    });

    let term: Terminal | null = null;
    let addon: FitAddon | null = null;

    // 监听term数据
    const onTermData = (data: string) => {};

    // 光标是否可移动
    const onTermCustomKey = (e: KeyboardEvent) => {
      return true;
    };

    // 初始化
    const init = () => {
      addon = new FitAddon();
      term = new Terminal({
        fontSize: 14,
        fontFamily: "Courier New",
        cursorBlink: true,
        allowProposedApi: true,
        disableStdin: false,
        logLevel: "debug",
        screenReaderMode: true,
        theme: {
          background: "#0C0C0C",
        },
      });
      term.loadAddon(addon);
      term.open(termref.value);
      term.write(state.prefix);

      addon.fit();
      term.focus();

      term.onData(onTermData);
      term.attachCustomKeyEventHandler(onTermCustomKey);

      term.onKey(async (e) => {
        const { key, domEvent } = e;
        console.log(key);
        const { keyCode, altKey, altGraphKey, ctrlKey, metaKey } = domEvent;
        switch (keyCode) {
          case TERMINAL.ENTER:
            term.write("\r\n");
            // 如果为空则不执行
            const input = state.input.trim();
            if (!input) return term.write(`\r${state.prefix}`);
            console.log(input);
            const result = await postLinkCmd<string>({
              id: props.id + "",
              command: state.input.trim(),
            });
            if (result.code === 1) {
              term.writeln(result.data);
            }
            term.write(`\r${state.prefix}`);
            state.input = "";
            break;
        }
      });

      term.onData((data: string) => {
        const printable = data.match(/[\x20-\x7E]/);
        if (printable) {
          state.input += data;
          term.write(data);
        }
      });

      // 光标移动
      term.attachCustomKeyEventHandler((e) => {
        const keyCode = e.keyCode || e.which || e.charCode;
        // const moveKey = [37, 38, 39, 40].includes(keyCode);
        console.log(keyCode);
        const x = term._core.buffer.x;
        if (x <= state.prefix.length) {
          if (keyCode === 37) return false;
        }
        return true;
      });

      state.addon = fitAddon;
      state.term = term;
    };

    const resize = () => {
      state.addon?.fit();
    };

    onMounted(() => {
      init();

      document.addEventListener("resize", resize);
    });

    onUnmounted(() => {
      document.removeEventListener("resize", resize);
      state.term?.dispose();
      state.addon?.dispose();
      state.term = null;
      state.addon = null;
    });

    return {
      termref,
      ...toRefs(state),
    };
  },
});
</script>
<style lang="less">
.xterm {
  width: 100%;
  min-height: 100%;
  overflow: hidden;
}

.xterm-screen {
  padding: 0 5px !important;
}

.xterm-viewport::-webkit-scrollbar {
  background-color: #0c0c0c;
  width: 5px;
}

.xterm-viewport::-webkit-scrollbar-thumb {
  background: #0c0c0c;
}

.xterm-decoration-overview-ruler {
  right: 1px;
  pointer-events: none;
}
</style>
