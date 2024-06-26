<!--
 * @Author: JOY
 * @Date: 2024-06-26 10:07:35
 * @LastEditors: JOY
 * @LastEditTime: 2024-06-26 17:15:41
 * @Description: 
-->
<template>
  <div class="h-full bg-[rgb(12,12,12)]">
    <div ref="termref" class="h-full w-full p-2 flex flex-row"></div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from "vue";

import "xterm/css/xterm.css";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { onMounted } from "vue";
import { postLinkCmd } from "@renderer/api";

interface IState {
  term: Terminal | null;
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
      term: null,
      prefix: "[root@serverip ~]# ",
      input: "",
    });

    const init = () => {
      const fitAddon = new FitAddon();
      const term = new Terminal({
        fontSize: 14,
        cursorBlink: true,
        allowProposedApi: true,
        disableStdin: false,
        logLevel: "debug",
      });
      term.loadAddon(fitAddon);
      term.open(termref.value);
      term.write(state.prefix);

      fitAddon.fit();
      term.focus();

      term.onKey(async (e) => {
        const { key, domEvent } = e;
        const { keyCode, altKey, altGraphKey, ctrlKey, metaKey } = domEvent;
        switch (keyCode) {
          case TERMINAL.ENTER:
            term.write("\r\n");
            const result = await postLinkCmd<string | Array<string>>({
              id: props.id + "",
              command: state.input.trim(),
            });
            if (result.code === 1) {
              if (!result.data) {
                term.writeln("ok");
              } else {
                if (Array.isArray(result.data)) {
                  result.data.forEach((item, index) => {
                    term.writeln(`${index}) ${item}`);
                  });
                } else {
                  term.writeln(result.data);
                }
              }
            }
            term.write(state.prefix);
            state.input = "";
            break;
        }
      });

      term.onData((data: string) => {
        console.log(data);
        state.input += data;
        term.write(data);
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
      state.term = term;
    };

    onMounted(() => {
      init();

      document.addEventListener("resize", () => {
        state.term?.resize(100, 100);
      });
    });

    return {
      termref,
      ...toRefs(state),
    };
  },
});
</script>
