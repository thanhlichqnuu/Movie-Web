import { defineStore } from "pinia";

export const useLocaleStore = defineStore("localeStore", {
  state: () => ({
    locale,
  }),
  actions: {
    toggleTheme() {
      this.isDark = !this.isDark;
    },
  },
});