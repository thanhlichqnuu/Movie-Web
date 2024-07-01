import { defineStore } from "pinia";

export const useLocaleStore = defineStore("lTheme", {
  state: () => ({
    isDark: false,
  }),
  actions: {
    toggleTheme() {
      this.isDark = !this.isDark;
    },
  },
});