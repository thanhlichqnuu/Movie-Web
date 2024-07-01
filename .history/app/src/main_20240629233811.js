import { createApp } from "vue";
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
import { useStateThemeStore } from '@/stores/useStateThemeStore';

// Create Pinia instance
const pinia = createPinia();

// Create Vuetify instance
const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: "dark",
  },
});

// Create Vue app instance
const app = createApp(App);

// Use Pinia
app.use(pinia);

// Access store after Pinia is used
const store = useStateThemeStore();
if (localStorage.getItem('theme') === 'light') {
  store.setLightTheme();
} else {
  store.setDarkTheme();
}

// Use other plugins and mount the app
app
  .use(router)
  .use(vuetify)
  .use(VueAxios, axios)
  .use(Vue3Toastify, {
    autoClose: 1000,
  })
  .mount("#app");
