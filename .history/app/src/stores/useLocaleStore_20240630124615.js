import { defineStore } from "pinia";

export const useLocaleStore = defineStore("localeStore", {
  state: () => ({
    isDark: false,
  }),
  actions: {
    toggleTheme() {
      this.isDark = !this.isDark;
    },
  },
});