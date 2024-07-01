import { defineStore } from "pinia";

export const useStateThemeStore = defineStore("stateTheme", {
  state: () => ({
    locale: localStorage.getItem("localeKey") || 'VI',
  }),
  actions: {
    toggleTheme() {
      this.isDark = !this.isDark;
      localStorage.setItem("themeKey", this.isDark);
    },
  },
});
