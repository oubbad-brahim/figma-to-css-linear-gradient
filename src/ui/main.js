import "./assets/reset.css";
import "./assets/style.css";
import "highlight.js/styles/github-dark.css";

import { createApp } from "vue";
import ui from "./ui.vue";
import hljs from "highlight.js/lib/core";
import css from "highlight.js/lib/languages/css";
import hljsVuePlugin from "@highlightjs/vue-plugin";

hljs.registerLanguage("css", css);

const app = createApp(ui);
app.use(hljsVuePlugin);
app.mount("#ui");
