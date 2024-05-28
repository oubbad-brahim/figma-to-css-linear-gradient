<script lang="ts" setup>
import { showToast, writeTextToClipboard } from "../utils";
import { computed, ref } from "vue";
import CopyIcon from "../icons/CopyIcon.vue";
import KoFiIcon from '../icons/KoFiIcon.vue'

let message = ref("");
const disabled = computed(() => !message.value);
const code = computed(() =>
  message.value ? message.value : '/* Please select 1 layer. */'
);

onmessage = (event: MessageEvent) => {
  message.value = event.data.pluginMessage as string;
};

const copy = () => {
  writeTextToClipboard(code.value);
  showToast('Copied')
};
</script>

<template>
  <div class="container">
    <highlightjs language="css" :code="code" />
    <button class="btn" @click="copy()" :disabled="disabled" ref="btnCopy">
      <CopyIcon />
    </button>
    <a class="btn kofi" href="https://ko-fi.com/oubbadbrahim" target="_blank">
      <KoFiIcon />
      <span>Buy me a coffee</span>
    </a>
  </div>
</template>

<style scoped>
.btn {
  border-radius: 0.4rem;
  border: 1px solid gray;
  padding: 0.4rem;
  font-family: inherit;
  background-color: var(--ebony-clay);
  cursor: pointer;
  transition: 300ms;
}

.btn {
  position: absolute;
  bottom: 0.8rem;
  right: 0.8rem;
}

.btn.kofi {
  display: flex;
  align-items: center;
  right: auto;
  left: 0.8rem;
  overflow: hidden;
}

.btn.kofi span {
  display: flex;
  align-items: center;
  max-width: 0;
  opacity: 0;
  white-space: nowrap;
  transition: 300ms ease-out;
}

.btn.kofi:hover span {
  max-width: 15ch;
  margin-left: 0.4rem;
  margin-right: 0.4rem;
  opacity: 1;
}

.btn:not(:disabled):not(:active):hover {
  border-color: white;
}

.bnt:disabled {
  color: gray;
  pointer-events: none;
}

.btn:active {
  color: greenyellow;
  border-color: greenyellow;
}
</style>
