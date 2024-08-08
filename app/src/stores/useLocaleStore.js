import { defineStore } from "pinia";

export const useLocaleStore = defineStore("localeStore", {
  state: () => ({
    locale: localStorage.getItem("localeKey") || "VI",
  }),
  actions: {
    setLocale(newLocale) {
      this.locale = newLocale;
      localStorage.setItem("localeKey", this.locale);
    },
  },
});
