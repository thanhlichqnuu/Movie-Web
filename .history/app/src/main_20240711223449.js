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
import { useLocaleStore } from "./stores/useLocaleStore";

const app = createApp(App);

const pinia = createPinia();
app.use(pinia);

const localeStore = useLocaleStore();
const i18n = createI18n({
  legacy: false,
  locale: localeStore.locale,
  messages: {}, // Start with an empty messages object
});

const loadLocaleMessages = async (locale) => {
  const messages = await import(`./locale/${locale}.json`);
  i18n.global.setLocaleMessage(locale, messages.default);
  i18n.global.locale.value = locale;
};

watch(
  () => localeStore.locale,
  (newLocale) => {
    loadLocaleMessages(newLocale);
  },
  { immediate: true }
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
