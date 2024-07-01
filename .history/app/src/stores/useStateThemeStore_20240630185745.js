import { defineStore } from "pinia";

export const useStateThemeStore = defineStore("stateTheme", {
  state: () => ({
    isDark: localStorage.getItem("themeKey") || f,
  }),
  actions: {
    toggleTheme() {
      this.isDark = !this.isDark;
      localStorage.setItem("themeKey", this.isDark);
    },
  },
});
