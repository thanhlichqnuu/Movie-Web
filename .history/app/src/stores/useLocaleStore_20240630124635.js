import { defineStore } from "pinia";

export const useLocaleStore = defineStore("localeStore", {
  state: () => ({
    locale: 'VI',
  }),
  actions: {
    toggleTheme() {
      this.isDark = !this.isDark;
    },
  },
});