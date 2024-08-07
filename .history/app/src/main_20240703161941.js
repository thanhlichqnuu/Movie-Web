import { createApp, watch } from "vue";
import App from "./App.vue";
import router from "./router";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import axios from "axios";
import VueAxios from "vue-axios";
import Vue3Toastify from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import "./global.css";
import { createPinia } from "pinia";
import { createI18n } from "vue-i18n";
import VI from "./locale/vi.json";
import EN from "./locale/en.json";
import { useLocaleStore } from "./stores/useLocaleStore";
import VueSplide from '@splidejs/vue-splide';

const app = createApp(App);

const pinia = createPinia();
app.use(pinia);

const localeStore = useLocaleStore();
const i18n = createI18n({
  legacy: false,
  locale: localeStore.locale,
  messages: {
    VI: VI,
    EN: EN,
  },
});
watch(
  () => localeStore.locale,
  (newLocale) => {
    i18n.global.locale.value = newLocale;
  }
);

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: "dark",
  },
});

app
  .use(router)
  .use(vuetify)
  .use(VueAxios, axios)
  .use(Vue3Toastify, {
    autoClose: 1000,
  })
  .use(i18n)
  .mount("#app");
