import { defineStore } from "pinia";

export const useLocaleStore = defineStore("stateTheme", {
  state: () => ({
    isDark: false,
  }),
  actions: {
    toggleTheme() {
      this.isDark = !this.isDark;
    },
  },
});