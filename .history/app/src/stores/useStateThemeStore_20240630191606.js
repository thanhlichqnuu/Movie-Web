import { defineStore } from "pinia";

export const useStateThemeStore = defineStore("stateTheme", {
  state: () => ({
    isDark: localStorage.getItem("themeKey") || "false"
  }),
  actions: {
    toggleTheme() {
      this.isDark = !this.isDark;
      const newValue = this.isDark
      localStorage.setItem("themeKey", this.isDark);
    },
  },
});
