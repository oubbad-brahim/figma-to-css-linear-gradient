<script lang="ts" setup>
import { computed, ref } from "vue";
import CopyIcon from "../icons/CopyIcon.vue";

let linearGradient = ref("");
const disabled = computed(() => !linearGradient.value);
const background = computed(() =>
  linearGradient.value ? `background: ${linearGradient.value};` : '/* Select layer */'
);

onmessage = (event: MessageEvent) => {
  linearGradient.value = event.data.pluginMessage as string;
};

const copy = () => {
  writeTextToClipboard(background.value);
};

function writeTextToClipboard(text: string) {
  const prevActive = document.activeElement as HTMLElement;
  const textArea = document.createElement("textarea");

  textArea.value = text;

  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  textArea.style.top = "-999999px";

  document.body.appendChild(textArea);

  textArea.focus();
  textArea.select();

  return new Promise<void>((res, rej) => {
    document.execCommand("copy") ? res() : rej();
    textArea.remove();
    prevActive.focus();
  });
}
</script>

<template>
  <div class="container">
    <highlightjs language="css" :code="background" />
    <button class="btn copy" @click="copy()" :disabled="disabled" ref="btnCopy">
      <CopyIcon />
    </button>
  </div>
</template>

<style>
.hljs {
  display: block;
  width: 100%;
  height: 100%;
  font-size: 1.4rem;
}

.hljs::-webkit-scrollbar {
  display: none;
}

.btn {
  position: absolute;
  bottom: 0.8rem;
  right: 0.8rem;
}

button {
  border-radius: 0.4rem;
  border: 1px solid gray;
  padding: 0.4rem;
  font-family: inherit;
  background-color: transparent;
  cursor: pointer;
  transition: border-color 0.25s;
}

button:not(:disabled):hover {
  border-color: white;
}

button:disabled {
  color: gray;
  pointer-events: none
}
</style>
