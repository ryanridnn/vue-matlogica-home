import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import "./main.scss";

const pinia = createPinia();

createApp(App).use(pinia).mount("#app");
